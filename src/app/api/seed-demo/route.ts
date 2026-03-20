import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const CATEGORIES = ['Clothing', 'Footwear', 'Electronics', 'Accessories', 'Other']
// 50% A, 30% B, 15% C, 5% D
const GRADES = ['A','A','A','A','A','A','A','A','B','B','B','B','B','B','C','C','C','D','D','B','A','A','A','B','C']

const NOTES: Record<string, string[]> = {
  A: [
    'Perfect condition, original packaging intact',
    'Unworn, all tags attached',
    'Like new, no signs of use',
    'Pristine condition, factory sealed',
  ],
  B: [
    'Small scuff on sole, otherwise excellent',
    'Minor pilling on fabric, barely visible',
    'Slight crease on packaging, item perfect',
    'Faint mark on inner lining, not visible when worn',
    'Missing one button, easy to replace',
  ],
  C: [
    'Visible tear on seam, 3cm long',
    'Broken zipper pull, zipper still functional',
    'Missing button, light fabric stain on collar',
    'Cracked display corner, screen intact',
    'Fading on left sleeve, moderate wear overall',
  ],
  D: [
    'Completely torn, unwearable',
    'Water damage throughout, strong odor',
    'Broken beyond repair, multiple defects',
  ],
}

const AI_DESCRIPTIONS: Record<string, string[]> = {
  A: [
    'Item is in perfect resalable condition with no visible defects or signs of use. Original packaging is intact and all accessories are present.',
    'Product shows no signs of wear and retains its original quality. Suitable for immediate resale as new.',
  ],
  B: [
    'Item presents minor cosmetic imperfections that do not affect functionality or primary use. Suitable for resale with appropriate grade disclosure.',
    'Product is in good overall condition with slight signs of handling. Recommended for discounted resale on secondary market platforms.',
  ],
  C: [
    'Item shows visible damage that impacts its aesthetic appeal but may retain functional use. Recommended for resale with full defect disclosure at reduced price point.',
    'Product has notable defects requiring disclosure. Suitable for repair-and-resell pipeline or parts harvesting depending on category.',
  ],
  D: [
    'Item is beyond viable resale condition. Recommended for responsible disposal or material recycling in line with sustainability guidelines.',
  ],
}

function randomTrackingNumber() {
  const digits = Math.floor(Math.random() * 9_000_000_000_000 + 1_000_000_000_000)
  return `PL${digits}`
}

function randomDate(daysAgo: number) {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  d.setHours(Math.floor(Math.random() * 9) + 8, Math.floor(Math.random() * 60))
  return d.toISOString()
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export async function POST() {
  // 1. Get demo-brand client
  const { data: client, error: clientErr } = await supabase
    .from('clients')
    .select('id')
    .eq('slug', 'demo-brand')
    .single()

  if (clientErr || !client) {
    return NextResponse.json(
      { error: 'Demo Brand client not found. Run supabase-setup.sql first.' },
      { status: 404 }
    )
  }

  // 2. Check if data already exists — avoid duplicates
  const { count } = await supabase
    .from('inspections')
    .select('id', { count: 'exact', head: true })
    .eq('client_id', client.id)

  if ((count ?? 0) > 0) {
    return NextResponse.json(
      { message: `Demo data already exists (${count} inspections). Delete existing rows first to re-seed.` },
      { status: 200 }
    )
  }

  // 3. Build 25 realistic inspections spread over last 10 days
  const inspections = GRADES.map((grade, i) => ({
    client_id: client.id,
    tracking_number: randomTrackingNumber(),
    category: CATEGORIES[i % CATEGORIES.length],
    grade,
    notes: pick(NOTES[grade]),
    photos: [
      `https://picsum.photos/seed/rec${i + 1}a/400/400`,
      `https://picsum.photos/seed/rec${i + 1}b/400/400`,
    ],
    worker_name: pick(['Pracownik 1', 'Pracownik 2', 'Pracownik 3']),
    ai_description: pick(AI_DESCRIPTIONS[grade]),
    created_at: randomDate(Math.floor(i / 3)),
  }))

  const { error } = await supabase.from('inspections').insert(inspections)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, inserted: inspections.length })
}
