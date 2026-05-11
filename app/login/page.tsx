'use client'

import { useState, useTransition } from 'react'
import { loginAction } from '@/app/actions/auth'

export default function LoginPage() {
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(formData: FormData) {
    setError('')
    startTransition(async () => {
      const result = await loginAction(formData)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
         style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3" style={{ color: 'var(--accent-amber)' }}>◈</div>
          <h1 className="text-xl font-bold text-white">CrossAsset</h1>
          <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>관리자 로그인</p>
        </div>

        <div className="rounded-2xl border p-6"
             style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <form action={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>
                아이디
              </label>
              <input
                name="id"
                type="text"
                autoComplete="username"
                required
                className="w-full rounded-lg border px-3 py-2 text-sm text-white outline-none transition-colors focus:border-blue-500"
                style={{ background: '#0e0e11', borderColor: 'var(--border)' }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>
                비밀번호
              </label>
              <input
                name="pw"
                type="password"
                autoComplete="current-password"
                required
                className="w-full rounded-lg border px-3 py-2 text-sm text-white outline-none transition-colors focus:border-blue-500"
                style={{ background: '#0e0e11', borderColor: 'var(--border)' }}
              />
            </div>
            {error && (
              <p className="text-xs text-red-400 text-center">{error}</p>
            )}
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-lg py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50 mt-1"
              style={{ background: 'var(--accent-blue)' }}
            >
              {isPending ? '로그인 중...' : '로그인'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
