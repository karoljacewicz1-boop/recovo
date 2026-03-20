import { NextResponse } from 'next/server'
import { insertDemoData } from '@/lib/demo-seed'

export async function GET() {
  try {
    await insertDemoData()
    return NextResponse.json({ success: true, message: 'Demo data inserted!' })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
