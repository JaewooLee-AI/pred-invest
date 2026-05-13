'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import { Suspense } from 'react'

function LoginForm() {
  const [isPending, setIsPending] = useState(false)
  const searchParams = useSearchParams()
  const from = searchParams.get('from') ?? '/admin'
  const errorCode = searchParams.get('error')

  const errorMessages: Record<string, string> = {
    unauthorized: '접근 권한이 없는 계정입니다.',
    auth_failed: '로그인에 실패했습니다. 다시 시도해 주세요.',
    no_code: '인증 코드가 없습니다. 다시 시도해 주세요.',
  }

  async function handleGoogleLogin() {
    setIsPending(true)
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?from=${encodeURIComponent(from)}`,
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3 text-violet-600">◈</div>
          <h1 className="text-xl font-bold text-zinc-900">CrossAsset</h1>
          <p className="text-xs mt-1 text-zinc-400">관리자 로그인</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 p-6 bg-white shadow-sm">
          {errorCode && (
            <div className="mb-4 rounded-lg px-4 py-3 text-xs text-red-700 bg-red-50 border border-red-200 text-center">
              {errorMessages[errorCode] ?? '오류가 발생했습니다.'}
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={isPending}
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 bg-white hover:bg-zinc-50 transition-colors disabled:opacity-50 shadow-sm"
          >
            {/* Google logo SVG */}
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            {isPending ? '연결 중...' : 'Google로 로그인'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
