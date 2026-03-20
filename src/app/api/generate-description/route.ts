import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

/**
 * POST /api/generate-description
 *
 * Vision mode:   { images: string[], category?: string, notes?: string }
 * Text fallback: { grade: string,  category?: string, notes?: string }
 *
 * Returns: { grade, description, confidence, value_retention, depreciation_reason }
 */

// Standard value retention ranges per grade
const VALUE_RETENTION: Record<string, { min: number; max: number; label: string }> = {
  A: { min: 85, max: 100, label: 'As new — full resale value' },
  B: { min: 55, max: 75,  label: 'Minor defects — slight discount' },
  C: { min: 20, max: 45,  label: 'Visible damage — significant discount' },
  D: { min: 0,  max: 10,  label: 'Beyond repair — salvage/recycle only' },
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { images, category, notes, grade: fallbackGrade } = body

    // ── Vision mode ───────────────────────────────────────────────────────────
    if (images && Array.isArray(images) && images.length > 0) {

      const imageBlocks: Anthropic.ImageBlockParam[] = images
        .slice(0, 4)
        .map((dataUrl: string) => {
          const commaIdx = dataUrl.indexOf(',')
          const meta     = dataUrl.slice(0, commaIdx)
          const b64      = dataUrl.slice(commaIdx + 1)
          const mediaType = (meta.match(/:(.*?);/)?.[1] ?? 'image/jpeg') as
            | 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
          return {
            type: 'image' as const,
            source: { type: 'base64' as const, media_type: mediaType, data: b64 },
          }
        })

      const prompt = `You are a senior quality-control expert at a European e-commerce returns warehouse. Your assessments are used directly for resale pricing decisions.

Analyse the product photo(s) carefully and return a single JSON object — no markdown, no extra text, only raw JSON.

Grade scale:
  A = As new — no visible defects, original condition, resellable at full price
  B = Minor defects — small scuffs, creases, light pilling, minor marks; clearly sellable with small discount
  C = Damaged — visible tears, broken parts, heavy soiling, structural damage; needs repair or steep discount
  D = Dispose — beyond repair, heavily damaged, unusable for resale

Required JSON keys:
- "grade": one of "A", "B", "C", "D"
- "condition_summary": one sentence — overall condition in plain English
- "defects": array of strings — list each visible defect precisely (empty array if none). Example: ["2cm scuff on left toe cap", "broken zipper pull", "ink stain on collar"]
- "resale_recommendation": one sentence — concrete action for the warehouse (e.g. "Ready for immediate resale", "Steam + minor stain treatment recommended before listing", "Suitable for spare-parts only")
- "value_retention": integer 0–100 — estimated % of original retail value retained. Use these typical ranges as guide:
    A → 85–100, B → 55–75, C → 20–45, D → 0–10
    Adjust within range based on severity of defects observed.
- "depreciation_reason": short phrase explaining the main driver of value loss (or "No depreciation — as new" for grade A)
- "confidence": "high", "medium", or "low" — your confidence in this assessment

Category: ${category || 'unknown'}
Worker notes: ${notes || 'none'}

Output only valid JSON.`

      const message = await client.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 600,
        messages: [{
          role: 'user',
          content: [
            ...imageBlocks,
            { type: 'text', text: prompt },
          ],
        }],
      })

      const raw = message.content[0].type === 'text' ? message.content[0].text.trim() : ''

      const jsonMatch = raw.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        console.error('[generate-description] Model returned non-JSON:', raw)
        return NextResponse.json(
          { error: `Model returned unexpected format: ${raw.slice(0, 120)}` },
          { status: 500 }
        )
      }

      const parsed = JSON.parse(jsonMatch[0])
      const grade = (['A','B','C','D'].includes(parsed.grade)) ? parsed.grade : 'B'

      // Build structured description from components
      const defects = Array.isArray(parsed.defects) && parsed.defects.length > 0
        ? parsed.defects
        : []

      let description = parsed.condition_summary || ''
      if (defects.length > 0) {
        description += ` Defects noted: ${defects.join('; ')}.`
      }
      if (parsed.resale_recommendation) {
        description += ` ${parsed.resale_recommendation}`
      }

      // Clamp value_retention to grade range
      const range = VALUE_RETENTION[grade]
      let valueRetention = typeof parsed.value_retention === 'number'
        ? Math.max(range.min, Math.min(range.max, Math.round(parsed.value_retention)))
        : Math.round((range.min + range.max) / 2)

      return NextResponse.json({
        grade,
        description,
        condition_summary: parsed.condition_summary ?? '',
        defects,
        resale_recommendation: parsed.resale_recommendation ?? '',
        value_retention: valueRetention,
        depreciation_reason: parsed.depreciation_reason ?? VALUE_RETENTION[grade].label,
        confidence: parsed.confidence ?? 'medium',
      })
    }

    // ── Text-only fallback ────────────────────────────────────────────────────
    const gradeLabels: Record<string, string> = {
      A: 'as new, no visible defects',
      B: 'minor defect, generally good condition',
      C: 'damaged, visible defects',
      D: 'heavily damaged, for disposal',
    }

    const range = VALUE_RETENTION[fallbackGrade] || VALUE_RETENTION['B']

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 200,
      messages: [{
        role: 'user',
        content: `Write a 2-sentence product condition description for an e-commerce return.
Category: ${category || 'unknown'}.
Grade: ${fallbackGrade} (${gradeLabels[fallbackGrade] ?? 'unknown'}).
Notes: ${notes || 'none'}.
Be factual and professional. In English.`,
      }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const valueRetention = Math.round((range.min + range.max) / 2)

    return NextResponse.json({
      grade: fallbackGrade,
      description: text,
      defects: [],
      value_retention: valueRetention,
      depreciation_reason: range.label,
      confidence: 'low',
    })

  } catch (err: any) {
    const msg = err?.message ?? 'Unknown error'
    console.error('[generate-description] ERROR:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
