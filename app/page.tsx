import { createSupabaseServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { LandingLoginButton } from '@/components/LandingLoginButton'
import { LandingFeatureCards } from '@/components/LandingFeatureCards'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

const ASSETS = ['S&P500', 'NASDAQ', 'KOSPI', 'GOLD', 'DXY', 'USD/KRW', 'USD/JPY', '10Y UST', 'WTI']

const STATS = [
  { value: '9', label: '주요 자산군', sub: 'Cross-Asset Coverage' },
  { value: '50주', label: '상승 확률 예측', sub: 'Probability Horizon' },
  { value: '30년', label: '학습 데이터', sub: 'Historical Depth' },
  { value: 'A·B·C', label: '앙상블 모델', sub: 'Multi-Model Ensemble' },
]

export default async function LandingPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  const tickerItems = [...ASSETS, ...ASSETS]

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>

      {/* ── NAV ─────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-1"
        style={{
          background: 'rgba(255,255,255,0.90)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
          boxShadow: '0 1px 0 rgba(79,70,229,0.06)',
        }}
      >
        <Link href="/" className="flex items-center shrink-0">
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
        <LandingLoginButton variant="nav" />
      </nav>

      {/* ── HERO ────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center min-h-[80vh] px-4 text-center pt-20 pb-16 bg-[#f5f5f7]">
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          {/* Title */}
          <h1 className="text-[48px] sm:text-[64px] lg:text-[72px] font-extrabold tracking-tight leading-[1.05] mb-6 text-[#1d1d1f]">
            크로스에셋 시장의<br />변곡점을 선점하다.
          </h1>

          {/* Subtitle */}
          <p className="text-[20px] sm:text-[24px] leading-[1.4] mb-10 max-w-3xl mx-auto font-normal text-[#86868b]">
            9개 주요 자산군의 상승 확률과 DTW 시계열 변곡점 궤적을<br className="hidden sm:block" />
            전문가 수준의 앙상블 모델로 분석합니다.
          </p>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4">
            <LandingLoginButton variant="hero" />
            <p className="text-[13px] font-normal text-[#86868b] mt-2">
              승인된 계정 전용 플랫폼
            </p>
          </div>
        </div>
      </section>

      {/* ── ASSET TICKER ───────────────────── */}
      <div
        className="relative overflow-hidden py-3.5"
        style={{
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-elevated)',
        }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-28 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, var(--bg-elevated), transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-28 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(-90deg, var(--bg-elevated), transparent)' }} />

        <div className="flex items-center landing-ticker" style={{ width: 'max-content' }}>
          {tickerItems.map((asset, i) => (
            <span key={i} className="inline-flex items-center gap-5 px-5 text-sm font-medium whitespace-nowrap"
              style={{ color: 'var(--text-secondary)' }}>
              {asset}
              <span style={{ color: 'rgba(99,102,241,0.3)', fontSize: 16 }}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── STATS ───────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STATS.map(({ value, label, sub }) => (
            <div
              key={label}
              className="rounded-2xl p-5 sm:p-6 text-center"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
            >
              <div
                className="text-3xl sm:text-4xl font-bold mb-1.5 tabular-nums"
                style={{
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {value}
              </div>
              <div className="text-xs font-semibold mb-0.5" style={{ color: 'var(--text)' }}>{label}</div>
              <div className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BENTO FEATURES ───────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="text-center mb-16">
          <p className="text-[12px] font-mono font-bold tracking-[0.2em] uppercase mb-4"
            style={{ color: 'var(--indigo)' }}>Core Capabilities</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-5" style={{ color: 'var(--text)' }}>
            직관적이고 압도적인 분석 도구
          </h2>
          <p className="text-base max-w-xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Bloomberg 터미널의 깊이와 Apple의 우아함을 결합했습니다.<br />
            복잡한 금융 데이터를 가장 아름답게 시각화합니다.
          </p>
        </div>

        <LandingFeatureCards />

        {/* Asset chips */}
        <div
          className="mt-8 rounded-2xl p-5"
          style={{ background: 'var(--card)', border: '1px solid var(--border)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
        >
          <p className="text-[10px] font-mono tracking-widest uppercase mb-4 text-center"
            style={{ color: 'var(--text-muted)' }}>Covered Assets</p>
          <div className="flex flex-wrap justify-center gap-2">
            {ASSETS.map(asset => (
              <span
                key={asset}
                className="px-3 py-1.5 rounded-lg text-xs font-medium"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                }}
              >
                {asset}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ─────────────────────── */}
      <section
        className="relative overflow-hidden py-24 px-4 text-center"
        style={{ background: 'var(--bg-elevated)', borderTop: '1px solid var(--border)' }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 70% 90% at 50% 50%, rgba(99,102,241,0.05) 0%, transparent 70%)',
        }} />
        <div className="relative z-10 max-w-lg mx-auto">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6"
            style={{
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.3)',
              color: 'var(--indigo)',
            }}
          >
            <span className="text-[11px] font-mono tracking-[0.15em] uppercase">지금 시작하세요</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 leading-snug" style={{ color: 'var(--text)' }}>
            분석 데이터에<br />지금 접근하세요
          </h2>
          <p className="text-sm mb-8 leading-[1.8]" style={{ color: 'var(--text-muted)' }}>
            9개 자산군의 상승 확률 차트, DTW 변곡점 궤적 분석,<br />
            시장 분석 리포트를 한 화면에서 확인하세요.
          </p>
          <LandingLoginButton variant="hero" />
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────── */}
      <footer
        className="py-8 px-6 flex flex-col sm:flex-row items-center justify-between gap-3"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <div className="flex items-center">
          <Image
            src="/logo.png"
            alt="CrossAsset"
            width={140}
            height={76}
            className="object-contain"
            style={{ height: '24px', width: 'auto', opacity: 0.8, transform: 'scale(0.7)', transformOrigin: 'left center' }}
          />
        </div>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          © 2025 &nbsp;·&nbsp; 승인된 계정 전용 서비스
        </p>
      </footer>
    </div>
  )
}
