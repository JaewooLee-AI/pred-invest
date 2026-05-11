import Link from 'next/link'

const navLinks = [
  { href: '/', label: '대시보드' },
  { href: '/weekly-shift', label: '주간 궤적' },
  { href: '/notices', label: '공지사항' },
  { href: '/about/classification', label: '분류 모델' },
  { href: '/about/dtw', label: 'DTW 안내' },
]

export function Navbar() {
  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 border-b"
      style={{ background: 'rgba(9,9,11,0.85)', borderColor: 'var(--border)', backdropFilter: 'blur(12px)' }}
    >
      <Link href="/" className="flex items-center gap-2">
        <span className="text-sm font-bold tracking-tight" style={{ color: 'var(--accent-amber)' }}>
          ◈
        </span>
        <span className="text-sm font-semibold text-white">CrossAsset</span>
      </Link>
      <div className="flex items-center gap-6">
        {navLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="text-xs font-medium transition-colors hover:text-white"
            style={{ color: 'var(--muted)' }}
          >
            {label}
          </Link>
        ))}
        <Link
          href="/admin"
          className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors hover:bg-zinc-800"
          style={{ color: 'var(--muted)', borderColor: 'var(--border)' }}
        >
          관리자
        </Link>
      </div>
    </nav>
  )
}
