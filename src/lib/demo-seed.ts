import { supabase } from './supabase'

function randomTrackingNumber() {
  const digits = Math.floor(Math.random() * 9000000000000 + 1000000000000)
  return `PL${digits}`
}

function daysAgo(n: number) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(Math.floor(Math.random() * 8) + 8, Math.floor(Math.random() * 60))
  return d.toISOString()
}

const DEMO_INSPECTIONS = [
  {
    product: 'Nike Air Max 90, rozmiar 42',
    category: 'Footwear',
    grade: 'A',
    notes: 'Unworn, original box and all accessories included.',
    ai_description: 'Nike Air Max 90 sneakers in size 42. Excellent condition — unworn with original packaging, all accessories and tags present. Classic colorway with iconic Air cushioning unit visible in sole. Ready for immediate resale at full market value.',
    photos: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop',
    ],
    worker: 'Pracownik 1',
    daysAgo: 0,
  },
  {
    product: 'Levi\'s 501 Straight Jeans, W32/L30',
    category: 'Clothing',
    grade: 'A',
    notes: 'All tags attached, never worn. Original folded packaging.',
    ai_description: 'Levi\'s 501 classic straight-fit jeans, W32/L30. Item is in pristine, unworn condition with all original tags attached. No fading, distressing or marks of any kind. Iconic 5-pocket design in classic indigo wash. Ideal for resale as new.',
    photos: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=600&h=600&fit=crop',
    ],
    worker: 'Pracownik 2',
    daysAgo: 0,
  },
  {
    product: 'Zara Oversized Wool Coat, rozmiar M',
    category: 'Clothing',
    grade: 'B',
    notes: 'Small lint balls on inner lining. Outer shell perfect.',
    ai_description: 'Zara oversized wool-blend coat in size M. Overall very good condition with minor pilling visible on inner lining — does not affect the outer appearance or functionality. No stains, tears or structural damage. Buttons intact. Suitable for resale at a slight discount.',
    photos: [
      'https://images.unsplash.com/photo-1548126032-aba3e42e5cf8?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=600&fit=crop',
    ],
    worker: 'Pracownik 3',
    daysAgo: 0,
  },
  {
    product: 'Adidas Stan Smith, rozmiar 38',
    category: 'Footwear',
    grade: 'A',
    notes: 'Perfect condition, both shoes in original box with extra laces.',
    ai_description: 'Adidas Stan Smith sneakers in size 38. Perfect condition — worn once or not at all, soles show no wear. Classic white leather upper with iconic green heel tab. Original box included with extra laces. Top-tier resale candidate.',
    photos: [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1460353581641-37dbe8c7c279?w=600&h=600&fit=crop',
    ],
    worker: 'Pracownik 1',
    daysAgo: 1,
  },
  {
    product: 'Tommy Hilfiger Polo Shirt, rozmiar L',
    category: 'Clothing',
    grade: 'A',
    notes: 'Unworn, tag still attached. Folded in original wrap.',
    ai_description: 'Tommy Hilfiger classic polo shirt in size L. Brand new condition with original tags attached. Crisp piqué fabric with no pilling, stains or deformation. Signature embroidered logo on chest. Ready for immediate resale at full retail value.',
    photos: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1527719327859-a4179d2bc9c0?w=600&h=600&fit=crop',
    ],
    worker: 'Pracownik 2',
    daysAgo: 1,
  },
  {
    product: 'Michael Kors Crossbody Bag, kolor czarny',
    category: 'Accessories',
    grade: 'B',
    notes: 'Light scratches on metal clasp. Leather in excellent shape.',
    ai_description: 'Michael Kors medium crossbody bag in black pebbled leather. Good overall condition — leather body and interior are clean with no stains or tears. Minor surface scratches visible on the gold-tone metal clasp, consistent with light use. Adjustable strap fully functional. Suitable for resale with minor price reduction.',
    photos: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1584917865442-4f7a00a0e843?w=600&h=600&fit=crop',
    ],
    worker: 'Pracownik 3',
    daysAgo: 1,
  },
  {
    product: 'H&M Linen Summer Dress, rozmiar S',
    category: 'Clothing',
    grade: 'C',
    notes: 'Visible stain near hem, approx 2cm. Slight discoloration in armpit area.',
    ai_description: 'H&M linen blend summer dress in size S. Fair condition — a visible stain approximately 2cm in diameter is present near the hem, and slight discoloration is noted in the underarm area. No tears or broken seams. May be suitable for discount resale or donation depending on client policy.',
    photos: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=600&fit=crop',
    ],
    worker: 'Pracownik 1',
    daysAgo: 2,
  },
  {
    product: 'Apple Watch Series 8, 45mm',
    category: 'Electronics',
    grade: 'B',
    notes: 'Minor hairline scratch on display. Band in perfect condition.',
    ai_description: 'Apple Watch Series 8, 45mm aluminium case. Good condition — a hairline scratch is visible on the display under direct light but does not affect screen legibility or functionality. Watch strap is clean and undamaged. Crown and side button operate normally. Suitable for resale at a moderate discount.',
    photos: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=600&h=600&fit=crop',
    ],
    worker: 'Pracownik 2',
    daysAgo: 2,
  },
  {
    product: 'New Balance 574, rozmiar 41',
    category: 'Footwear',
    grade: 'A',
    notes: 'Worn once, soles clean. Original box present.',
    ai_description: 'New Balance 574 classic sneakers in size 41. Near-perfect condition — worn once at most, soles show minimal contact marks. Upper suede and mesh panels clean with no scuffs. Original box included. Strong resale candidate at near-retail price.',
    photos: [
      'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&h=600&fit=crop',
    ],
    worker: 'Pracownik 3',
    daysAgo: 3,
  },
  {
    product: 'Ray-Ban Aviator Classic, złote szkła',
    category: 'Accessories',
    grade: 'A',
    notes: 'In original case with cloth and papers. Unscratched lenses.',
    ai_description: 'Ray-Ban Aviator Classic sunglasses with gold-tone metal frame and G-15 green lenses. Excellent condition — lenses are scratch-free with no chips. Original hard case, cleaning cloth and authenticity card included. One of the strongest resale items in the accessories category.',
    photos: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=600&fit=crop',
    ],
    worker: 'Pracownik 1',
    daysAgo: 3,
  },
  {
    product: 'Mango Leather Biker Jacket, rozmiar M',
    category: 'Clothing',
    grade: 'B',
    notes: 'Small scuff on left elbow. All zips working perfectly.',
    ai_description: 'Mango faux-leather biker jacket in size M. Good condition — a small surface scuff is visible on the left elbow but does not penetrate the material. All zippers function smoothly, snap fasteners intact, lining clean. Recommend resale with minor price adjustment reflecting the cosmetic imperfection.',
    photos: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=600&fit=crop',
    ],
    worker: 'Pracownik 2',
    daysAgo: 4,
  },
  {
    product: 'Samsonite Backpack 20L, kolor navy',
    category: 'Accessories',
    grade: 'C',
    notes: 'Broken zipper on front pocket. Main compartment intact.',
    ai_description: 'Samsonite Urbify backpack 20L in navy blue. Fair condition — the zipper on the front accessory pocket is broken and does not close. Main compartment zipper and laptop sleeve are fully functional. No tears or stains on the body. Recommend repair or discount resale.',
    photos: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=600&h=600&fit=crop',
    ],
    worker: 'Pracownik 3',
    daysAgo: 4,
  },
  {
    product: 'Reserved Knitwear Sweater, rozmiar XL',
    category: 'Clothing',
    grade: 'A',
    notes: 'Tags attached, unworn. Packaged in original foil.',
    ai_description: 'Reserved ribbed knitwear sweater in size XL. Brand new condition — still in original foil packaging with all tags attached. No pilling, pulls or deformation. Neutral color suitable for broad audience. Excellent resale candidate.',
    photos: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop',
    ],
    worker: 'Pracownik 1',
    daysAgo: 5,
  },
  {
    product: 'Puma Suede Classic, rozmiar 44',
    category: 'Footwear',
    grade: 'D',
    notes: 'Heavy sole wear, suede upper severely scuffed. Not resaleable.',
    ai_description: 'Puma Suede Classic sneakers in size 44. Poor condition — extensive wear on both soles with significant suede damage across the upper panels. Multiple deep scuffs and discoloration throughout. Not suitable for resale. Recommend routing to textile recycling.',
    photos: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop',
    ],
    worker: 'Pracownik 2',
    daysAgo: 5,
  },
  {
    product: 'Guess Logo Hoodie, rozmiar S',
    category: 'Clothing',
    grade: 'B',
    notes: 'Slight fading on logo print. Fabric and stitching intact.',
    ai_description: 'Guess logo hoodie in size S. Good condition with minor fading on the front logo print consistent with regular washing. Fabric body is soft with no pilling, stitching is intact throughout, cuffs and hem retain elasticity. Kangaroo pocket and drawstring functional. Suitable for resale at a slight discount.',
    photos: [
      'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=600&h=600&fit=crop',
    ],
    worker: 'Pracownik 3',
    daysAgo: 6,
  },
]

export async function insertDemoData() {
  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('slug', 'demo-brand')
    .single()

  if (!client) {
    console.error('Demo brand client not found. Run SQL setup first.')
    return
  }

  const inspections = DEMO_INSPECTIONS.map((item) => ({
    client_id: client.id,
    tracking_number: randomTrackingNumber(),
    category: item.category,
    grade: item.grade,
    notes: item.notes,
    photos: item.photos,
    worker_name: item.worker,
    ai_description: item.ai_description,
    created_at: daysAgo(item.daysAgo),
  }))

  const { error } = await supabase.from('inspections').insert(inspections)
  if (error) console.error('Seed error:', error)
  else console.log(`✅ ${inspections.length} demo inspections inserted successfully`)
}
