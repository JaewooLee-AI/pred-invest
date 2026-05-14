import { createSupabaseServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { LandingLoginButton } from '@/components/LandingLoginButton'
import { LandingFeatureCards } from '@/components/LandingFeatureCards'
import Link from 'next/link'

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
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{
          background: 'rgba(255,255,255,0.90)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
          boxShadow: '0 1px 0 rgba(79,70,229,0.06)',
        }}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)' }}
          >
            ◈
          </div>
          <span className="text-sm font-bold tracking-tight" style={{ color: 'var(--text)' }}>CrossAsset</span>
          <span className="hidden sm:inline text-[10px] font-mono ml-0.5" style={{ color: 'var(--text-muted)' }}>Analytics</span>
        </Link>
        <LandingLoginButton variant="nav" />
      </nav>

      {/* ── HERO ────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center pt-14">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div style={{
            position: 'absolute', top: '-8%', left: '50%', transform: 'translateX(-50%)',
            width: '1000px', height: '700px',
            background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.10) 0%, rgba(99,102,241,0.03) 50%, transparent 70%)',
          }} />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
            style={{
              background: 'rgba(99,102,241,0.10)',
              border: '1px solid rgba(99,102,241,0.28)',
              color: 'var(--indigo-soft)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full inline-block glow-dot" style={{ background: '#818cf8' }} />
            <span className="text-[11px] font-mono tracking-[0.15em] uppercase">CrossAsset Analytics Platform</span>
          </div>

          {/* Title */}
          <h1
            className="text-[2.8rem] sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
            style={{
              background: 'linear-gradient(160deg, #0f0e17 0%, #0f0e17 40%, #4f46e5 75%, #7c3aed 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            크로스에셋 시장의<br />변곡점을 선점하다
          </h1>

          {/* Subtitle */}
          <p
            className="text-base sm:text-lg leading-[1.8] mb-10 max-w-xl mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            9개 주요 자산군의 상승 확률과 DTW 시계열 변곡점 궤적을<br className="hidden sm:block" />
            전문가 수준의 앙상블 모델로 분석합니다.
          </p>

          {/* CTA */}
          <LandingLoginButton variant="hero" />
          <p className="text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
            승인된 Google 계정만 접근 가능합니다
          </p>
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
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
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

      {/* ── FEATURES ───────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <p className="text-[11px] font-mono tracking-[0.18em] uppercase mb-3"
            style={{ color: 'var(--indigo-soft)' }}>Core Modules</p>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: 'var(--text)' }}>
            세 가지 핵심 분석 모듈
          </h2>
          <p className="text-sm max-w-md mx-auto leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Bloomberg 터미널에서 영감을 받은 클린 인터페이스로<br />
            복잡한 금융 데이터를 직관적으로 제공합니다.
          </p>
        </div>

        <LandingFeatureCards />

        {/* Asset chips */}
        <div
          className="mt-8 rounded-2xl p-5"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
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
          background: 'radial-gradient(ellipse 70% 90% at 50% 50%, rgba(99,102,241,0.07) 0%, transparent 70%)',
        }} />
        <div className="relative z-10 max-w-lg mx-auto">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6"
            style={{
              background: 'rgba(99,102,241,0.10)',
              border: '1px solid rgba(99,102,241,0.25)',
              color: 'var(--indigo-soft)',
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
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[10px] font-bold"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}
          >◈</div>
          <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>CrossAsset Analytics</span>
        </div>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          © 2025 &nbsp;·&nbsp; 승인된 계정 전용 서비스
        </p>
      </footer>
    </div>
  )
}
