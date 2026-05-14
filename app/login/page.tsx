'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import { Suspense } from 'react'

function ApprovalRequiredDialog() {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-7 text-center"
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border-strong)',
          boxShadow: '0 16px 48px rgba(79,70,229,0.15)',
        }}
      >
        {/* Icon */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: 'var(--amber-tint)', border: '1px solid var(--amber-border)' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              stroke="var(--amber)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h2 className="text-base font-bold mb-2" style={{ color: 'var(--text)' }}>
          체험 기간이 만료되었습니다
        </h2>
        <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
          최초 로그인 후 7일 체험 기간이 종료되었습니다.<br />
          계속 사용하시려면 관리자에게 승인 요청을 해주세요.
        </p>

        <button
          onClick={() => { window.location.href = '/' }}
          className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: '#fff' }}
        >
          확인
        </button>
      </div>
    </div>
  )
}

function LoginForm() {
  const [isPending, setIsPending] = useState(false)
  const searchParams = useSearchParams()
  const errorCode = searchParams.get('error')

  const errorMessages: Record<string, string> = {
    unauthorized: '접근 권한이 없는 계정입니다.',
    auth_failed: '로그인에 실패했습니다. 다시 시도해 주세요.',
    no_code: '인증 코드가 없습니다. 다시 시도해 주세요.',
  }

  async function handleGoogleLogin() {
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

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: 'var(--bg)' }}
    >
      {/* 승인 만료 다이얼로그 */}
      {errorCode === 'approval_required' && <ApprovalRequiredDialog />}

      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4"
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)',
              boxShadow: '0 4px 16px rgba(99,102,241,0.30)',
            }}
          >
            ◈
          </div>
          <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
            CrossAsset
          </h1>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            크로스에셋 분석 플랫폼
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border-strong)',
            boxShadow: '0 8px 32px rgba(79,70,229,0.10)',
          }}
        >
          <div className="mb-5">
            <h2 className="text-base font-semibold mb-1" style={{ color: 'var(--text)' }}>
              로그인
            </h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Google 계정으로 로그인하여 분석 데이터에 접근하세요
            </p>
          </div>

          {errorCode && errorCode !== 'approval_required' && (
            <div
              className="mb-4 rounded-xl px-4 py-3 text-xs text-center"
              style={{
                color: 'var(--rose)',
                background: 'var(--rose-tint)',
                border: '1px solid var(--rose-border)',
              }}
            >
              {errorMessages[errorCode] ?? '오류가 발생했습니다.'}
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={isPending}
            className="w-full flex items-center justify-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all"
            style={{
              background: isPending ? 'var(--bg)' : 'var(--bg-elevated)',
              border: '1px solid var(--border-strong)',
              color: 'var(--text)',
              opacity: isPending ? 0.6 : 1,
              boxShadow: '0 1px 4px rgba(79,70,229,0.06)',
            }}
            onMouseEnter={e => {
              if (!isPending) {
                (e.currentTarget as HTMLButtonElement).style.background = 'var(--card-hover)'
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-accent)'
              }
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-elevated)'
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-strong)'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
            </svg>
            {isPending ? '연결 중...' : 'Google로 로그인'}
          </button>

          <p className="text-[10px] text-center mt-4 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            최초 로그인 시 7일간 무료 체험이 제공됩니다
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] mt-6" style={{ color: 'var(--text-muted)' }}>
          CrossAsset Analytics &copy; 2025
        </p>
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
