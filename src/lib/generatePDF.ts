import jsPDF from 'jspdf'

type Inspection = {
  id: string
  tracking_number: string
  category: string
  grade: string
  notes: string | null
  photos: string[] | null
  ai_description: string | null
  created_at: string
  worker_name: string | null
  value_retention: number | null
  retail_price_eur: number | null
  resale_price_eur: number | null
}

const GRADE_COLORS: Record<string, [number, number, number]> = {
  A: [22, 163, 74],
  B: [202, 138, 4],
  C: [234, 88, 12],
  D: [220, 38, 38],
}

const GRADE_LABELS: Record<string, string> = {
  A: 'Grade A — As new',
  B: 'Grade B — Minor defect',
  C: 'Grade C — Damaged',
  D: 'Grade D — Dispose',
}

async function loadImageAsBase64(url: string): Promise<string | null> {
  try {
    const res = await fetch(url)
    const blob = await res.blob()
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => resolve(null)
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

export async function generateInspectionPDF(
  item: Inspection,
  clientName: string
): Promise<void> {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const W = 210
  const M = 20       // margin
  const CW = W - M * 2  // content width
  let y = 0

  // ── Header ──────────────────────────────────────────────────────────────────
  doc.setFillColor(232, 81, 42)
  doc.rect(0, 0, W, 24, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('Recovo', M, 15)

  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'normal')
  doc.text('INSPECTION REPORT', W - M, 10, { align: 'right' })
  doc.text(
    new Date(item.created_at).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
    }),
    W - M, 16, { align: 'right' }
  )

  y = 34

  // ── Tracking number ──────────────────────────────────────────────────────────
  doc.setTextColor(150, 150, 150)
  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'normal')
  doc.text('TRACKING NUMBER', M, y)

  doc.setTextColor(26, 26, 26)
  doc.setFontSize(15)
  doc.setFont('helvetica', 'bold')
  doc.text(item.tracking_number, M, y + 6)

  // Grade pill — right aligned, same row
  const gradeColor = GRADE_COLORS[item.grade] ?? [100, 100, 100]
  const gradeLabel = GRADE_LABELS[item.grade] ?? item.grade
  const pillW = 52
  const pillH = 10
  const pillX = W - M - pillW
  doc.setFillColor(...gradeColor)
  doc.roundedRect(pillX, y - 1, pillW, pillH, 2, 2, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'bold')
  doc.text(gradeLabel, pillX + pillW / 2, y + 5.5, { align: 'center' })

  y += 14

  // Divider
  doc.setDrawColor(220, 220, 220)
  doc.setLineWidth(0.3)
  doc.line(M, y, W - M, y)
  y += 8

  // ── Info row ─────────────────────────────────────────────────────────────────
  // 4 columns equally spaced
  const cols = [M, M + CW * 0.25, M + CW * 0.5, M + CW * 0.75]
  const fields = [
    { label: 'CLIENT',   value: clientName },
    { label: 'CATEGORY', value: item.category },
    { label: 'WORKER',   value: item.worker_name ?? '—' },
    { label: 'DATE',     value: new Date(item.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) },
  ]

  fields.forEach((f, i) => {
    doc.setTextColor(150, 150, 150)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.text(f.label, cols[i], y)
    doc.setTextColor(26, 26, 26)
    doc.setFontSize(9.5)
    doc.setFont('helvetica', 'bold')
    doc.text(f.value, cols[i], y + 5)
  })

  y += 14

  // Divider
  doc.setDrawColor(220, 220, 220)
  doc.line(M, y, W - M, y)
  y += 8

  // ── Price reduction box ──────────────────────────────────────────────────────
  if (item.value_retention !== null) {
    const reduction = 100 - item.value_retention
    const boxH = 22

    // Background
    doc.setFillColor(250, 250, 250)
    doc.setDrawColor(220, 220, 220)
    doc.setLineWidth(0.3)
    doc.roundedRect(M, y, CW, boxH, 2, 2, 'FD')

    // Left: label
    doc.setTextColor(150, 150, 150)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.text('ESTIMATED PRICE REDUCTION TO SELL', M + 5, y + 7)

    // Big number
    const [r, g, b] = reduction <= 10
      ? [22, 163, 74]
      : reduction <= 35
      ? [202, 138, 4]
      : reduction <= 65
      ? [234, 88, 12]
      : [220, 38, 38]

    doc.setTextColor(r, g, b)
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text(`-${reduction}%`, M + 5, y + 17)

    // Progress bar (right side)
    const barX = M + 55
    const barW = CW - 60
    const barY = y + 10
    const barH2 = 4

    doc.setFillColor(220, 220, 220)
    doc.roundedRect(barX, barY, barW, barH2, 2, 2, 'F')

    // Fill = value retained (green portion)
    const fillW = Math.max(4, (item.value_retention / 100) * barW)
    doc.setFillColor(r, g, b)
    doc.roundedRect(barX, barY, fillW, barH2, 2, 2, 'F')

    // Labels under bar
    doc.setTextColor(150, 150, 150)
    doc.setFontSize(6.5)
    doc.setFont('helvetica', 'normal')
    doc.text('0%', barX, barY + 8)
    doc.text('100%', barX + barW, barY + 8, { align: 'right' })
    doc.setTextColor(r, g, b)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'bold')
    doc.text(`${item.value_retention}% value retained`, barX + barW / 2, barY + 8, { align: 'center' })

    y += boxH + 8
  }

  // ── AI Condition Report ───────────────────────────────────────────────────────
  if (item.ai_description) {
    doc.setTextColor(150, 150, 150)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.text('AI CONDITION REPORT', M, y)
    y += 5

    doc.setTextColor(26, 26, 26)
    doc.setFontSize(9.5)
    doc.setFont('helvetica', 'normal')
    const lines = doc.splitTextToSize(item.ai_description, CW)
    doc.text(lines, M, y)
    y += lines.length * 4.8 + 7
  }

  // ── Worker Notes ──────────────────────────────────────────────────────────────
  if (item.notes) {
    doc.setTextColor(150, 150, 150)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.text('WORKER NOTES', M, y)
    y += 5

    doc.setTextColor(26, 26, 26)
    doc.setFontSize(9.5)
    doc.setFont('helvetica', 'normal')
    const lines = doc.splitTextToSize(item.notes, CW)
    doc.text(lines, M, y)
    y += lines.length * 4.8 + 7
  }

  // ── Photos ────────────────────────────────────────────────────────────────────
  if (item.photos && item.photos.length > 0) {
    doc.setDrawColor(220, 220, 220)
    doc.line(M, y, W - M, y)
    y += 6

    doc.setTextColor(150, 150, 150)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.text(`PHOTOS (${Math.min(item.photos.length, 6)})`, M, y)
    y += 6

    const photoSize = 50
    const gap = 5
    const perRow = 3
    let col = 0

    for (const photoUrl of item.photos.slice(0, 6)) {
      const b64 = await loadImageAsBase64(photoUrl)
      if (!b64) continue

      const px = M + col * (photoSize + gap)

      if (y + photoSize > 272) {
        doc.addPage()
        y = 20
      }

      try {
        doc.addImage(b64, 'JPEG', px, y, photoSize, photoSize)
      } catch { /* skip */ }

      col++
      if (col >= perRow) {
        col = 0
        y += photoSize + gap
      }
    }

    if (col > 0) y += photoSize + gap
    y += 4
  }

  // ── Footer ────────────────────────────────────────────────────────────────────
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setDrawColor(220, 220, 220)
    doc.setLineWidth(0.3)
    doc.line(M, 284, W - M, 284)
    doc.setTextColor(170, 170, 170)
    doc.setFontSize(6.5)
    doc.setFont('helvetica', 'normal')
    doc.text(
      'Recovo Sp. z o.o. · Laurowa 19b, Wysogotowo, 62-081 Przeźmierowo · hello@recovo.com',
      W / 2, 289, { align: 'center' }
    )
    doc.text(`Page ${i} / ${pageCount}`, W - M, 289, { align: 'right' })
  }

  doc.save(`recovo-${item.tracking_number}.pdf`)
}
