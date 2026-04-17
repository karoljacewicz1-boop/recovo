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

STEP 1 — Identify the product precisely:
- Brand, model, type, size if visible
- If unclear, describe the product type in detail

STEP 2 — Assess condition STRICTLY based on real secondhand market realities:
  A = As new — no visible use, tags on or packaging intact, full resale value
  B = Light use — minor cosmetic marks only, clearly sellable with small discount (e.g. clean sneakers worn 2-3x, lightly worn clothing with no damage)
  C = Heavy use — significant wear, soiling, creasing or damage; steep discount needed; some buyers will still buy
  D = Not resellable — ANY of these apply:
      • Safety/work footwear (PPE) with visible use — liability risk, buyers won't buy used PPE
      • Structural damage (broken sole, torn seam, broken zipper that can't be fixed cheaply)
      • Heavy soiling that professional cleaning cannot fix
      • Electronics with cracked screens or non-functional parts
      • Item that a reasonable secondhand buyer would reject even at 70% discount
      Be strict: if in doubt between C and D, choose D.

IMPORTANT market realities to apply:
- Used safety shoes/boots (S1, S2, S3, steel toe, composite toe) = Grade D by default unless literally unworn — buyers know the protective cap may be compromised from impacts
- Heavily creased leather with dirt-embedded soles = Grade C or D, not B
- Clothing with stains or broken fasteners = Grade C minimum
- Electronics with any functional issue = Grade C or D

STEP 3 — Estimate price reduction needed to sell (only if grade A/B/C):
- What % discount vs original retail would a real secondhand buyer expect?
- Be realistic: Grade B = 15–35%, Grade C = 45–70%
- Grade D = item should not be listed for sale (set price_reduction_pct to 100)

Required JSON keys:
- "grade": "A", "B", "C", or "D"
- "product_name": identified product (e.g. "Safety work boot, black leather, S1P class"). If unclear, describe type.
- "condition_summary": one factual sentence — what you see
- "defects": array of strings — each visible defect precisely (empty array if none)
- "resale_recommendation": one sentence — honest recommendation (e.g. "Not suitable for resale — route to textile recycling", "Ready for immediate resale", "Deep clean required before listing")
- "price_reduction_pct": integer 0–100
- "reduction_reason": short phrase explaining the discount (or "Not resellable" for grade D)
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
