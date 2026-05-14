import Link from 'next/link'
import { Navbar } from '@/components/Navbar'

export default function DtwAboutPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8 pt-14 pb-16">
          <div className="flex items-center gap-2 text-xs mb-8">
            <Link href="/" className="transition-colors hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>대시보드</Link>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <Link href="/weekly-shift" className="transition-colors hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>주간 궤적</Link>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <span style={{ color: 'var(--purple)' }} className="font-medium">DTW 안내</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end gap-6">
            <div className="flex-1">
              <span
                className="inline-block text-[10px] font-semibold px-2.5 py-1 rounded-full mb-4 tracking-wide"
                style={{ background: 'var(--purple-tint)', border: '1px solid var(--purple-border)', color: 'var(--purple)' }}
              >
                DTW Rolling Shift Guide
              </span>
              <h1
                className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.15]"
                style={{ color: 'var(--text)' }}
              >
                DTW 롤링 시프트
                <br />
                <span style={{ color: 'var(--purple)' }}>궤적 분석</span>
              </h1>
              <p className="text-base sm:text-lg mt-5 leading-relaxed max-w-xl" style={{ color: 'var(--text-secondary)' }}>
                현재 시장이 과거 어느 시점과 가장 유사한지 탐색하고,
                그 이후 패턴을 투영해{' '}
                <strong className="font-semibold" style={{ color: 'var(--text)' }}>향후 자산 움직임의 경로</strong>를 제시합니다.
              </p>
            </div>
            <div className="sm:pb-1">
              <Link href="/about/classification" className="text-sm transition-colors hover:opacity-80 whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                분류 모델 안내 →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16 space-y-20">

        {/* 01 */}
        <Section num="01" title="DTW(Dynamic Time Warping)란?">
          <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
            DTW는{' '}
            <strong className="font-semibold" style={{ color: 'var(--text)' }}>두 시계열의 형태적 유사성</strong>을 측정하는 알고리즘입니다.
            단순 상관계수와 달리 시간 축의 신축성을 허용해, 속도 차이가 있어도 패턴의 <em>모양</em>이 같으면 유사하다고 판단합니다.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="rounded-xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full" style={{ background: 'var(--text-muted)' }} />
                <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>일반 거리 측정</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                시점이 정확히 일치할 때만 유사도를 계산합니다.
                타이밍 차이에 취약해 같은 패턴도 다르다고 판단할 수 있습니다.
              </p>
            </div>
            <div className="rounded-xl p-5" style={{ background: 'var(--purple-tint)', border: '1px solid var(--purple-border)' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full" style={{ background: 'var(--purple)' }} />
                <span className="text-sm font-semibold" style={{ color: 'var(--purple)' }}>DTW 거리 측정</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                시간 축을 탄력적으로 늘리거나 압축해{' '}
                <strong className="font-semibold" style={{ color: 'var(--text)' }}>형태 유사도</strong>를 계산합니다.
                타이밍 편차를 자동으로 보정합니다.
              </p>
            </div>
          </div>

          <div className="rounded-xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              금융 시장은 같은 사건이 발생해도 반응 속도가 다를 수 있습니다.
              DTW는 이런 타이밍 편차를 자동으로 보정해 더 정확한 유사 패턴을 찾아냅니다.
            </p>
          </div>
        </Section>

        <Divider />

        {/* 02 */}
        <Section num="02" title="30년 데이터에서 유사 구간 5개 추출">
          <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
            약{' '}
            <strong className="font-semibold" style={{ color: 'var(--text)' }}>30년(1990년대~현재)의 주간 가격 데이터</strong>를 대상으로
            현재 시장 흐름과 DTW 거리가 가장 가까운 과거 구간을 탐색합니다.
            유사도 상위{' '}
            <strong className="font-semibold" style={{ color: 'var(--text)' }}>5개 에피소드</strong>를 추출해 분석에 활용합니다.
          </p>

          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            {[
              { rank: 1, label: 'Rank 1', sub: 'DTW 거리 최소 — 가장 유사한 에피소드', primary: true },
              { rank: 2, label: 'Rank 2', sub: '두 번째로 유사한 에피소드', primary: false },
              { rank: 3, label: 'Rank 3', sub: '세 번째로 유사한 에피소드', primary: false },
              { rank: 4, label: 'Rank 4', sub: '네 번째로 유사한 에피소드', primary: false },
              { rank: 5, label: 'Rank 5', sub: '다섯 번째로 유사한 에피소드', primary: false },
            ].map(({ rank, label, sub, primary }, i) => (
              <div
                key={rank}
                className="flex items-center gap-4 px-5 py-4"
                style={{
                  background: primary ? 'var(--amber-tint)' : 'var(--card)',
                  borderBottom: i < 4 ? '1px solid var(--border)' : 'none',
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                  style={{
                    background: primary ? 'rgba(251,191,36,0.2)' : 'var(--bg-elevated)',
                    color: primary ? 'var(--amber)' : 'var(--text-secondary)',
                    border: `1px solid ${primary ? 'var(--amber-border)' : 'var(--border)'}`,
                  }}
                >
                  {rank}
                </div>
                <div>
                  <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{label}</span>
                  <span className="text-xs ml-2" style={{ color: 'var(--text-muted)' }}>{sub}</span>
                </div>
                {primary && (
                  <span
                    className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(251,191,36,0.15)', color: 'var(--amber)', border: '1px solid var(--amber-border)' }}
                  >
                    Primary
                  </span>
                )}
              </div>
            ))}
          </div>
        </Section>

        <Divider />

        {/* 03 */}
        <Section num="03" title="롤링 시프트: 8주 창 × 50회 반복">
          <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
            단일 시점 비교의 노이즈를 줄이기 위해{' '}
            <strong className="font-semibold" style={{ color: 'var(--text)' }}>8주 관측 창</strong>을
            1주씩 이동(shift)하며{' '}
            <strong className="font-semibold" style={{ color: 'var(--text)' }}>50회 반복</strong> 비교합니다.
          </p>

          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <div className="px-5 py-3" style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)' }}>
              <span className="text-[10px] font-semibold tracking-wide uppercase" style={{ color: 'var(--text-secondary)' }}>Process</span>
            </div>
            {[
              { n: '01', label: '현재 8주 패턴 추출', desc: '최근 8주간의 일별 수익률 시계열을 슬라이싱합니다.' },
              { n: '02', label: '30년 데이터 전체 탐색', desc: 'DTW 알고리즘으로 모든 과거 8주 구간과 거리를 계산합니다.' },
              { n: '03', label: 'Top-5 에피소드 선택', desc: '유사도 순위 상위 5개 과거 구간을 추출합니다.' },
              { n: '04', label: '1주 이동 후 반복', desc: '창을 1주 앞으로 밀고 ①~③을 50회 반복합니다.' },
              { n: '05', label: '앙상블 & 시각화', desc: '50회 × 5개 결과를 합산해 평균 궤적을 산출합니다.' },
            ].map(({ n, label, desc }, i) => (
              <div
                key={n}
                className="flex items-start gap-4 px-5 py-4"
                style={{
                  borderBottom: i < 4 ? '1px solid var(--border)' : 'none',
                  background: 'var(--card)',
                }}
              >
                <span className="text-xs font-bold font-mono w-6 shrink-0 mt-0.5" style={{ color: 'var(--purple)' }}>{n}</span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{label}</p>
                  <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Divider />

        {/* 04 */}
        <Section num="04" title="차트 선 읽는 법">
          <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
            각 차트에는 두 종류의 선이 표시됩니다.
            두 선의 방향과 수렴·괴리를 통해 시나리오의 신뢰도를 판단하세요.
          </p>

          <div className="space-y-4 mb-6">
            <div className="rounded-xl p-5" style={{ background: 'var(--purple-tint)', border: '1px solid var(--purple-border)' }}>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1 shrink-0">
                  <div className="w-10 h-[2.5px] rounded-full" style={{ background: '#a78bfa' }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#a78bfa' }} />
                </div>
                <div>
                  <span className="text-sm font-bold" style={{ color: 'var(--purple)' }}>보라색 실선</span>
                  <span className="text-xs ml-2" style={{ color: 'rgba(167,139,250,0.6)' }}>Ensemble Average</span>
                </div>
                <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(167,139,250,0.15)', color: 'var(--purple)', border: '1px solid var(--purple-border)' }}>
                  기본 시나리오
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Top-5 유사 패턴의 이후 궤적을 평균낸 값입니다.
                가장 높은 확률의 기본 경로(Base Case)로 읽으세요.
                포트폴리오 방향성 판단의{' '}
                <strong className="font-semibold" style={{ color: 'var(--text)' }}>주요 기준</strong>입니다.
              </p>
            </div>

            <div className="rounded-xl p-5" style={{ background: 'var(--amber-tint)', border: '1px solid var(--amber-border)' }}>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-[3px] shrink-0">
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} className="w-2.5 h-[2.5px] rounded-full" style={{ background: '#fbbf24' }} />
                  ))}
                  <div className="w-2.5 h-2.5 rounded-full ml-1" style={{ background: '#fbbf24' }} />
                </div>
                <div>
                  <span className="text-sm font-bold" style={{ color: 'var(--amber)' }}>노란 점선</span>
                  <span className="text-xs ml-2" style={{ color: 'rgba(251,191,36,0.6)' }}>Rank 1 Trajectory</span>
                </div>
                <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(251,191,36,0.15)', color: 'var(--amber)', border: '1px solid var(--amber-border)' }}>
                  테일 리스크
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                DTW 거리가 가장 가까운 단일 최유사 에피소드의 궤적입니다.
                앙상블과 방향이 크게 다를 경우{' '}
                <strong className="font-semibold" style={{ color: 'var(--text)' }}>테일 리스크 신호</strong>로 해석합니다.
              </p>
            </div>
          </div>

          <div className="rounded-xl p-5" style={{ background: 'var(--blue-tint)', border: '1px solid var(--blue-border)' }}>
            <div className="flex items-start gap-3">
              <span className="text-lg shrink-0">🎯</span>
              <p className="text-sm leading-relaxed">
                <strong style={{ color: 'var(--blue)' }}>핵심 원칙:</strong>{' '}
                <span style={{ color: 'var(--text-secondary)' }}>
                  절대 가격보다{' '}
                  <strong className="font-semibold" style={{ color: 'var(--text)' }}>형태(모양)와 기울기</strong>에 집중하세요.
                  보라·노란 선이 수렴하면 확신이 높고, 괴리가 크면 불확실성이 높습니다.
                </span>
              </p>
            </div>
          </div>
        </Section>

        <Divider />

        {/* 05 */}
        <Section num="05" title="9개 자산 동시 비교: 크로스 에셋 전략">
          <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
            S&P500, NASDAQ, KOSPI, GOLD, DXY, USDKRW, USDJPY, 10Y UST, WTI —
            9개 자산군을{' '}
            <strong className="font-semibold" style={{ color: 'var(--text)' }}>한 화면에서 동시 비교</strong>할 수 있습니다.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: '⇄', title: '자산 간 순환 포착', desc: '주식→채권→원자재 자금 이동 흐름을 궤적 모양으로 선제적으로 감지합니다.', c: 'var(--blue)', tint: 'var(--blue-tint)', bd: 'var(--blue-border)' },
              { icon: '⚖', title: '리밸런싱 타이밍', desc: '여러 자산의 궤적이 동시에 꺾이는 지점에서 비중 조정 신호를 탐색합니다.', c: 'var(--amber)', tint: 'var(--amber-tint)', bd: 'var(--amber-border)' },
              { icon: '⛨', title: '헤지 자산 식별', desc: '주식 하락 궤적이 예상될 때 상승 궤적을 보이는 자산을 헤지 후보로 검토합니다.', c: 'var(--emerald)', tint: 'var(--emerald-tint)', bd: 'var(--emerald-border)' },
            ].map(({ icon, title, desc, c, tint, bd }) => (
              <div key={title} className="rounded-xl p-5" style={{ background: tint, border: `1px solid ${bd}` }}>
                <div className="text-2xl mb-3" style={{ color: c }}>{icon}</div>
                <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--text)' }}>{title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </Section>

        <Divider />

        {/* 06 */}
        <Section num="06" title="해석 주의사항">
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            {[
              { ok: false, text: 'Y축의 절대 수치보다 형태와 기울기에 집중하세요. 과거와 현재의 가격 수준이 다르므로 직접 비교는 의미 없습니다.' },
              { ok: false, text: '이 궤적은 단기 예측이 아닙니다. 패턴 기반 시나리오 참고 자료로만 활용하세요.' },
              { ok: true, text: '보라/노란 선이 같은 방향으로 수렴할 때 시나리오 신뢰도가 높아집니다.' },
              { ok: true, text: '분류 모델(상승 확률)과 함께 교차 검증할 때 최적의 인사이트를 얻을 수 있습니다.' },
            ].map(({ ok, text }, i) => (
              <div
                key={i}
                className="flex items-start gap-4 px-5 py-4"
                style={{
                  background: ok ? 'var(--emerald-tint)' : 'var(--rose-tint)',
                  borderBottom: i < 3 ? '1px solid var(--border)' : 'none',
                }}
              >
                <span className="text-sm font-bold shrink-0 mt-0.5 w-4 text-center" style={{ color: ok ? 'var(--emerald)' : 'var(--rose)' }}>
                  {ok ? '✓' : '✗'}
                </span>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{text}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Disclaimer */}
        <div className="rounded-xl p-5" style={{ background: 'var(--emerald-tint)', border: '1px solid var(--emerald-border)' }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <span className="font-semibold" style={{ color: 'var(--emerald)' }}>면책 고지&nbsp;&nbsp;</span>
            본 분석은 과거 패턴의 통계적 유사성에 기반한 참고용 자료입니다.
            역사는 반복되지만 정확히 동일하게 반복되지 않으며 어떠한 수익도 보장하지 않습니다.
            모든 투자 결정은 본인의 책임 하에 이루어져야 합니다.
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href="/weekly-shift"
            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80"
            style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)' }}
          >
            ← 주간 궤적
          </Link>
          <Link
            href="/about/classification"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}
          >
            분류 모델 안내 →
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
