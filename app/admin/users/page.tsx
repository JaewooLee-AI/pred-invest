import { getAllRegisteredUsers } from '@/lib/db'
import { approveUserAction, revokeUserAction } from '@/app/actions/users'
import { LifetimeGrantButton } from '@/components/LifetimeGrantButton'

export const dynamic = 'force-dynamic'

const ADMIN_EMAIL = 'jaewoolee.ai@gmail.com'
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

function getUserStatus(user: { approved: boolean; firstLoginAt: string; lifetime: boolean }) {
  if (user.lifetime) return 'lifetime' as const
  if (user.approved) return 'approved' as const
  const elapsed = Date.now() - new Date(user.firstLoginAt).getTime()
  return elapsed < SEVEN_DAYS_MS ? 'trial' : 'expired' as const
}

function daysElapsed(firstLoginAt: string) {
  return Math.floor((Date.now() - new Date(firstLoginAt).getTime()) / (24 * 60 * 60 * 1000))
}

function StatusBadge({ status, days }: { status: 'lifetime' | 'approved' | 'trial' | 'expired'; days: number }) {
  if (status === 'lifetime') {
    return (
      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
        style={{ background: 'rgba(217,119,6,0.10)', border: '1px solid rgba(217,119,6,0.30)', color: '#d97706' }}>
        ★ 평생회원
      </span>
    )
  }
  if (status === 'approved') {
    return (
      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
        style={{ background: 'var(--emerald-tint)', border: '1px solid var(--emerald-border)', color: 'var(--emerald)' }}>
        승인됨
      </span>
    )
  }
  if (status === 'trial') {
    const remaining = 7 - days
    return (
      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
        style={{ background: 'var(--blue-tint)', border: '1px solid var(--blue-border)', color: 'var(--blue)' }}>
        체험중 D+{days} ({remaining}일 남음)
      </span>
    )
  }
  return (
    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
      style={{ background: 'var(--rose-tint)', border: '1px solid var(--rose-border)', color: 'var(--rose)' }}>
      체험만료 D+{days}
    </span>
  )
}

export default async function UsersPage() {
  const users = await getAllRegisteredUsers()

  const lifetime = users.filter(u => u.lifetime).length
  const approved = users.filter(u => u.approved && !u.lifetime).length
  const trial = users.filter(u => !u.approved && Date.now() - new Date(u.firstLoginAt).getTime() < SEVEN_DAYS_MS).length
  const expired = users.filter(u => !u.approved && Date.now() - new Date(u.firstLoginAt).getTime() >= SEVEN_DAYS_MS).length

  return (
    <div className="p-8 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-mono tracking-[0.18em] uppercase px-2.5 py-1 rounded-full"
            style={{ color: 'var(--indigo-soft)', background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(99,102,241,0.22)' }}>
            Admin Console
          </span>
        </div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>사용자 관리</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Google 로그인 시 7일 무료 체험이 제공됩니다. 승인하면 무기한 사용 가능합니다.
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: '평생회원', value: lifetime, color: '#d97706', tint: 'rgba(217,119,6,0.08)', border: 'rgba(217,119,6,0.25)' },
          { label: '승인됨', value: approved, color: 'var(--emerald)', tint: 'var(--emerald-tint)', border: 'var(--emerald-border)' },
          { label: '체험중', value: trial, color: 'var(--blue)', tint: 'var(--blue-tint)', border: 'var(--blue-border)' },
          { label: '체험만료', value: expired, color: 'var(--rose)', tint: 'var(--rose-tint)', border: 'var(--rose-border)' },
        ].map(({ label, value, color, tint, border }) => (
          <div key={label} className="rounded-xl p-4 text-center" style={{ background: tint, border: `1px solid ${border}` }}>
            <div className="text-2xl font-bold font-mono" style={{ color }}>{value}</div>
            <div className="text-[10px] mt-0.5 font-medium" style={{ color }}>{label}</div>
          </div>
        ))}
      </div>

      {/* User list */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <div className="px-5 py-3 flex items-center justify-between"
          style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)' }}>
          <span className="text-[10px] font-semibold tracking-wide uppercase" style={{ color: 'var(--text-secondary)' }}>
            전체 사용자
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full"
            style={{ background: 'var(--blue-tint)', border: '1px solid var(--blue-border)', color: 'var(--blue)' }}>
            {users.length}명
          </span>
        </div>

        {users.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            로그인한 사용자가 없습니다.
          </div>
        ) : (
          <div>
            {users.map((u, i) => {
              const status = getUserStatus(u)
              const days = daysElapsed(u.firstLoginAt)
              const isAdmin = u.email === ADMIN_EMAIL

              return (
                <div key={u.id} className="flex items-center gap-4 px-5 py-4"
                  style={{ borderBottom: i < users.length - 1 ? '1px solid var(--border)' : 'none', background: 'var(--card)' }}>
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{
                      background: isAdmin ? 'linear-gradient(135deg, #6366f1, #a78bfa)' : 'var(--bg-elevated)',
                      color: isAdmin ? '#fff' : 'var(--text-secondary)',
                      border: isAdmin ? 'none' : '1px solid var(--border)',
                    }}>
                    {u.email.slice(0, 2).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{u.email}</p>
                      {isAdmin && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                          style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#818cf8' }}>
                          관리자
                        </span>
                      )}
                      <StatusBadge status={status} days={days} />
                    </div>
                    <p className="text-[10px] mt-0.5 font-mono" style={{ color: 'var(--text-muted)' }}>
                      최초 로그인: {new Date(u.firstLoginAt).toLocaleDateString('ko-KR')}
                      {u.approvedBy && ` · 승인: ${u.approvedBy}`}
                    </p>
                  </div>

                  {/* Actions */}
                  {!isAdmin && (
                    <div className="shrink-0 flex items-center gap-2">
                      {status === 'lifetime' ? null : status === 'approved' ? (
                        <>
                          <LifetimeGrantButton email={u.email} />
                          <form action={revokeUserAction}>
                            <input type="hidden" name="email" value={u.email} />
                            <button type="submit" className="btn-danger text-xs px-3 py-1.5 rounded-lg">
                              승인 취소
                            </button>
                          </form>
                        </>
                      ) : (
                        <form action={approveUserAction}>
                          <input type="hidden" name="email" value={u.email} />
                          <button type="submit"
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
                            style={{ background: 'linear-gradient(135deg, #059669, #10b981)', color: '#fff' }}>
                            승인
                          </button>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="rounded-xl p-4 mt-4" style={{ background: 'var(--amber-tint)', border: '1px solid var(--amber-border)' }}>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          <span className="font-semibold" style={{ color: 'var(--amber)' }}>안내 </span>
          구글 로그인한 모든 사용자는 최초 로그인일로부터 7일간 무료 체험이 제공됩니다.
          체험 기간 만료 전 또는 후에 승인하면 무기한 사용 가능합니다.
          체험 만료 후 미승인 사용자는 로그인 시 승인 요청 안내를 받습니다.
        </p>
      </div>
    </div>
  )
}
