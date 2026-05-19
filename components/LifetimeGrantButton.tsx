'use client'

import { grantLifetimeAction } from '@/app/actions/users'

export function LifetimeGrantButton({ email }: { email: string }) {
  return (
    <form
      action={grantLifetimeAction}
      onSubmit={e => {
        if (!confirm(`평생회원으로 지정하시겠습니까?\n\n${email}\n\n⚠️ 이 작업은 취소할 수 없습니다.`)) {
          e.preventDefault()
        }
      }}
    >
      <input type="hidden" name="email" value={email} />
      <button
        type="submit"
        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
        style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)', color: '#fff' }}
      >
        평생 지정
      </button>
    </form>
  )
}
