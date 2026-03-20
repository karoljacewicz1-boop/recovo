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
}

const GRADE_COLORS: Record<string, [number, number, number]> = {
  A: [22, 163, 74],    // green
  B: [202, 138, 4],    // yellow
  C: [234, 88, 12],    // orange
  D: [220, 38, 38],    // red
}

const GRADE_LABELS: Record<string, string> = {
  A: 'A — As new',
  B: 'B — Minor defect',
  C: 'C — Damaged',
  D: 'D — Dispose',
}

/** Load an image URL as base64 via canvas (for embedding in PDF) */
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
  const margin = 18
  let y = 0

  // ── Header bar ────────────────────────────────────────────────────────────
  doc.setFillColor(232, 81, 42) // #E8512A
  doc.rect(0, 0, W, 28, 'F')

  // Logo text
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text('Recovo', margin, 17)

  // Tagline
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text('Returns recovered. Value restored.', margin, 23)

  // Report label top right
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('INSPECTION REPORT', W - margin, 13, { align: 'right' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.text(
    new Date(item.created_at).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }),
    W - margin, 20, { align: 'right' }
  )

  y = 38

  // ── Tracking number + grade ───────────────────────────────────────────────
  // Tracking block
  doc.setTextColor(100, 100, 100)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text('TRACKING NUMBER', margin, y)
  y += 5
  doc.setTextColor(26, 26, 26)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(item.tracking_number, margin, y)

  // Grade badge (right side)
  const gradeColor = GRADE_COLORS[item.grade] ?? [100, 100, 100]
  doc.setFillColor(...gradeColor)
  doc.roundedRect(W - margin - 42, y - 14, 42, 16, 3, 3, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.text(GRADE_LABELS[item.grade] ?? item.grade, W - margin - 21, y - 3, { align: 'center' })

  y += 10

  // Divider
  doc.setDrawColor(230, 230, 230)
  doc.setLineWidth(0.3)
  doc.line(margin, y, W - margin, y)
  y += 8

  // ── Info grid ─────────────────────────────────────────────────────────────
  const col2 = W / 2 + 4

  function infoField(label: string, value: string, x: number, yPos: number) {
    doc.setTextColor(130, 130, 130)
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'normal')
    doc.text(label, x, yPos)
    doc.setTextColor(26, 26, 26)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text(value || '—', x, yPos + 5)
  }

  infoField('CLIENT', clientName, margin, y)
  infoField('CATEGORY', item.category, col2, y)
  y += 14

  infoField('WORKER', item.worker_name ?? '—', margin, y)
  infoField('DATE', new Date(item.created_at).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  }), col2, y)
  y += 14

  // Divider
  doc.setDrawColor(230, 230, 230)
  doc.line(margin, y, W - margin, y)
  y += 8

  // ── AI Condition Report ───────────────────────────────────────────────────
  if (item.ai_description) {
    doc.setTextColor(130, 130, 130)
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'normal')
    doc.text('AI CONDITION REPORT', margin, y)
    y += 5

    doc.setTextColor(26, 26, 26)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const lines = doc.splitTextToSize(item.ai_description, W - margin * 2)
    doc.text(lines, margin, y)
    y += lines.length * 5 + 6
  }

  // ── Worker Notes ──────────────────────────────────────────────────────────
  if (item.notes) {
    doc.setTextColor(130, 130, 130)
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'normal')
    doc.text('WORKER NOTES', margin, y)
    y += 5

    doc.setTextColor(26, 26, 26)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const lines = doc.splitTextToSize(item.notes, W - margin * 2)
    doc.text(lines, margin, y)
    y += lines.length * 5 + 6
  }

  // Divider before photos
  if (item.photos && item.photos.length > 0) {
    doc.setDrawColor(230, 230, 230)
    doc.line(margin, y, W - margin, y)
    y += 8

    doc.setTextColor(130, 130, 130)
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'normal')
    doc.text(`PHOTOS (${item.photos.length})`, margin, y)
    y += 6

    // ── Embed photos ─────────────────────────────────────────────────────────
    const photoSize = 52
    const gap = 5
    const photosPerRow = 3
    let px = margin
    let photoCount = 0

    for (const photoUrl of item.photos.slice(0, 6)) {
      const b64 = await loadImageAsBase64(photoUrl)
      if (b64) {
        // New row if needed
        if (photoCount > 0 && photoCount % photosPerRow === 0) {
          y += photoSize + gap
          px = margin
        }

        // Check page overflow
        if (y + photoSize > 270) {
          doc.addPage()
          y = 20
          px = margin
        }

        try {
          doc.addImage(b64, 'JPEG', px, y, photoSize, photoSize)
        } catch {
          // Skip if image can't be embedded
        }

        px += photoSize + gap
        photoCount++
      }
    }

    if (photoCount > 0) y += photoSize + 8
  }

  // ── Footer ────────────────────────────────────────────────────────────────
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setDrawColor(230, 230, 230)
    doc.setLineWidth(0.3)
    doc.line(margin, 285, W - margin, 285)
    doc.setTextColor(160, 160, 160)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.text('Recovo Sp. z o.o. · Laurowa 19b, Wysogotowo, 62-081 Przeźmierowo, Poland · hello@recovo.com', W / 2, 290, { align: 'center' })
    doc.text(`Page ${i} of ${pageCount}`, W - margin, 290, { align: 'right' })
  }

  doc.save(`recovo-${item.tracking_number}.pdf`)
}
