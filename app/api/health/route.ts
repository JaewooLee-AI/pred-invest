import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    return NextResponse.json({
      ok: false,
      error: 'env vars missing',
      SUPABASE_URL: !!url,
      SUPABASE_ANON_KEY: !!key,
    })
  }

  try {
    const { createClient } = await import('@supabase/supabase-js')
    const sb = createClient(url, key, { auth: { persistSession: false } })
    const { data, error } = await sb.from('pred_invest_csv_uploads').select('id').limit(1)
    return NextResponse.json({
      ok: !error,
      error: error?.message ?? null,
      errorCode: error?.code ?? null,
      rowCount: data?.length ?? 0,
      url: url.slice(0, 30) + '...',
      keyPrefix: key.slice(0, 20) + '...',
    })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}
