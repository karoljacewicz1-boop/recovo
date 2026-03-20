import { supabase } from './supabase'

const CATEGORIES = ['Clothing', 'Footwear', 'Electronics', 'Accessories', 'Other']
const GRADES = ['A', 'A', 'A', 'A', 'A', 'B', 'B', 'B', 'C', 'C', 'C', 'D', 'D', 'B', 'A'] // 50% A, 30% B, 15% C, 5% D approx

function randomTrackingNumber() {
  const digits = Math.floor(Math.random() * 9000000000000 + 1000000000000)
  return `PL${digits}`
}

function randomDate(daysAgo: number) {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  d.setHours(Math.floor(Math.random() * 8) + 8, Math.floor(Math.random() * 60))
  return d.toISOString()
}

const NOTES: Record<string, string[]> = {
  A: ['Perfect condition, original packaging', 'Unworn, all tags attached', 'Like new, no signs of use'],
  B: ['Small scuff on sole', 'Minor pilling on fabric', 'Slight crease on packaging', 'Faint mark on inner lining'],
  C: ['Visible tear on seam', 'Broken zipper', 'Missing button, fabric stained', 'Cracked display corner'],
  D: ['Completely torn, unwearable', 'Water damage throughout', 'Broken beyond repair'],
}

export async function insertDemoData() {
  // Get demo-brand client id
  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('slug', 'demo-brand')
    .single()

  if (!client) {
    console.error('Demo brand client not found. Run SQL setup first.')
    return
  }

  const inspections = GRADES.map((grade, i) => {
    const noteList = NOTES[grade]
    return {
      client_id: client.id,
      tracking_number: randomTrackingNumber(),
      category: CATEGORIES[i % CATEGORIES.length],
      grade,
      notes: noteList[Math.floor(Math.random() * noteList.length)],
      photos: [
        `https://picsum.photos/seed/${i + 1}a/400/400`,
        `https://picsum.photos/seed/${i + 1}b/400/400`,
      ],
      worker_name: ['Pracownik 1', 'Pracownik 2', 'Pracownik 3'][i % 3],
      ai_description: null,
      created_at: randomDate(Math.floor(i / 3)),
    }
  })

  const { error } = await supabase.from('inspections').insert(inspections)
  if (error) console.error('Seed error:', error)
  else console.log('Demo data inserted successfully')
}
