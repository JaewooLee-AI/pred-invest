'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { logoutAction } from '@/app/actions/auth'

const ADMIN_EMAIL = 'jaewoolee.ai@gmail.com'

const navLinks = [
  { href: '/dashboard', label: '대시보드' },
  { href: '/weekly-shift', label: '주간 궤적' },
  { href: '/about/classification', label: '모델소개' },
  { href: '/notices', label: '공지사항' },
]

interface NavUser {
  email: string
  name?: string | null
}

interface Props {
  user: NavUser | null
}

const INACTIVITY_MS = 10 * 60 * 1000 // 10분

export function NavbarClient({ user }: Props) {
  const [open, setOpen] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const pathname = usePathname()
const isAdmin = user?.email === ADMIN_EMAIL
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // 비활동 자동 로그아웃
  useEffect(() => {
    if (!user) return

    let timer: ReturnType<typeof setTimeout>

    const reset = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        logoutAction()
      }, INACTIVITY_MS)
    }

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click']
    events.forEach(ev => window.addEventListener(ev, reset, { passive: true }))
    reset()

    return () => {
      clearTimeout(timer)
      events.forEach(ev => window.removeEventListener(ev, reset))
    }
  }, [user])

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() ?? '?'

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-8 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0" onClick={() => setOpen(false)}>
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
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-0.5">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className="px-3 py-1.5 rounded-lg text-xs transition-all duration-150"
                style={{
                  color: active ? 'var(--text)' : 'var(--text-secondary)',
                  fontWeight: active ? 600 : 400,
                  background: active ? 'rgba(79,70,229,0.08)' : 'transparent',
                }}
              >
                {label}
              </Link>
            )
          })}
          {isAdmin && (
            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-lg text-xs transition-all duration-150 ml-1"
              style={{
                color: '#1d1d1f',
                background: '#f5f5f7',
                border: '1px solid rgba(0,0,0,0.05)',
                fontWeight: 500,
              }}
            >
              관리자
            </Link>
          )}
        </div>

        {/* Right: user or login */}
        <div className="hidden sm:flex items-center">
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(v => !v)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl transition-colors hover:bg-white/5"
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                  style={{ background: '#0071e3', color: '#fff' }}
                >
                  {initials}
                </div>
                <span className="text-xs max-w-[120px] truncate" style={{ color: 'var(--text-secondary)' }}>
                  {user.email}
                </span>
                <svg
                  width="10" height="10" viewBox="0 0 10 10" fill="none"
                  className="transition-transform duration-200"
                  style={{ transform: showMenu ? 'rotate(180deg)' : 'none', color: 'var(--text-muted)' }}
                >
                  <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {showMenu && (
                <div
                  className="absolute right-0 top-full mt-1.5 w-44 rounded-[12px] overflow-hidden bg-white"
                  style={{
                    border: '1px solid rgba(0,0,0,0.05)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                  }}
                >
                  <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                    <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>로그인됨</p>
                    <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>{user.email}</p>
                  </div>
                  <div className="p-1">
                    <form action={logoutAction}>
                      <button
                        type="submit"
                        className="w-full px-3 py-2 text-xs rounded-lg text-left transition-colors text-[#e30000]"
                        onMouseEnter={e => (e.currentTarget.style.background = '#f5f5f7')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        로그아웃
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-1.5 rounded-full text-xs font-normal transition-all duration-150"
              style={{ background: '#0071e3', color: '#fff' }}
              onMouseEnter={e => e.currentTarget.style.background = '#0077ed'}
              onMouseLeave={e => e.currentTarget.style.background = '#0071e3'}
            >
              로그인
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden flex flex-col items-center justify-center w-8 h-8 gap-[5px]"
          onClick={() => setOpen(v => !v)}
          aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
        >
          {[
            open ? 'translateY(6.5px) rotate(45deg)' : 'none',
            undefined,
            open ? 'translateY(-6.5px) rotate(-45deg)' : 'none',
          ].map((t, i) => (
            <span
              key={i}
              className="w-[18px] h-[1.5px] rounded-full transition-all duration-200"
              style={{
                background: 'var(--text-secondary)',
                transform: t,
                opacity: i === 1 && open ? 0 : 1,
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div
          className="sm:hidden px-3 pb-3 flex flex-col gap-0.5"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          {navLinks.map(({ href, label }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center px-3 py-2.5 rounded-xl text-sm transition-colors"
                style={{
                  color: active ? 'var(--text)' : 'var(--text-secondary)',
                  fontWeight: active ? 600 : 400,
                  background: active ? 'rgba(79,70,229,0.07)' : 'transparent',
                }}
              >
                {label}
              </Link>
            )
          })}
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium"
              style={{ color: '#1d1d1f' }}
            >
              관리자
            </Link>
          )}
          <div className="my-1.5" style={{ borderTop: '1px solid var(--border)' }} />
          {user ? (
            <div className="px-3 pt-1 pb-2">
              <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
              <form action={logoutAction}>
                <button type="submit" className="text-xs font-medium" style={{ color: 'var(--rose)' }}>
                  로그아웃
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center mx-2 py-2.5 rounded-full text-sm font-normal"
              style={{ background: '#0071e3', color: '#fff' }}
            >
              로그인
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
