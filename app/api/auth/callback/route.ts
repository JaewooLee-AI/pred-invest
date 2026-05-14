import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`)
  }

  const successResponse = NextResponse.redirect(`${origin}/dashboard`)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            successResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)
  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`)
  }

  const email = data.user.email ?? ''

  // 최초 로그인이면 레코드 생성 (이미 있으면 무시)
  await supabase.from('pred_invest_users').insert({ email })

  // 사용자 레코드 조회
  const { data: user } = await supabase
    .from('pred_invest_users')
    .select('approved, first_login_at')
    .eq('email', email)
    .maybeSingle()

  if (!user) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`)
  }

  const withinTrial = Date.now() - new Date(user.first_login_at).getTime() < SEVEN_DAYS_MS
  const hasAccess = user.approved || withinTrial

  if (!hasAccess) {
    const denied = NextResponse.redirect(`${origin}/login?error=approval_required`)
    successResponse.cookies.getAll().forEach(({ name }) => denied.cookies.delete(name))
    return denied
  }

  return successResponse
}
