import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

/**
 * POST /api/generate-description
 *
 * Vision mode:   { images: string[], category?: string, notes?: string }
 * Text fallback: { grade: string,  category?: string, notes?: string }
 *
 * Returns: { grade, description, confidence }
 */
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

      const prompt = `You are a quality-control expert for an e-commerce returns warehouse.

Analyse the product photo(s) and respond with a single JSON object — no markdown, no explanation, just raw JSON.

Keys required:
- "grade": exactly one of "A", "B", "C", "D"
    A = As new — no defects, resellable immediately
    B = Minor defect — small scuff/mark/crease, still clearly sellable
    C = Damaged — visible tear/break/heavy soiling, needs repair or heavy discount
    D = Dispose — beyond repair, unusable
- "description": 2–3 factual, professional sentences about the item's visible condition. Mention specific defects if present.
- "confidence": "high", "medium", or "low"

Category: ${category || 'unknown'}
Worker notes: ${notes || 'none'}

Output only valid JSON.`

      const message = await client.messages.create({
        model: 'claude-sonnet-4-5',   // confirmed vision-capable model
        max_tokens: 400,
        messages: [{
          role: 'user',
          content: [
            ...imageBlocks,
            { type: 'text', text: prompt },
          ],
        }],
      })

      const raw = message.content[0].type === 'text' ? message.content[0].text.trim() : ''

      // Robust JSON extraction — handle ```json fences or extra whitespace
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

      return NextResponse.json({
        grade,
        description: parsed.description ?? '',
        confidence:  parsed.confidence  ?? 'medium',
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
Category: ${category || 'unknown'}.
Grade: ${fallbackGrade} (${gradeLabels[fallbackGrade] ?? 'unknown'}).
Notes: ${notes || 'none'}.
Be factual and professional. In English.`,
      }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    return NextResponse.json({ grade: fallbackGrade, description: text, confidence: 'low' })

  } catch (err: any) {
    // Surface the real error message to the client (useful during dev)
    const msg = err?.message ?? 'Unknown error'
    console.error('[generate-description] ERROR:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
