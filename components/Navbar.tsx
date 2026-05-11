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
      className="sticky top-0 z-50"
      style={{
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-5 sm:px-8 h-11">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span
            className="text-sm font-semibold tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #f5f5f7 0%, rgba(245,245,247,0.65) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            CrossAsset
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-7">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className="text-xs transition-all duration-150"
                style={{ color: active ? '#f5f5f7' : '#86868b', fontWeight: active ? 500 : 400 }}
              >
                {label}
              </Link>
            )
          })}
          <Link
            href="/admin"
            className="text-xs px-3.5 py-1.5 rounded-full transition-all duration-150 hover:opacity-80"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#86868b',
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
            className="w-[18px] h-[1.5px] rounded-full transition-all duration-200"
            style={{ background: '#86868b', transform: open ? 'translateY(6.5px) rotate(45deg)' : 'none' }}
          />
          <span
            className="w-[18px] h-[1.5px] rounded-full transition-all duration-200"
            style={{ background: '#86868b', opacity: open ? 0 : 1 }}
          />
          <span
            className="w-[18px] h-[1.5px] rounded-full transition-all duration-200"
            style={{ background: '#86868b', transform: open ? 'translateY(-6.5px) rotate(-45deg)' : 'none' }}
          />
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div
          className="sm:hidden px-4 pb-3 flex flex-col gap-0.5"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          {navLinks.map(({ href, label }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center px-3 py-3 rounded-xl text-sm transition-all"
                style={{
                  color: active ? '#f5f5f7' : '#86868b',
                  background: active ? 'rgba(255,255,255,0.06)' : 'transparent',
                }}
              >
                {label}
              </Link>
            )
          })}
          <div className="my-1" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />
          <Link
            href="/admin"
            onClick={() => setOpen(false)}
            className="flex items-center px-3 py-3 rounded-xl text-sm"
            style={{ color: '#86868b' }}
          >
            관리자
          </Link>
        </div>
      )}
    </nav>
  )
}
