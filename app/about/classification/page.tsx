import Link from 'next/link'
import { Navbar } from '@/components/Navbar'

export default function ClassificationAboutPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8 pt-14 pb-16">
          <div className="flex items-center gap-2 text-xs mb-8">
            <Link href="/" className="transition-colors hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>대시보드</Link>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <span style={{ color: 'var(--blue)' }} className="font-medium">분류 모델 안내</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end gap-6">
            <div className="flex-1">
              <span
                className="inline-block text-[10px] font-semibold px-2.5 py-1 rounded-full mb-4 tracking-wide"
                style={{ background: 'var(--blue-tint)', border: '1px solid var(--blue-border)', color: 'var(--blue)' }}
              >
                Classification Model Guide
              </span>
              <h1
                className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.15]"
                style={{ color: 'var(--text)' }}
              >
                자산군 상승 확률
                <br />
                <span style={{ color: 'var(--blue)' }}>분류 모델</span>
              </h1>
              <p className="text-base sm:text-lg mt-5 leading-relaxed max-w-xl" style={{ color: 'var(--text-secondary)' }}>
                이 대시보드의 차트는 가격이 아닙니다.
                각 자산군의 향후 상승 가능성을{' '}
                <strong className="font-semibold" style={{ color: 'var(--text)' }}>0–100% 확률</strong>로 표현한
                분류(Classification) 모델의 출력값입니다.
              </p>
            </div>
            <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-2 sm:pb-1">
              <Link href="/about/dtw" className="text-sm transition-colors hover:opacity-80 whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                DTW 안내 →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16 space-y-20">

        {/* 01 */}
        <Section num="01" title="Y축 값은 무엇인가?">
          <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
            차트의 Y축은{' '}
            <strong className="font-semibold" style={{ color: 'var(--text)' }}>상승 확률(Probability of Rise)</strong>입니다.
            해당 자산이 50주(약 1년) 후에 현재 가격보다 높을 확률을 0–100%로 나타냅니다.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { value: '≥ 60%', label: '강세 신호', sub: '상승 확률 우위 — 비중 확대 검토 구간', c: 'var(--emerald)', tint: 'var(--emerald-tint)', bd: 'var(--emerald-border)', bar: 80 },
              { value: '40–60%', label: '중립 구간', sub: '방향성 불분명 — 관망 또는 중립 유지', c: 'var(--amber)', tint: 'var(--amber-tint)', bd: 'var(--amber-border)', bar: 50 },
              { value: '< 40%', label: '약세 신호', sub: '하락 확률 우위 — 비중 축소·헤지 검토', c: 'var(--rose)', tint: 'var(--rose-tint)', bd: 'var(--rose-border)', bar: 25 },
            ].map(({ value, label, sub, c, tint, bd, bar }) => (
              <div key={label} className="rounded-xl p-5" style={{ background: tint, border: `1px solid ${bd}` }}>
                <div className="text-3xl font-bold font-mono mb-1" style={{ color: c }}>{value}</div>
                <div className="text-sm font-semibold mb-2" style={{ color: c }}>{label}</div>
                <div className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{sub}</div>
                <div className="mt-4 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.06)' }}>
                  <div className="h-full rounded-full" style={{ width: `${bar}%`, background: c }} />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <span className="font-semibold" style={{ color: 'var(--text)' }}>기준선 50%</span>는 강세/약세의 경계입니다.
              선이 50% 위에 있으면 모델이 해당 자산의 상승을 더 높게 평가하고 있음을 의미합니다.
            </p>
          </div>
        </Section>

        <Divider />

        {/* 02 */}
        <Section num="02" title="세 가지 독립 모델: A, B, C">
          <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
            각 차트는 동일한 자산을 바라보는{' '}
            <strong className="font-semibold" style={{ color: 'var(--text)' }}>세 가지 독립 모델</strong>을 동시에 보여줍니다.
            세 모델은 서로 다른 특성·입력변수를 사용하며 앙상블로 활용됩니다.
          </p>

          <div className="space-y-3 mb-6">
            {[
              { c: 'var(--blue)', tint: 'var(--blue-tint)', bd: 'var(--blue-border)', label: 'Model A', tag: '청색 선', desc: '거시·기술적 지표 중심의 기본 분류기. 추세 및 모멘텀 특성에 민감합니다.' },
              { c: 'var(--purple)', tint: 'var(--purple-tint)', bd: 'var(--purple-border)', label: 'Model B', tag: '보라색 선', desc: '크로스 에셋 간 상관관계를 반영한 보조 모델. 자산 간 흐름 전환에 빠르게 반응합니다.' },
              { c: 'var(--emerald)', tint: 'var(--emerald-tint)', bd: 'var(--emerald-border)', label: 'Model C', tag: '에메랄드 선', desc: '변동성·리스크 국면 인식에 초점을 둔 모델. 극단적 구간에서 신호가 두드러집니다.' },
            ].map(({ c, tint, bd, label, tag, desc }) => (
              <div key={label} className="flex items-start gap-4 rounded-xl p-5" style={{ background: tint, border: `1px solid ${bd}` }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(0,0,0,0.2)', border: `1px solid ${bd}` }}>
                  <div className="w-3 h-3 rounded-full" style={{ background: c }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>{label}</span>
                    <span className="text-xs" style={{ color: c }}>— {tag}</span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl p-5" style={{ background: 'var(--purple-tint)', border: '1px solid var(--purple-border)' }}>
            <div className="flex items-start gap-3">
              <span className="text-lg shrink-0">💡</span>
              <p className="text-sm leading-relaxed">
                <strong style={{ color: 'var(--purple)' }}>앙상블 활용:</strong>{' '}
                <span style={{ color: 'var(--text-secondary)' }}>
                  세 선이 모두 같은 방향으로 수렴할 때 신호 신뢰도가 높습니다.
                  모델 간 괴리가 클수록 불확실성이 높은 구간으로 해석하세요.
                </span>
              </p>
            </div>
          </div>
        </Section>

        <Divider />

        {/* 03 */}
        <Section num="03" title="50주(약 1년) 예측 구간">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-base leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
                모델의 예측 구간은{' '}
                <strong className="font-semibold" style={{ color: 'var(--text)' }}>현재 시점 기준 50주 후</strong>입니다.
                단기 트레이딩이 아닌 중장기 자산배분·리밸런싱 타이밍에 초점을 맞춥니다.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                X축은 과거 기준일의 흐름을 나타내며, 마지막 데이터 포인트가 가장 최근 전망입니다.
              </p>
            </div>
            <div className="rounded-xl p-5 flex flex-col justify-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="text-xs font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>예측 시계</div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-xs w-10 shrink-0" style={{ color: 'var(--text-muted)' }}>현재</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                  <div className="h-full rounded-full" style={{ width: '100%', background: 'linear-gradient(90deg, #6366f1 0%, #a78bfa 100%)' }} />
                </div>
                <span className="text-xs shrink-0 text-right w-12" style={{ color: 'var(--text-muted)' }}>50주 후</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Week 0</span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Week 50</span>
              </div>
            </div>
          </div>
        </Section>

        <Divider />

        {/* 04 */}
        <Section num="04" title="WTI 원유 — 특수 표기">
          <div className="rounded-xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              WTI 원유 차트는 A, B, C 대신{' '}
              <strong className="font-semibold" style={{ color: 'var(--text)' }}>A, C, AVG</strong>로 표기될 수 있습니다.
              AVG는 앙상블 평균으로, 두 모델의 합의 수준을 직관적으로 보여주는 참고 지표입니다.
            </p>
          </div>
        </Section>

        <Divider />

        {/* 05 */}
        <Section num="05" title="시장 국면 모멘텀 지표로 활용">
          <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
            확률의 절대값보다{' '}
            <strong className="font-semibold" style={{ color: 'var(--text)' }}>추세와 방향</strong>이 더 중요합니다.
            단순 임계값보다 올라가는 추세인지, 꺾이는 추세인지를 함께 판단하세요.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { dir: '↑', label: '확률 상승 중', desc: '매수 압력 증가 — 비중 확대 검토', c: 'var(--emerald)', tint: 'var(--emerald-tint)', bd: 'var(--emerald-border)' },
              { dir: '↓', label: '확률 하락 중', desc: '매도 압력 증가 — 헤지 검토', c: 'var(--rose)', tint: 'var(--rose-tint)', bd: 'var(--rose-border)' },
              { dir: '→', label: '50% 전후 횡보', desc: '방향 불명확 — 중립 유지', c: 'var(--amber)', tint: 'var(--amber-tint)', bd: 'var(--amber-border)' },
            ].map(({ dir, label, desc, c, tint, bd }) => (
              <div key={label} className="rounded-xl p-5 text-center" style={{ background: tint, border: `1px solid ${bd}` }}>
                <div className="text-4xl font-bold mb-2" style={{ color: c }}>{dir}</div>
                <div className="text-sm font-semibold mb-1.5" style={{ color: c }}>{label}</div>
                <div className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* Disclaimer */}
        <div className="rounded-xl p-5" style={{ background: 'var(--emerald-tint)', border: '1px solid var(--emerald-border)' }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <span className="font-semibold" style={{ color: 'var(--emerald)' }}>면책 고지&nbsp;&nbsp;</span>
            본 모델은 통계적 분류 알고리즘에 기반한 참고용 자료입니다.
            확률에 의해 산출된 수치이며 실제 투자 결과를 보장하지 않습니다.
            모든 투자 결정은 본인의 책임 하에 이루어져야 합니다.
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80"
            style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)' }}
          >
            ← 대시보드
          </Link>
          <Link
            href="/about/dtw"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}
          >
            DTW 궤적 모델 →
          </Link>
        </div>
      </div>
    </div>
  )
}

function Section({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-baseline gap-4 mb-6">
        <span className="text-[10px] font-bold font-mono tracking-widest shrink-0" style={{ color: 'var(--text-muted)' }}>{num}</span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>{title}</h2>
      </div>
      {children}
    </section>
  )
}

function Divider() {
  return (
    <div style={{ height: '1px', background: 'linear-gradient(90deg, var(--border-strong) 0%, transparent 100%)' }} />
  )
}
