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
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      <aside
        className="w-52 shrink-0 flex flex-col border-r"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <Link href="/" className="flex items-center gap-2">
            <span style={{ color: 'var(--accent-amber)' }}>◈</span>
            <span className="text-sm font-bold text-white">CrossAsset</span>
          </Link>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Admin</p>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {adminNav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-2 text-xs rounded-lg transition-colors hover:bg-zinc-800 hover:text-white"
              style={{ color: 'var(--muted)' }}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full px-3 py-2 text-xs rounded-lg text-red-400 hover:bg-zinc-800 transition-colors text-left"
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
