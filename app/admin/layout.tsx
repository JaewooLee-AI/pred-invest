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
    <div className="min-h-screen flex bg-white">
      <aside
        className="w-52 shrink-0 flex flex-col bg-zinc-50"
        style={{ borderRight: '1px solid #e4e4e7' }}
      >
        <div className="px-5 py-4" style={{ borderBottom: '1px solid #e4e4e7' }}>
          <Link href="/" className="text-sm font-bold text-zinc-900 tracking-tight">
            CrossAsset
          </Link>
          <p className="text-xs mt-0.5 text-zinc-400 font-mono">Admin</p>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
          {adminNav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-2 text-xs rounded-lg transition-colors text-zinc-500 hover:text-zinc-900 hover:bg-white"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4" style={{ borderTop: '1px solid #e4e4e7' }}>
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full px-3 py-2 text-xs rounded-lg transition-colors text-red-500 hover:bg-red-50 hover:text-red-600 text-left"
            >
              로그아웃
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-white">
        {children}
      </main>
    </div>
  )
}
