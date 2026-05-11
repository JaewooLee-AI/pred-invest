import Link from 'next/link'
import { logoutAction } from '@/app/actions/auth'

const adminNav = [
  { href: '/admin', label: '대시보드' },
  { href: '/admin/upload-csv', label: 'CSV 업로드' },
  { href: '/admin/weekly-shift', label: '주간 궤적 업로드' },
  { href: '/admin/notice', label: '공지사항 업로드' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ background: '#000' }}>
      <aside
        className="w-52 shrink-0 flex flex-col"
        style={{
          background: 'rgba(255,255,255,0.03)',
          borderRight: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <Link href="/" className="flex items-center gap-2">
            <span
              className="text-sm font-semibold tracking-tight"
              style={{
                background: 'linear-gradient(135deg, #f5f5f7 0%, rgba(245,245,247,0.6) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              CrossAsset
            </span>
          </Link>
          <p className="text-xs mt-0.5" style={{ color: '#3a3a3c' }}>Admin</p>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
          {adminNav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-2 text-xs rounded-xl transition-all hover:opacity-80"
              style={{ color: '#86868b', background: 'transparent' }}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full px-3 py-2 text-xs rounded-xl transition-all hover:opacity-80 text-left"
              style={{ color: '#ff453a' }}
            >
              로그아웃
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
