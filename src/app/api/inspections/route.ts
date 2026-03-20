import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const clientSlug = searchParams.get('client_slug')
  const dateFrom = searchParams.get('date_from')
  const dateTo = searchParams.get('date_to')
  const grade = searchParams.get('grade')

  if (!clientSlug) {
    return NextResponse.json({ error: 'client_slug required' }, { status: 400 })
  }

  // Get client id from slug
  const { data: client } = await supabase
    .from('clients')
    .select('id, name, slug')
    .eq('slug', clientSlug)
    .single()

  if (!client) {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 })
  }

  let query = supabase
    .from('inspections')
    .select('*')
    .eq('client_id', client.id)
    .order('created_at', { ascending: false })

  if (dateFrom) query = query.gte('created_at', dateFrom)
  if (dateTo) query = query.lte('created_at', dateTo + 'T23:59:59')
  if (grade && grade !== 'all') query = query.eq('grade', grade)

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ client, inspections: data })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { data, error } = await supabase
      .from('inspections')
      .insert([body])
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ inspection: data })
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
