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
      className="sticky top-0 z-50 bg-white"
      style={{ borderBottom: '1px solid #e4e4e7' }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-8 h-12">
        {/* Logo */}
        <Link
          href="/"
          className="text-sm font-bold text-zinc-900 tracking-tight"
          onClick={() => setOpen(false)}
        >
          CrossAsset
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-6">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className="text-xs transition-colors"
                style={{
                  color: active ? '#09090b' : '#71717a',
                  fontWeight: active ? 600 : 400,
                }}
              >
                {label}
              </Link>
            )
          })}
          <Link
            href="/admin"
            className="text-xs px-3 py-1.5 rounded-lg transition-colors hover:bg-zinc-100"
            style={{
              background: '#fafafa',
              border: '1px solid #e4e4e7',
              color: '#71717a',
            }}
          >
            관리자
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden flex flex-col items-center justify-center w-8 h-8 gap-[5px]"
          onClick={() => setOpen(v => !v)}
          aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
        >
          <span
            className="w-[18px] h-[1.5px] rounded-full bg-zinc-500 transition-all duration-200"
            style={{ transform: open ? 'translateY(6.5px) rotate(45deg)' : 'none' }}
          />
          <span
            className="w-[18px] h-[1.5px] rounded-full bg-zinc-500 transition-all duration-200"
            style={{ opacity: open ? 0 : 1 }}
          />
          <span
            className="w-[18px] h-[1.5px] rounded-full bg-zinc-500 transition-all duration-200"
            style={{ transform: open ? 'translateY(-6.5px) rotate(-45deg)' : 'none' }}
          />
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div
          className="sm:hidden bg-white px-4 pb-3 flex flex-col gap-0.5"
          style={{ borderTop: '1px solid #e4e4e7' }}
        >
          {navLinks.map(({ href, label }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center px-3 py-2.5 rounded-lg text-sm transition-colors hover:bg-zinc-50"
                style={{
                  color: active ? '#09090b' : '#71717a',
                  fontWeight: active ? 600 : 400,
                  background: active ? '#fafafa' : undefined,
                }}
              >
                {label}
              </Link>
            )
          })}
          <div className="my-1 border-t border-zinc-100" />
          <Link
            href="/admin"
            onClick={() => setOpen(false)}
            className="flex items-center px-3 py-2.5 rounded-lg text-sm text-zinc-500 hover:bg-zinc-50 transition-colors"
          >
            관리자
          </Link>
        </div>
      )}
    </nav>
  )
}
