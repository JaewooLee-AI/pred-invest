'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: '대시보드' },
  { href: '/weekly-shift', label: '주간 궤적' },
  { href: '/notices', label: '공지사항' },
  { href: '/about/classification', label: '분류 모델' },
  { href: '/about/dtw', label: 'DTW 안내' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{ background: 'rgba(9,9,11,0.92)', borderColor: 'var(--border)', backdropFilter: 'blur(12px)' }}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="text-sm font-bold tracking-tight" style={{ color: 'var(--accent-amber)' }}>◈</span>
          <span className="text-sm font-semibold text-white">CrossAsset</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-5">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className="text-xs font-medium transition-colors hover:text-white"
                style={{ color: active ? 'white' : 'var(--muted)' }}
              >
                {label}
              </Link>
            )
          })}
          <Link
            href="/admin"
            className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors hover:bg-zinc-800"
            style={{ color: 'var(--muted)', borderColor: 'var(--border)' }}
          >
            관리자
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden flex flex-col items-center justify-center w-8 h-8 gap-1.5 rounded-lg transition-colors hover:bg-zinc-800"
          onClick={() => setOpen(v => !v)}
          aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
        >
          <span
            className="w-5 h-0.5 rounded-full transition-all duration-200"
            style={{
              background: 'var(--muted)',
              transform: open ? 'translateY(0.375rem) rotate(45deg)' : 'none',
            }}
          />
          <span
            className="w-5 h-0.5 rounded-full transition-all duration-200"
            style={{
              background: 'var(--muted)',
              opacity: open ? 0 : 1,
            }}
          />
          <span
            className="w-5 h-0.5 rounded-full transition-all duration-200"
            style={{
              background: 'var(--muted)',
              transform: open ? 'translateY(-0.375rem) rotate(-45deg)' : 'none',
            }}
          />
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div
          className="sm:hidden border-t px-4 py-3 flex flex-col gap-1"
          style={{ borderColor: 'var(--border)', background: 'rgba(9,9,11,0.98)' }}
        >
          {navLinks.map(({ href, label }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-zinc-800"
                style={{ color: active ? 'white' : 'var(--muted)', background: active ? 'rgba(255,255,255,0.05)' : undefined }}
              >
                {label}
              </Link>
            )
          })}
          <div className="border-t my-1" style={{ borderColor: 'var(--border)' }} />
          <Link
            href="/admin"
            onClick={() => setOpen(false)}
            className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-zinc-800"
            style={{ color: 'var(--muted)' }}
          >
            관리자
          </Link>
        </div>
      )}
    </nav>
  )
}
