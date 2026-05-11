import Link from 'next/link'
import { Navbar } from '@/components/Navbar'

export default function ClassificationAboutPage() {
  return (
    <div className="min-h-screen" style={{ background: '#000' }}>
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background radial glow */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
            height: '500px',
            background: 'radial-gradient(ellipse at 50% 0%, rgba(41,151,255,0.14) 0%, transparent 65%)',
            pointerEvents: 'none',
          }}
        />
        <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-20 pb-16 text-center relative">
          <div
            className="flex items-center justify-center gap-2 text-xs mb-8"
            style={{ color: '#86868b' }}
          >
            <Link href="/" className="transition-colors hover:text-white">대시보드</Link>
            <span style={{ color: '#3a3a3c' }}>/</span>
            <span style={{ color: '#2997ff' }}>분류 모델 안내</span>
          </div>

          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{
              background: 'rgba(41,151,255,0.1)',
              color: '#2997ff',
              border: '1px solid rgba(41,151,255,0.2)',
            }}
          >
            Classification Model Guide
          </div>

          <h1
            className="text-4xl sm:text-5xl font-bold mb-6 leading-tight tracking-tight"
            style={{
              background: 'linear-gradient(180deg, #ffffff 20%, rgba(255,255,255,0.5) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            자산군 상승 확률
            <br />
            분류 모델
          </h1>

          <p className="text-base leading-relaxed max-w-xl mx-auto" style={{ color: '#86868b' }}>
            이 대시보드의 차트는 가격이 아닙니다.{' '}
            각 자산군의 향후 상승 가능성을{' '}
            <span style={{ color: '#f5f5f7' }}>0–100% 확률</span>로 표현한
            분류(Classification) 모델의 출력값입니다.
          </p>
        </div>
      </section>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0 auto', maxWidth: '900px' }} />

      {/* Content */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16 space-y-16">

        {/* Section 1 — Y축 해석 */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full tracking-widest"
              style={{ background: 'rgba(41,151,255,0.12)', color: '#2997ff', border: '1px solid rgba(41,151,255,0.2)' }}
            >
              01
            </span>
            <h2 className="text-xl font-semibold" style={{ color: '#f5f5f7' }}>Y축 값은 무엇인가?</h2>
          </div>

          <p className="text-sm leading-relaxed mb-6" style={{ color: '#86868b' }}>
            차트의 Y축은{' '}
            <span style={{ color: '#f5f5f7' }}>상승 확률(Probability of Rise)</span>입니다.
            해당 자산이 50주(약 1년) 후에 현재 가격보다 높을 확률을 나타냅니다.
          </p>

          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { value: '≥ 60%', label: '강세 신호', sub: '상승 우위', c: '#30d158', bg: 'rgba(48,209,88,0.07)', bd: 'rgba(48,209,88,0.18)' },
              { value: '40–60%', label: '중립 구간', sub: '방향 불분명', c: '#ff9f0a', bg: 'rgba(255,159,10,0.07)', bd: 'rgba(255,159,10,0.18)' },
              { value: '< 40%', label: '약세 신호', sub: '하락 우위', c: '#ff453a', bg: 'rgba(255,69,58,0.07)', bd: 'rgba(255,69,58,0.18)' },
            ].map(({ value, label, sub, c, bg, bd }) => (
              <div
                key={label}
                className="rounded-2xl p-5 text-center"
                style={{ background: bg, border: `1px solid ${bd}` }}
              >
                <div className="text-2xl font-bold mb-1 tracking-tight" style={{ color: c }}>{value}</div>
                <div className="text-xs font-semibold mb-1" style={{ color: c }}>{label}</div>
                <div className="text-xs" style={{ color: '#86868b' }}>{sub}</div>
              </div>
            ))}
          </div>

          <p className="text-xs leading-relaxed" style={{ color: '#86868b' }}>
            50% 기준선은 강세/약세의 경계입니다. 선이 50% 위에 있으면 모델이 해당 자산의
            상승을 더 높게 평가하고 있음을 의미합니다.
          </p>
        </section>

        {/* Section 2 — A/B/C 모델 */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full tracking-widest"
              style={{ background: 'rgba(191,90,242,0.12)', color: '#bf5af2', border: '1px solid rgba(191,90,242,0.2)' }}
            >
              02
            </span>
            <h2 className="text-xl font-semibold" style={{ color: '#f5f5f7' }}>세 가지 모델: A, B, C</h2>
          </div>

          <p className="text-sm leading-relaxed mb-6" style={{ color: '#86868b' }}>
            각 차트는 동일한 자산을 바라보는{' '}
            <span style={{ color: '#f5f5f7' }}>세 가지 독립 모델</span>을 동시에 보여줍니다.
            세 모델은 서로 다른 특성·입력변수를 사용하며, 앙상블로 활용됩니다.
          </p>

          <div className="space-y-2.5 mb-5">
            {[
              { c: '#2997ff', label: 'Model A', tag: '청색 선', desc: '거시·기술적 지표 중심의 기본 분류기. 추세 및 모멘텀 특성에 민감합니다.' },
              { c: '#bf5af2', label: 'Model B', tag: '보라색 선', desc: '크로스 에셋 간 상관관계를 반영한 보조 모델. 자산 간 흐름 전환에 빠르게 반응합니다.' },
              { c: '#30d158', label: 'Model C', tag: '에메랄드 선', desc: '변동성·리스크 국면 인식에 초점을 둔 모델. 극단적 구간에서 신호가 두드러집니다.' },
            ].map(({ c, label, tag, desc }) => (
              <div
                key={label}
                className="flex items-start gap-4 p-4 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full mt-[3px] shrink-0"
                  style={{ background: c, boxShadow: `0 0 10px ${c}50` }}
                />
                <div>
                  <span className="text-sm font-semibold" style={{ color: '#f5f5f7' }}>{label}</span>
                  <span className="text-xs ml-2" style={{ color: '#86868b' }}>— {tag}</span>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: '#86868b' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div
            className="p-4 rounded-2xl"
            style={{ background: 'rgba(191,90,242,0.06)', border: '1px solid rgba(191,90,242,0.15)' }}
          >
            <p className="text-xs leading-relaxed">
              <span style={{ color: '#bf5af2', fontWeight: 600 }}>활용 팁  </span>
              <span style={{ color: '#86868b' }}>
                세 선이 모두 같은 방향으로 수렴할 때 신호가 더 신뢰할 만합니다.
                모델 간 괴리가 클수록 불확실성이 높은 구간으로 해석하세요.
              </span>
            </p>
          </div>
        </section>

        {/* Section 3 — 50주 전망 */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full tracking-widest"
              style={{ background: 'rgba(255,159,10,0.12)', color: '#ff9f0a', border: '1px solid rgba(255,159,10,0.2)' }}
            >
              03
            </span>
            <h2 className="text-xl font-semibold" style={{ color: '#f5f5f7' }}>50주(약 1년) 전망 구간</h2>
          </div>

          <div
            className="p-6 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#86868b' }}>
              모델의 예측 구간은{' '}
              <span style={{ color: '#f5f5f7' }}>현재 시점 기준 50주(약 1년) 후</span>입니다.
              단기 트레이딩 신호가 아닌, 중장기 자산배분·포트폴리오 리밸런싱 타이밍에 초점을 맞추고 있습니다.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xs shrink-0" style={{ color: '#86868b' }}>현재</span>
              <div className="flex-1 h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: '100%', background: 'linear-gradient(90deg, #2997ff 0%, #bf5af2 100%)' }}
                />
              </div>
              <span className="text-xs shrink-0" style={{ color: '#86868b' }}>50주 후</span>
            </div>
            <p className="text-xs mt-4" style={{ color: '#86868b' }}>
              X축은 과거 기준일의 흐름을 나타내며, 마지막 데이터 포인트가 가장 최근 전망입니다.
            </p>
          </div>
        </section>

        {/* Section 4 — WTI */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full tracking-widest"
              style={{ background: 'rgba(255,149,0,0.12)', color: '#ff9500', border: '1px solid rgba(255,149,0,0.2)' }}
            >
              04
            </span>
            <h2 className="text-xl font-semibold" style={{ color: '#f5f5f7' }}>WTI 원유 — 특수 표기</h2>
          </div>
          <div
            className="p-6 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <p className="text-sm leading-relaxed" style={{ color: '#86868b' }}>
              WTI 원유 차트는 A, B, C 대신{' '}
              <span style={{ color: '#f5f5f7' }}>A, C, AVG</span>로 표기될 수 있습니다.
              AVG는 앙상블 평균으로, 두 모델의 합의 수준을 직관적으로 보여주는 참고 지표입니다.
            </p>
          </div>
        </section>

        {/* Section 5 — 국면 모멘텀 */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full tracking-widest"
              style={{ background: 'rgba(90,199,250,0.12)', color: '#5ac8fa', border: '1px solid rgba(90,199,250,0.2)' }}
            >
              05
            </span>
            <h2 className="text-xl font-semibold" style={{ color: '#f5f5f7' }}>시장 국면 모멘텀 지표로 활용</h2>
          </div>

          <div
            className="p-6 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <p className="text-sm leading-relaxed mb-5" style={{ color: '#86868b' }}>
              확률이 고정된 숫자보다{' '}
              <span style={{ color: '#f5f5f7' }}>추세와 방향</span>이 더 중요합니다.
              이 지표는 단순 임계값보다 올라가는 추세인지, 꺾이는 추세인지를 함께 봐야 합니다.
            </p>
            <div className="space-y-2">
              {[
                { icon: '↑', c: '#30d158', title: '확률 상승 중', desc: '매수 압력 증가 — 비중 확대 검토 구간' },
                { icon: '↓', c: '#ff453a', title: '확률 하락 중', desc: '매도 압력 증가 — 비중 축소·헤지 검토 구간' },
                { icon: '→', c: '#ff9f0a', title: '50% 전후 횡보', desc: '방향성 불명확 — 중립 유지' },
              ].map(({ icon, c, title, desc }) => (
                <div
                  key={title}
                  className="flex items-center gap-4 p-3.5 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <span className="text-lg w-6 text-center font-bold shrink-0" style={{ color: c }}>{icon}</span>
                  <div>
                    <span className="text-xs font-semibold" style={{ color: '#f5f5f7' }}>{title}:</span>
                    <span className="text-xs ml-1.5" style={{ color: '#86868b' }}>{desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <div
          className="p-5 rounded-2xl"
          style={{ background: 'rgba(48,209,88,0.04)', border: '1px solid rgba(48,209,88,0.12)' }}
        >
          <p className="text-xs leading-relaxed" style={{ color: '#86868b' }}>
            <span style={{ color: '#30d158', fontWeight: 600 }}>면책 고지  </span>
            본 모델은 통계적 분류 알고리즘에 기반한 단순 참고용 자료입니다.
            확률에 의해 산출된 수치이며, 실제 투자 결과를 보장하지 않습니다.
            모든 투자 결정은 본인의 책임 하에 이루어져야 합니다.
          </p>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3 pt-2">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:opacity-80"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#f5f5f7',
            }}
          >
            ← 대시보드
          </Link>
          <Link
            href="/about/dtw"
            className="px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:opacity-80"
            style={{
              background: 'rgba(191,90,242,0.12)',
              border: '1px solid rgba(191,90,242,0.22)',
              color: '#bf5af2',
            }}
          >
            DTW 궤적 모델 →
          </Link>
        </div>
      </div>
    </div>
  )
}
