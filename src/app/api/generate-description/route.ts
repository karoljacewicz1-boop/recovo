import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

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

      const prompt = `You are a senior returns specialist at a European e-commerce warehouse with deep knowledge of fashion, footwear, electronics and accessories markets.

Analyse the product in the photo(s) and return a single JSON object — no markdown, no explanation, only raw JSON.

STEP 1 — Identify the product as precisely as possible:
- Brand, product name/model, colorway, size if visible
- If brand/model is unclear, describe the product type and visible details

STEP 2 — Assess condition:
  A = As new — no defects, resellable at full price
  B = Minor defects — small scuffs/marks/creases, sellable with small discount
  C = Damaged — visible tears/breaks/heavy soiling, needs repair or steep discount
  D = Dispose — beyond repair, not resellable

STEP 3 — Estimate price reduction needed to sell:
- Based on the defects and condition, estimate by how many percent the seller needs to reduce the original price to still sell this item on the secondhand market
- Think practically: what discount would a buyer expect given what you see?
- Grade A: 0–10% reduction, Grade B: 15–35%, Grade C: 40–65%, Grade D: 70–100%
- Give a specific number, not a range

Required JSON keys:
- "grade": "A", "B", "C", or "D"
- "product_name": identified product name (e.g. "Nike Air Max 90 White/Grey UK8", "Levi's 501 W32/L30 Indigo"). If unclear, describe type.
- "condition_summary": one sentence — overall condition
- "defects": array of strings — each visible defect precisely described (empty array if none)
- "resale_recommendation": one sentence — concrete action (e.g. "Ready for immediate resale", "Light cleaning recommended before listing")
- "price_reduction_pct": integer 0–100 — estimated % price reduction needed to sell vs original price
- "reduction_reason": short phrase — why this discount is needed (or "No discount needed" for grade A)
- "confidence": "high", "medium", or "low"

Category hint: ${category || 'unknown'}
Worker notes: ${notes || 'none'}

Output only valid JSON.`

      const message = await client.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 700,
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

      const defects = Array.isArray(parsed.defects) && parsed.defects.length > 0
        ? parsed.defects
        : []

      // Build full description
      let description = parsed.condition_summary || ''
      if (defects.length > 0) {
        description += ` Defects noted: ${defects.join('; ')}.`
      }
      if (parsed.resale_recommendation) {
        description += ` ${parsed.resale_recommendation}`
      }

      const priceReduction = typeof parsed.price_reduction_pct === 'number'
        ? Math.min(100, Math.max(0, Math.round(parsed.price_reduction_pct)))
        : null

      return NextResponse.json({
        grade,
        description,
        product_name: parsed.product_name ?? null,
        condition_summary: parsed.condition_summary ?? '',
        defects,
        resale_recommendation: parsed.resale_recommendation ?? '',
        price_reduction_pct: priceReduction,
        reduction_reason: parsed.reduction_reason ?? '',
        value_retention: priceReduction !== null ? 100 - priceReduction : null,
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

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 200,
      messages: [{
        role: 'user',
        content: `Write a 2-sentence product condition description for an e-commerce return.
Category: ${category || 'unknown'}. Grade: ${fallbackGrade} (${gradeLabels[fallbackGrade] ?? 'unknown'}). Notes: ${notes || 'none'}.
Be factual and professional. In English.`,
      }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    return NextResponse.json({
      grade: fallbackGrade,
      description: text,
      defects: [],
      price_reduction_pct: null,
      reduction_reason: '',
      value_retention: null,
      confidence: 'low',
    })

  } catch (err: any) {
    const msg = err?.message ?? 'Unknown error'
    console.error('[generate-description] ERROR:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
