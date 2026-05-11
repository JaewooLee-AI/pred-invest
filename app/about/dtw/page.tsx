import Link from 'next/link'
import { Navbar } from '@/components/Navbar'

export default function DtwAboutPage() {
  return (
    <div className="min-h-screen" style={{ background: '#000' }}>
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
            height: '500px',
            background: 'radial-gradient(ellipse at 50% 0%, rgba(191,90,242,0.13) 0%, transparent 65%)',
            pointerEvents: 'none',
          }}
        />
        <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-20 pb-16 text-center relative">
          <div className="flex items-center justify-center gap-2 text-xs mb-8" style={{ color: '#86868b' }}>
            <Link href="/" className="transition-colors hover:text-white">대시보드</Link>
            <span style={{ color: '#3a3a3c' }}>/</span>
            <Link href="/weekly-shift" className="transition-colors hover:text-white">주간 궤적</Link>
            <span style={{ color: '#3a3a3c' }}>/</span>
            <span style={{ color: '#bf5af2' }}>DTW 안내</span>
          </div>

          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{
              background: 'rgba(191,90,242,0.1)',
              color: '#bf5af2',
              border: '1px solid rgba(191,90,242,0.2)',
            }}
          >
            DTW Rolling Shift Guide
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
            DTW 롤링 시프트
            <br />
            궤적 분석
          </h1>

          <p className="text-base leading-relaxed max-w-xl mx-auto" style={{ color: '#86868b' }}>
            현재 시장이 과거 어느 시점과 가장 유사한지 탐색하고,
            그 이후 패턴을 현재에 투영해{' '}
            <span style={{ color: '#f5f5f7' }}>향후 자산 움직임의 가능한 경로</span>를 제시합니다.
          </p>
        </div>
      </section>

      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0 auto', maxWidth: '900px' }} />

      {/* Content */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16 space-y-16">

        {/* Section 1 — DTW란? */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full tracking-widest"
              style={{ background: 'rgba(191,90,242,0.12)', color: '#bf5af2', border: '1px solid rgba(191,90,242,0.2)' }}
            >
              01
            </span>
            <h2 className="text-xl font-semibold" style={{ color: '#f5f5f7' }}>DTW(Dynamic Time Warping)란?</h2>
          </div>

          <p className="text-sm leading-relaxed mb-5" style={{ color: '#86868b' }}>
            DTW는{' '}
            <span style={{ color: '#f5f5f7' }}>두 시계열의 형태적 유사성</span>을 측정하는 알고리즘입니다.
            단순 상관계수와 달리, 시간 축의 신축성을 허용해 속도 차이가 있어도
            패턴의 <em>모양</em>이 같으면 유사하다고 판단합니다.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div
              className="rounded-2xl p-4"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <p className="text-xs font-semibold mb-2" style={{ color: '#86868b' }}>일반 거리 측정</p>
              <p className="text-xs leading-relaxed" style={{ color: '#86868b' }}>
                시점이 정확히 일치할 때만 유사도를 계산 — 타이밍 차이에 취약
              </p>
            </div>
            <div
              className="rounded-2xl p-4"
              style={{ background: 'rgba(191,90,242,0.06)', border: '1px solid rgba(191,90,242,0.18)' }}
            >
              <p className="text-xs font-semibold mb-2" style={{ color: '#bf5af2' }}>DTW 거리 측정</p>
              <p className="text-xs leading-relaxed" style={{ color: '#86868b' }}>
                시간 축을 탄력적으로 늘리거나 압축해{' '}
                <span style={{ color: '#f5f5f7' }}>형태 유사도</span>를 계산
              </p>
            </div>
          </div>

          <p className="text-xs leading-relaxed" style={{ color: '#86868b' }}>
            금융 시장은 같은 사건이 발생해도 반응 속도가 다를 수 있습니다.
            DTW는 이런 타이밍 편차를 자동으로 보정해 더 정확한 유사 패턴을 찾아냅니다.
          </p>
        </section>

        {/* Section 2 — 30년 데이터 */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full tracking-widest"
              style={{ background: 'rgba(41,151,255,0.12)', color: '#2997ff', border: '1px solid rgba(41,151,255,0.2)' }}
            >
              02
            </span>
            <h2 className="text-xl font-semibold" style={{ color: '#f5f5f7' }}>30년 데이터에서 유사 구간 5개 추출</h2>
          </div>

          <div
            className="p-6 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#86868b' }}>
              약{' '}
              <span style={{ color: '#f5f5f7' }}>30년(1990년대~현재)의 주간 가격 데이터</span>를 대상으로
              현재 시장 흐름과 DTW 거리가 가장 가까운 과거 구간을 탐색합니다.
              그 중 유사도 상위{' '}
              <span style={{ color: '#f5f5f7' }}>5개 에피소드</span>를 추출해 분석합니다.
            </p>

            <div className="space-y-2">
              {[
                { rank: 1, label: 'Rank 1 — DTW 거리 최소 (가장 유사)', special: true },
                { rank: 2, label: 'Rank 2', special: false },
                { rank: 3, label: 'Rank 3', special: false },
                { rank: 4, label: 'Rank 4', special: false },
                { rank: 5, label: 'Rank 5', special: false },
              ].map(({ rank, label, special }) => (
                <div
                  key={rank}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{
                    background: special ? 'rgba(255,159,10,0.07)' : 'rgba(255,255,255,0.03)',
                    border: special ? '1px solid rgba(255,159,10,0.18)' : '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                    style={{
                      background: special ? 'rgba(255,159,10,0.2)' : 'rgba(191,90,242,0.12)',
                      color: special ? '#ff9f0a' : '#bf5af2',
                    }}
                  >
                    {rank}
                  </div>
                  <span className="text-xs" style={{ color: special ? '#ff9f0a' : '#86868b' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3 — Rolling Shift */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full tracking-widest"
              style={{ background: 'rgba(255,159,10,0.12)', color: '#ff9f0a', border: '1px solid rgba(255,159,10,0.2)' }}
            >
              03
            </span>
            <h2 className="text-xl font-semibold" style={{ color: '#f5f5f7' }}>롤링 시프트: 8주 창 × 50회 이동</h2>
          </div>

          <p className="text-sm leading-relaxed mb-5" style={{ color: '#86868b' }}>
            단일 시점의 비교는 오차가 큽니다. 이를 보완하기 위해{' '}
            <span style={{ color: '#f5f5f7' }}>8주 관측 창</span>을
            1주씩 이동(shift)하며{' '}
            <span style={{ color: '#f5f5f7' }}>50회 반복</span> 비교합니다.
          </p>

          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)' }}>
              <p className="text-xs font-semibold" style={{ color: '#f5f5f7' }}>롤링 시프트 프로세스</p>
            </div>
            <div className="p-5 space-y-0 divide-y" style={{ '--tw-divide-opacity': 1 } as React.CSSProperties}>
              {[
                { step: '①', label: '현재 8주 패턴 추출', desc: '최근 8주간의 일별 수익률 시계열을 슬라이싱' },
                { step: '②', label: '30년 데이터 전체 탐색', desc: 'DTW 알고리즘으로 모든 과거 8주 구간과 거리 계산' },
                { step: '③', label: 'Top-5 에피소드 선택', desc: '유사도 순위 상위 5개 구간 추출' },
                { step: '④', label: '1주 이동 후 반복', desc: '창을 1주 앞으로 밀고 ①~③을 50회 반복' },
                { step: '⑤', label: '앙상블 & 시각화', desc: '50회 × 5개 결과를 합산해 평균 궤적 산출' },
              ].map(({ step, label, desc }) => (
                <div key={step} className="flex items-start gap-4 py-3.5">
                  <span className="text-sm font-bold shrink-0 w-5 text-center" style={{ color: '#bf5af2' }}>{step}</span>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: '#f5f5f7' }}>{label}</p>
                    <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#86868b' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs leading-relaxed mt-4" style={{ color: '#86868b' }}>
            이 방식으로 특정 시점의 우연한 노이즈에 흔들리지 않고,{' '}
            <span style={{ color: '#f5f5f7' }}>통계적으로 안정된 미래 궤적</span>을 추정합니다.
          </p>
        </section>

        {/* Section 4 — 차트 선 읽는 법 */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full tracking-widest"
              style={{ background: 'rgba(90,199,250,0.12)', color: '#5ac8fa', border: '1px solid rgba(90,199,250,0.2)' }}
            >
              04
            </span>
            <h2 className="text-xl font-semibold" style={{ color: '#f5f5f7' }}>차트 선 읽는 법</h2>
          </div>

          <div className="space-y-3 mb-5">
            {/* Purple line */}
            <div
              className="p-5 rounded-2xl"
              style={{ background: 'rgba(191,90,242,0.06)', border: '1px solid rgba(191,90,242,0.18)' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="w-8 h-[2px] rounded-full" style={{ background: '#bf5af2' }} />
                  <div className="w-2 h-2 rounded-full" style={{ background: '#bf5af2', boxShadow: '0 0 6px #bf5af2' }} />
                </div>
                <p className="text-sm font-semibold" style={{ color: '#bf5af2' }}>보라색 실선 — Ensemble Average</p>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: '#86868b' }}>
                Top-5 유사 패턴의 이후 궤적을 평균낸 값입니다.
                가장 높은 확률의{' '}
                <span style={{ color: '#f5f5f7' }}>기본 경로(Base Case)</span>로 읽으세요.
                포트폴리오 방향성 판단의 주요 기준입니다.
              </p>
            </div>

            {/* Orange line */}
            <div
              className="p-5 rounded-2xl"
              style={{ background: 'rgba(255,159,10,0.06)', border: '1px solid rgba(255,159,10,0.18)' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1 shrink-0">
                  {[0,1,2,3].map(i => (
                    <div key={i} className="w-2 h-[2px] rounded-full" style={{ background: '#ff9f0a' }} />
                  ))}
                  <div className="w-2 h-2 rounded-full ml-1" style={{ background: '#ff9f0a', boxShadow: '0 0 6px #ff9f0a' }} />
                </div>
                <p className="text-sm font-semibold" style={{ color: '#ff9f0a' }}>주황 점선 — Rank 1 (테일 리스크)</p>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: '#86868b' }}>
                DTW 거리가 가장 가까운 단일 최유사 에피소드의 궤적입니다.
                앙상블과 방향이 크게 다를 경우{' '}
                <span style={{ color: '#f5f5f7' }}>테일 리스크 신호</span>로 해석합니다.
                두 선의 괴리가 클수록 시나리오 불확실성이 높습니다.
              </p>
            </div>
          </div>

          <div
            className="p-4 rounded-2xl"
            style={{ background: 'rgba(41,151,255,0.06)', border: '1px solid rgba(41,151,255,0.15)' }}
          >
            <p className="text-xs leading-relaxed">
              <span style={{ color: '#2997ff', fontWeight: 600 }}>핵심 해석 원칙  </span>
              <span style={{ color: '#86868b' }}>
                절대 가격보다{' '}
                <span style={{ color: '#f5f5f7' }}>형태(모양)와 기울기</span>에 집중하세요.
                보라·주황 선의 수렴/괴리로 확신 강도를 판단합니다.
              </span>
            </p>
          </div>
        </section>

        {/* Section 5 — 크로스 에셋 */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full tracking-widest"
              style={{ background: 'rgba(48,209,88,0.12)', color: '#30d158', border: '1px solid rgba(48,209,88,0.2)' }}
            >
              05
            </span>
            <h2 className="text-xl font-semibold" style={{ color: '#f5f5f7' }}>9개 자산 동시 비교: 크로스 에셋 전략</h2>
          </div>

          <p className="text-sm leading-relaxed mb-5" style={{ color: '#86868b' }}>
            주간 궤적 갤러리는 S&P500, NASDAQ, KOSPI, GOLD, DXY, USDKRW, USDJPY, 10Y UST, WTI
            9개 자산군을{' '}
            <span style={{ color: '#f5f5f7' }}>한 화면에서 동시 비교</span>할 수 있도록 설계되었습니다.
          </p>

          <div className="space-y-2.5">
            {[
              { icon: '⇄', c: '#2997ff', title: '자산 간 순환 포착', desc: '주식→채권→원자재 등 자금 이동 흐름을 궤적 모양 변화로 선제적으로 감지' },
              { icon: '⚖', c: '#ff9f0a', title: '포트폴리오 리밸런싱 타이밍', desc: '여러 자산의 궤적이 동시에 꺾이는 지점에서 비중 조정 신호 탐색' },
              { icon: '⛨', c: '#30d158', title: '헤지 자산 식별', desc: '주식 하락 궤적이 예상될 때 상승 궤적을 보이는 자산을 헤지 후보로 검토' },
            ].map(({ icon, c, title, desc }) => (
              <div
                key={title}
                className="flex items-start gap-4 p-4 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <span className="text-lg shrink-0" style={{ color: c }}>{icon}</span>
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: '#f5f5f7' }}>{title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: '#86868b' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6 — 주의사항 */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full tracking-widest"
              style={{ background: 'rgba(255,69,58,0.12)', color: '#ff453a', border: '1px solid rgba(255,69,58,0.2)' }}
            >
              06
            </span>
            <h2 className="text-xl font-semibold" style={{ color: '#f5f5f7' }}>해석 주의사항</h2>
          </div>
          <div
            className="p-5 rounded-2xl space-y-3"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {[
              { ok: false, text: 'Y축의 절대 수치보다 형태와 기울기에 집중하세요. 과거와 현재의 가격 수준이 다르므로 직접 비교는 의미 없습니다.' },
              { ok: false, text: '이 궤적은 단기 예측이 아닙니다. 패턴 기반의 시나리오 참고 자료로만 활용하세요.' },
              { ok: true, text: '보라/주황 선이 같은 방향으로 수렴할 때 시나리오 신뢰도가 높아집니다.' },
              { ok: true, text: '분류 모델(상승 확률)과 함께 교차 검증할 때 최적의 인사이트를 얻을 수 있습니다.' },
            ].map(({ ok, text }, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="shrink-0 mt-0.5 text-sm" style={{ color: ok ? '#30d158' : '#ff453a' }}>
                  {ok ? '✓' : '✗'}
                </span>
                <p className="text-xs leading-relaxed" style={{ color: '#86868b' }}>{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <div
          className="p-5 rounded-2xl"
          style={{ background: 'rgba(48,209,88,0.04)', border: '1px solid rgba(48,209,88,0.12)' }}
        >
          <p className="text-xs leading-relaxed" style={{ color: '#86868b' }}>
            <span style={{ color: '#30d158', fontWeight: 600 }}>면책 고지  </span>
            본 분석은 과거 패턴의 통계적 유사성에 기반한 참고용 자료입니다.
            역사는 반복되지만 정확히 동일하게 반복되지 않으며, 어떠한 수익도 보장하지 않습니다.
            모든 투자 결정은 본인의 책임 하에 이루어져야 합니다.
          </p>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3 pt-2">
          <Link
            href="/weekly-shift"
            className="px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:opacity-80"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#f5f5f7',
            }}
          >
            ← 주간 궤적 갤러리
          </Link>
          <Link
            href="/about/classification"
            className="px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:opacity-80"
            style={{
              background: 'rgba(41,151,255,0.12)',
              border: '1px solid rgba(41,151,255,0.22)',
              color: '#2997ff',
            }}
          >
            분류 모델 안내 →
          </Link>
        </div>
      </div>
    </div>
  )
}
