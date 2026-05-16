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
        className="px-4 py-1.5 rounded-full text-[12px] font-normal transition-colors disabled:opacity-50"
        style={{ background: '#0071e3', color: '#fff' }}
        onMouseEnter={e => e.currentTarget.style.background = '#0077ed'}
        onMouseLeave={e => e.currentTarget.style.background = '#0071e3'}
      >
        {isPending ? '연결 중...' : '로그인'}
      </button>
    )
  }

  return (
    <button
      onClick={handleLogin}
      disabled={isPending}
      className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-[17px] font-normal transition-colors active:scale-[0.98] disabled:opacity-50"
      style={{ background: '#0071e3', color: '#fff' }}
      onMouseEnter={e => e.currentTarget.style.background = '#0077ed'}
      onMouseLeave={e => e.currentTarget.style.background = '#0071e3'}
    >
      {isPending ? '연결 중...' : 'Google 계정으로 로그인'}
    </button>
  )
}
