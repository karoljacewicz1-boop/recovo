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

STEP 3 — Estimate individual market value:
- Look at the specific product: its brand, model, current demand, typical secondhand market prices in Europe (Vinted, Zalando Lounge, BackMarket, StockX, Vestiaire Collective etc.)
- Estimate retail_price_eur: what this exact product costs NEW in European retail today
- Estimate resale_price_eur: realistic current resale price in THIS condition on European secondhand market
- Both must be realistic integers in EUR — not generic ranges, but your best individual estimate for this specific item

Required JSON keys:
- "grade": "A", "B", "C", or "D"
- "product_name": identified product name (e.g. "Nike Air Max 90 White/Grey UK8", "Levi's 501 W32/L30 Indigo", "Apple Watch Series 8 45mm Midnight")
- "product_identified": true or false — were you able to identify the brand/model?
- "condition_summary": one sentence — overall condition
- "defects": array of strings — each visible defect precisely described (empty array if none)
- "resale_recommendation": one sentence — concrete action (e.g. "Ready for immediate resale", "Light cleaning recommended before listing")
- "retail_price_eur": integer — estimated new retail price in EUR for this specific product
- "resale_price_eur": integer — estimated realistic resale price in EUR in current condition
- "value_retention": integer 0–100 — percentage of retail value retained (resale_price_eur / retail_price_eur * 100)
- "depreciation_reason": short phrase — main driver of value loss (or "No depreciation — as new" for grade A)
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

      const retailPrice  = typeof parsed.retail_price_eur  === 'number' ? Math.round(parsed.retail_price_eur)  : null
      const resalePrice  = typeof parsed.resale_price_eur  === 'number' ? Math.round(parsed.resale_price_eur)  : null
      const valueRetention = retailPrice && resalePrice
        ? Math.round((resalePrice / retailPrice) * 100)
        : (typeof parsed.value_retention === 'number' ? Math.round(parsed.value_retention) : null)

      return NextResponse.json({
        grade,
        description,
        product_name: parsed.product_name ?? null,
        product_identified: parsed.product_identified ?? false,
        condition_summary: parsed.condition_summary ?? '',
        defects,
        resale_recommendation: parsed.resale_recommendation ?? '',
        retail_price_eur: retailPrice,
        resale_price_eur: resalePrice,
        value_retention: valueRetention,
        depreciation_reason: parsed.depreciation_reason ?? '',
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
      retail_price_eur: null,
      resale_price_eur: null,
      value_retention: null,
      depreciation_reason: '',
      confidence: 'low',
    })

  } catch (err: any) {
    const msg = err?.message ?? 'Unknown error'
    console.error('[generate-description] ERROR:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
