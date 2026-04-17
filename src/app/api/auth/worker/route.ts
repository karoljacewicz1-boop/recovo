import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { workerName, pin, slug } = await req.json()

    if (!workerName || !pin || !slug) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // Find client by slug
    const { data: client } = await supabase
      .from('clients')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    // Find worker by name + pin for this client
    const { data: worker } = await supabase
      .from('workers')
      .select('id, name, role')
      .eq('client_id', client.id)
      .eq('name', workerName)
      .eq('pin', pin)
      .maybeSingle()

    if (!worker) {
      return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      worker: { id: worker.id, name: worker.name, role: worker.role },
      clientId: client.id,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
