import Link from 'next/link'

export default function ClassificationAboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs mb-8" style={{ color: 'var(--muted)' }}>
        <Link href="/" className="hover:text-white transition-colors">대시보드</Link>
        <span>/</span>
        <span style={{ color: 'var(--accent-blue)' }}>분류 모델 안내</span>
      </div>

      {/* Hero */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4"
             style={{ background: 'rgba(59,130,246,0.12)', color: 'var(--accent-blue)', border: '1px solid rgba(59,130,246,0.25)' }}>
          Classification Model Guide
        </div>
        <h1 className="text-2xl font-bold text-white mb-3 leading-snug">
          자산군 상승 확률 분류 모델
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          이 대시보드의 차트는 <strong className="text-white">가격이 아닙니다.</strong>{' '}
          각 자산군의 향후 상승 가능성을 <strong className="text-white">0–100% 확률</strong>로 표현한
          분류(Classification) 모델의 출력값입니다.
        </p>
      </div>

      {/* Section 1 — Y축 해석 */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold"
                style={{ background: 'var(--accent-blue)', color: '#000' }}>1</span>
          Y축 값은 무엇인가?
        </h2>
        <div className="rounded-xl border p-5 space-y-3"
             style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
            차트의 Y축은 <strong className="text-white">상승 확률(Probability of Rise)</strong>입니다.
            해당 자산이 50주(약 1년) 후에 현재 가격보다 높을 확률을 나타냅니다.
          </p>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="rounded-lg p-3 text-center" style={{ background: '#0e0e11', border: '1px solid #27272a' }}>
              <div className="text-lg font-bold mb-1" style={{ color: '#10b981' }}>≥ 60%</div>
              <div className="text-xs" style={{ color: '#10b981' }}>강세 신호</div>
              <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>상승 우위</div>
            </div>
            <div className="rounded-lg p-3 text-center" style={{ background: '#0e0e11', border: '1px solid #27272a' }}>
              <div className="text-lg font-bold mb-1" style={{ color: '#f59e0b' }}>40–60%</div>
              <div className="text-xs" style={{ color: '#f59e0b' }}>중립 구간</div>
              <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>방향 불분명</div>
            </div>
            <div className="rounded-lg p-3 text-center" style={{ background: '#0e0e11', border: '1px solid #27272a' }}>
              <div className="text-lg font-bold mb-1" style={{ color: '#ef4444' }}>{'< 40%'}</div>
              <div className="text-xs" style={{ color: '#ef4444' }}>약세 신호</div>
              <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>하락 우위</div>
            </div>
          </div>
          <p className="text-xs leading-relaxed pt-1" style={{ color: 'var(--muted)' }}>
            50% 기준선은 강세/약세의 경계입니다. 선이 50% 위에 있으면 모델이 해당 자산의
            상승을 더 높게 평가하고 있음을 의미합니다.
          </p>
        </div>
      </section>

      {/* Section 2 — A/B/C 모델 */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold"
                style={{ background: 'var(--accent-purple)', color: '#000' }}>2</span>
          세 가지 모델: A, B, C
        </h2>
        <div className="rounded-xl border p-5 space-y-4"
             style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
            각 차트는 동일한 자산을 바라보는 <strong className="text-white">세 가지 독립 모델</strong>을 동시에 보여줍니다.
            세 모델은 서로 다른 특성·입력변수를 사용하며, 앙상블로 활용됩니다.
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 rounded-full mt-0.5 shrink-0" style={{ background: '#3b82f6' }} />
              <div>
                <p className="text-xs font-semibold text-white">Model A — 청색 선</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                  거시·기술적 지표 중심의 기본 분류기. 추세 및 모멘텀 특성에 민감합니다.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 rounded-full mt-0.5 shrink-0" style={{ background: '#a855f7' }} />
              <div>
                <p className="text-xs font-semibold text-white">Model B — 보라색 선</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                  크로스 에셋 간 상관관계를 반영한 보조 모델. 자산 간 흐름 전환에 빠르게 반응합니다.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 rounded-full mt-0.5 shrink-0" style={{ background: '#10b981' }} />
              <div>
                <p className="text-xs font-semibold text-white">Model C — 에메랄드 선</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                  변동성·리스크 국면 인식에 초점을 둔 모델. 극단적 구간에서 신호가 두드러집니다.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg p-3 mt-2" style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)' }}>
            <p className="text-xs" style={{ color: '#c084fc' }}>
              <strong>활용 팁:</strong> 세 선이 모두 같은 방향으로 수렴할 때 신호가 더 신뢰할 만합니다.
              모델 간 괴리가 클수록 불확실성이 높은 구간으로 해석하세요.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3 — 50주 전망 */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold"
                style={{ background: 'var(--accent-amber)', color: '#000' }}>3</span>
          50주(약 1년) 전망 구간
        </h2>
        <div className="rounded-xl border p-5"
             style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
            모델의 예측 구간은 <strong className="text-white">현재 시점 기준 50주(약 1년) 후</strong>입니다.
            단기 트레이딩 신호가 아닌, 중장기 자산배분·포트폴리오 리밸런싱 타이밍에 초점을 맞추고 있습니다.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--border)' }}>
              <div className="h-full rounded-full" style={{ width: '19%', background: 'var(--accent-blue)' }} />
            </div>
            <span className="text-xs shrink-0" style={{ color: 'var(--muted)' }}>현재 → 50주 후</span>
          </div>
          <p className="text-xs mt-3" style={{ color: 'var(--muted)' }}>
            X축은 과거 기준일의 흐름을 나타내며, 마지막 데이터 포인트가 가장 최근 전망입니다.
          </p>
        </div>
      </section>

      {/* Section 4 — WTI 예외 */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold"
                style={{ background: '#f97316', color: '#000' }}>4</span>
          WTI 원유 — 특수 표기
        </h2>
        <div className="rounded-xl border p-5"
             style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
            WTI 원유 차트는 A, B, C 대신 <strong className="text-white">A, C, AVG</strong>로 표기될 수 있습니다.
            AVG는 앙상블 평균으로, 두 모델의 합의 수준을 직관적으로 보여주는 참고 지표입니다.
          </p>
        </div>
      </section>

      {/* Section 5 — 레짐 모멘텀 */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold"
                style={{ background: '#06b6d4', color: '#000' }}>5</span>
          시장 국면 모멘텀 지표로 활용
        </h2>
        <div className="rounded-xl border p-5 space-y-3"
             style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
            확률이 고정된 숫자보다 <strong className="text-white">추세와 방향</strong>이 더 중요합니다.
            이 지표는 단순 임계값(예: 65%)보다 <em>올라가는 추세인지, 꺾이는 추세인지</em>를 함께 봐야 합니다.
          </p>
          <ul className="text-xs space-y-2 pl-1" style={{ color: 'var(--muted)' }}>
            <li className="flex items-start gap-2">
              <span style={{ color: '#10b981' }}>▲</span>
              <span><strong className="text-white">확률 상승 중:</strong> 매수 압력 증가 — 비중 확대 검토 구간</span>
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: '#ef4444' }}>▼</span>
              <span><strong className="text-white">확률 하락 중:</strong> 매도 압력 증가 — 비중 축소·헤지 검토 구간</span>
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: '#f59e0b' }}>—</span>
              <span><strong className="text-white">50% 전후 횡보:</strong> 방향성 불명확 — 중립 유지</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="rounded-xl border px-5 py-4"
           style={{ background: '#0c0f0c', borderColor: '#2d3d2d' }}>
        <p className="text-xs leading-relaxed" style={{ color: '#6db36d' }}>
          <strong>면책 고지:</strong> 본 모델은 통계적 분류 알고리즘에 기반한 단순 참고용 자료입니다.
          확률에 의해 산출된 수치이며, 실제 투자 결과를 보장하지 않습니다.
          모든 투자 결정은 본인의 책임 하에 이루어져야 합니다.
        </p>
      </div>

      {/* CTA */}
      <div className="mt-10 flex items-center gap-4">
        <Link href="/"
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-zinc-800"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
          ← 대시보드로 돌아가기
        </Link>
        <Link href="/about/dtw"
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', color: '#c084fc' }}>
          DTW 궤적 모델 안내 →
        </Link>
      </div>
    </div>
  )
}
