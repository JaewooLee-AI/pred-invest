import Link from 'next/link'
import Image from 'next/image'
import { logoutAction } from '@/app/actions/auth'

const adminNav = [
  { href: '/admin', label: '대시보드', icon: '◫' },
  { href: '/admin/upload-csv', label: 'CSV 업로드', icon: '◉' },
  { href: '/admin/upload-prob', label: '확률/지수 업로드', icon: '◌' },
  { href: '/admin/weekly-shift', label: '주간 궤적 업로드', icon: '◎' },
  { href: '/admin/closing-price', label: '종가 데이터 업로드', icon: '◈' },
  { href: '/admin/notice', label: '공지사항 업로드', icon: '◻' },
  { href: '/admin/users', label: '사용자 관리', icon: '◑' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      <aside
        className="w-52 shrink-0 flex flex-col"
        style={{
          background: 'var(--card)',
          borderRight: '1px solid var(--border)',
        }}
      >
        {/* Logo */}
        <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <Link href="/" className="flex flex-col gap-1 shrink-0">
            <div style={{ height: '52px', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
              <Image
                src="/logo.png"
                alt="CrossAsset"
                width={2400}
                height={1309}
                style={{ height: '150px', width: 'auto', marginTop: '-49px', marginBottom: '-49px', transform: 'scale(0.7)', transformOrigin: 'left center' }}
                priority
              />
            </div>
            <p className="text-[10px] font-mono px-0.5" style={{ color: 'var(--text-muted)' }}>
              Admin Console
            </p>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
          {adminNav.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className="nav-item flex items-center gap-2.5 text-xs"
            >
              <span className="text-sm shrink-0" style={{ color: 'var(--text-muted)' }}>{icon}</span>
              {label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4" style={{ borderTop: '1px solid var(--border)' }}>
          <form action={logoutAction}>
            <button
              type="submit"
              className="btn-danger w-full flex items-center gap-2 text-xs text-left"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M4.5 6H10M8 4l2 2-2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6.5 2H2.5a.5.5 0 00-.5.5v7a.5.5 0 00.5.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              로그아웃
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 overflow-auto" style={{ background: 'var(--bg)' }}>
        {children}
      </main>
    </div>
  )
}
