import Link from 'next/link'

export default function DtwAboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs mb-8" style={{ color: 'var(--muted)' }}>
        <Link href="/" className="hover:text-white transition-colors">대시보드</Link>
        <span>/</span>
        <Link href="/weekly-shift" className="hover:text-white transition-colors">주간 궤적</Link>
        <span>/</span>
        <span style={{ color: 'var(--accent-purple)' }}>DTW 궤적 모델 안내</span>
      </div>

      {/* Hero */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4"
             style={{ background: 'rgba(168,85,247,0.12)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.25)' }}>
          DTW Rolling Shift Guide
        </div>
        <h1 className="text-2xl font-bold text-white mb-3 leading-snug">
          DTW 롤링 시프트 궤적 분석
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          현재 시장이 과거 어느 시점과 가장 유사한지 탐색하고, 그 이후 패턴을 현재에 투영해
          향후 자산 움직임의 가능한 경로를 제시합니다.
        </p>
      </div>

      {/* Section 1 — DTW란 */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold"
                style={{ background: 'var(--accent-purple)', color: '#000' }}>1</span>
          DTW(Dynamic Time Warping)란?
        </h2>
        <div className="rounded-xl border p-5 space-y-3"
             style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
            DTW는 <strong className="text-white">두 시계열의 형태적 유사성</strong>을 측정하는 알고리즘입니다.
            단순 상관계수와 달리, 시간 축의 신축성을 허용해 속도 차이가 있어도
            패턴의 <em>모양</em>이 같으면 유사하다고 판단합니다.
          </p>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="rounded-lg p-3" style={{ background: '#0e0e11', border: '1px solid #27272a' }}>
              <p className="text-xs font-semibold text-white mb-1">일반 거리 측정</p>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                시점이 정확히 일치할 때만 유사도를 계산 — 타이밍 차이에 취약
              </p>
            </div>
            <div className="rounded-lg p-3" style={{ background: '#0e0e11', border: '1px solid rgba(168,85,247,0.3)' }}>
              <p className="text-xs font-semibold mb-1" style={{ color: '#c084fc' }}>DTW 거리 측정</p>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                시간 축을 탄력적으로 늘리거나 압축해 <strong className="text-white">형태 유사도</strong>를 계산
              </p>
            </div>
          </div>
          <p className="text-xs leading-relaxed pt-1" style={{ color: 'var(--muted)' }}>
            금융 시장은 같은 사건이 발생해도 반응 속도가 다를 수 있습니다. DTW는 이런
            타이밍 편차를 자동으로 보정해 더 정확한 유사 패턴을 찾아냅니다.
          </p>
        </div>
      </section>

      {/* Section 2 — 30년 데이터 유사 패턴 */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold"
                style={{ background: 'var(--accent-blue)', color: '#000' }}>2</span>
          30년 데이터에서 유사 구간 5개 추출
        </h2>
        <div className="rounded-xl border p-5 space-y-3"
             style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
            약 <strong className="text-white">30년(1990년대~현재)의 주간 가격 데이터</strong>를 대상으로
            현재 시장 흐름과 DTW 거리가 가장 가까운 과거 구간을 탐색합니다.
            그 중 유사도 상위 <strong className="text-white">5개 에피소드</strong>를 추출해 분석합니다.
          </p>
          <div className="space-y-2 mt-2">
            {['Rank 1 — DTW 거리 최소 (가장 유사)', 'Rank 2', 'Rank 3', 'Rank 4', 'Rank 5'].map((rank, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0"
                     style={{
                       background: i === 0 ? 'rgba(249,115,22,0.2)' : 'rgba(168,85,247,0.1)',
                       color: i === 0 ? '#fb923c' : '#a78bfa',
                       border: i === 0 ? '1px solid rgba(249,115,22,0.4)' : '1px solid rgba(168,85,247,0.25)',
                     }}>
                  {i + 1}
                </div>
                <span className="text-xs" style={{ color: i === 0 ? '#fb923c' : 'var(--muted)' }}>{rank}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 — Rolling Shift */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold"
                style={{ background: 'var(--accent-amber)', color: '#000' }}>3</span>
          롤링 시프트: 8주 창 × 50회 이동
        </h2>
        <div className="rounded-xl border p-5 space-y-4"
             style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
            단일 시점의 비교는 오차가 큽니다. 이를 보완하기 위해 <strong className="text-white">8주 관측 창</strong>을
            1주씩 이동(shift)하며 <strong className="text-white">50회 반복</strong> 비교합니다.
          </p>

          {/* Step visualization */}
          <div className="rounded-lg p-4 space-y-3" style={{ background: '#0e0e11', border: '1px solid #27272a' }}>
            <p className="text-xs font-semibold text-white mb-3">롤링 시프트 프로세스</p>
            {[
              { step: '①', label: '현재 8주 패턴 추출', desc: '최근 8주간의 일별 수익률 시계열을 슬라이싱' },
              { step: '②', label: '30년 데이터 전체 탐색', desc: 'DTW 알고리즘으로 모든 과거 8주 구간과 거리 계산' },
              { step: '③', label: 'Top-5 에피소드 선택', desc: '유사도 순위 상위 5개 구간 추출' },
              { step: '④', label: '1주 이동 후 반복', desc: '창을 1주 앞으로 밀고 ①~③을 50회 반복' },
              { step: '⑤', label: '앙상블 & 시각화', desc: '50회 × 5개 결과를 합산해 평균 궤적 산출' },
            ].map(({ step, label, desc }) => (
              <div key={step} className="flex items-start gap-3">
                <span className="text-xs font-bold shrink-0 mt-0.5" style={{ color: '#a78bfa' }}>{step}</span>
                <div>
                  <p className="text-xs font-medium text-white">{label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            이 방식으로 특정 시점의 우연한 노이즈에 흔들리지 않고,
            <strong className="text-white"> 통계적으로 안정된 미래 궤적</strong>을 추정합니다.
          </p>
        </div>
      </section>

      {/* Section 4 — 선 색상 가이드 */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold"
                style={{ background: '#06b6d4', color: '#000' }}>4</span>
          차트 선 읽는 법
        </h2>
        <div className="rounded-xl border p-5 space-y-4"
             style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-3 rounded-lg"
                 style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)' }}>
              <div className="flex flex-col items-center gap-1 shrink-0 mt-0.5">
                <div className="w-16 h-0.5" style={{ background: '#a855f7' }} />
                <div className="w-2 h-2 rounded-full" style={{ background: '#a855f7' }} />
              </div>
              <div>
                <p className="text-xs font-semibold" style={{ color: '#c084fc' }}>보라색 실선 — Ensemble Average (기본 시나리오)</p>
                <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                  Top-5 유사 패턴의 이후 궤적을 평균낸 값입니다.
                  가장 높은 확률의 기본 경로(Base Case)로 읽으세요.
                  포트폴리오 방향성 판단의 <strong className="text-white">주요 기준</strong>입니다.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-3 rounded-lg"
                 style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
              <div className="flex flex-col items-center gap-1 shrink-0 mt-0.5">
                <div className="w-16 h-0.5 border-t-2 border-dashed" style={{ borderColor: '#fb923c' }} />
                <div className="w-2 h-2 rounded-full" style={{ background: '#fb923c' }} />
              </div>
              <div>
                <p className="text-xs font-semibold" style={{ color: '#fb923c' }}>주황 점선 — Rank 1 (테일 리스크 점검)</p>
                <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                  DTW 거리가 가장 가까운 단일 최유사 에피소드의 궤적입니다.
                  앙상블과 방향이 크게 다를 경우 <strong className="text-white">테일 리스크 신호</strong>로 해석합니다.
                  두 선의 괴리가 클수록 시나리오 불확실성이 높습니다.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg p-3 mt-2" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
            <p className="text-xs" style={{ color: '#93c5fd' }}>
              <strong>핵심 해석 원칙:</strong> 절대 가격보다 <strong className="text-white">형태(모양)와 기울기</strong>에 집중하세요.
              궤적이 상승 형태인지, 하락 형태인지, 횡보인지를 먼저 파악하고
              보라·주황 선의 수렴/괴리로 확신 강도를 판단합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5 — 크로스 에셋 활용 */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold"
                style={{ background: '#10b981', color: '#000' }}>5</span>
          9개 자산 동시 비교: 크로스 에셋 전략
        </h2>
        <div className="rounded-xl border p-5 space-y-3"
             style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
            주간 궤적 갤러리는 S&P500, NASDAQ, KOSPI, GOLD, DXY, USDKRW, USDJPY, 10Y UST, WTI
            9개 자산군을 <strong className="text-white">한 화면에서 동시 비교</strong>할 수 있도록 설계되었습니다.
          </p>
          <div className="grid grid-cols-1 gap-2 mt-2">
            {[
              { emoji: '🔄', title: '자산 간 순환 포착', desc: '주식→채권→원자재 등 자금 이동 흐름을 궤적 모양 변화로 선제적으로 감지' },
              { emoji: '⚖️', title: '포트폴리오 리밸런싱 타이밍', desc: '여러 자산의 궤적이 동시에 꺾이는 지점에서 비중 조정 신호 탐색' },
              { emoji: '🛡️', title: '헤지 자산 식별', desc: '주식 하락 궤적이 예상될 때 상승 궤적을 보이는 자산을 헤지 후보로 검토' },
            ].map(({ emoji, title, desc }) => (
              <div key={title} className="flex items-start gap-3 p-3 rounded-lg"
                   style={{ background: '#0e0e11', border: '1px solid #27272a' }}>
                <span className="text-base shrink-0">{emoji}</span>
                <div>
                  <p className="text-xs font-semibold text-white">{title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6 — 주의사항 */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold"
                style={{ background: '#ef4444', color: '#fff' }}>!</span>
          해석 주의사항
        </h2>
        <div className="rounded-xl border p-5 space-y-2"
             style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <ul className="text-xs space-y-2" style={{ color: 'var(--muted)' }}>
            <li className="flex items-start gap-2">
              <span className="shrink-0 mt-0.5" style={{ color: '#f87171' }}>✗</span>
              <span>Y축의 <strong className="text-white">절대 수치</strong>보다 <strong className="text-white">형태와 기울기</strong>에 집중하세요. 과거와 현재의 가격 수준이 다르므로 직접 비교는 의미 없습니다.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="shrink-0 mt-0.5" style={{ color: '#f87171' }}>✗</span>
              <span>이 궤적은 <strong className="text-white">단기 예측</strong>이 아닙니다. 패턴 기반의 시나리오 참고 자료로만 활용하세요.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="shrink-0 mt-0.5" style={{ color: '#10b981' }}>✓</span>
              <span>보라/주황 선이 <strong className="text-white">같은 방향으로 수렴</strong>할 때 시나리오 신뢰도가 높아집니다.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="shrink-0 mt-0.5" style={{ color: '#10b981' }}>✓</span>
              <span>분류 모델(상승 확률)과 <strong className="text-white">함께 교차 검증</strong>할 때 최적의 인사이트를 얻을 수 있습니다.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="rounded-xl border px-5 py-4"
           style={{ background: '#0c0f0c', borderColor: '#2d3d2d' }}>
        <p className="text-xs leading-relaxed" style={{ color: '#6db36d' }}>
          <strong>면책 고지:</strong> 본 분석은 과거 패턴의 통계적 유사성에 기반한 참고용 자료입니다.
          역사는 반복되지만 정확히 동일하게 반복되지 않으며, 어떠한 수익도 보장하지 않습니다.
          모든 투자 결정은 본인의 책임 하에 이루어져야 합니다.
        </p>
      </div>

      {/* CTA */}
      <div className="mt-10 flex items-center gap-4">
        <Link href="/weekly-shift"
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-zinc-800"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
          ← 주간 궤적 갤러리
        </Link>
        <Link href="/about/classification"
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#93c5fd' }}>
          분류 모델 안내 →
        </Link>
      </div>
    </div>
  )
}
