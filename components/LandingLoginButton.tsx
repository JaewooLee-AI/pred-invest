'use client'

import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

interface Props {
  variant?: 'hero' | 'nav'
}

export function LandingLoginButton({ variant = 'hero' }: Props) {
  const [isPending, setIsPending] = useState(false)

  async function handleLogin() {
    setIsPending(true)
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signOut()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
        queryParams: { prompt: 'select_account' },
      },
    })
  }

  if (variant === 'nav') {
    return (
      <button
        onClick={handleLogin}
        disabled={isPending}
        className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90 disabled:opacity-50"
        style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: '#fff' }}
      >
        {isPending ? '연결 중...' : '로그인'}
      </button>
    )
  }

  return (
    <button
      onClick={handleLogin}
      disabled={isPending}
      className="inline-flex items-center gap-3 px-7 py-3.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
      style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
        color: '#fff',
        boxShadow: '0 4px 24px rgba(99,102,241,0.30), 0 1px 4px rgba(79,70,229,0.15)',
      }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="rgba(255,255,255,0.95)" />
        <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="rgba(255,255,255,0.85)" />
        <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="rgba(255,255,255,0.75)" />
        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="rgba(255,255,255,0.95)" />
      </svg>
      {isPending ? '연결 중...' : 'Google 계정으로 시작하기'}
    </button>
  )
}
