'use client'

const FEATURES = [
  {
    color: 'var(--amber)',
    colorBg: 'var(--amber-tint)',
    colorBorder: 'var(--amber-border)',
    badge: 'Prob / Index',
    title: '다중 자산군 상승 확률 시각화',
    description:
      'S&P500, NASDAQ, KOSPI 등 9개 자산군의 미래 50주 상승 확률을 A·B·C 세 가지 앙상블 모델로 비교 분석합니다. 강세장과 침체 국면을 일관된 척도로 판단할 수 있습니다.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <polyline points="2,16 7,10 11,13 15,7 20,10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <rect x="1.5" y="1.5" width="19" height="19" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    color: 'var(--purple)',
    colorBg: 'var(--purple-tint)',
    colorBorder: 'var(--purple-border)',
    badge: 'DTW Analysis',
    title: '시계열 변곡점 궤적 분석',
    description:
      '과거 30년의 방대한 금융 데이터에서 현재 시장과 가장 유사한 국면을 탐지하는 Dynamic Time Warping 알고리즘으로 자산군 이동의 변곡점과 포트폴리오 전환 시그널을 선제적으로 제공합니다.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M2 14c2.5-5 4-7 6-5s3 6 5.5 4 3-4 6.5-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M2 17c2-2.5 4-3.5 6-2.5s3 3.5 5.5 2.5 3-2.5 6.5-1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="2.5 2" />
      </svg>
    ),
  },
  {
    color: 'var(--blue)',
    colorBg: 'var(--blue-tint)',
    colorBorder: 'var(--blue-border)',
    badge: 'Market Reports',
    title: 'AI 기반 시장 분석 리포트',
    description:
      '전문가가 작성한 시황 분석 리포트를 AI 자동 요약으로 핵심 인사이트만 추출합니다. 정량 데이터와 정성적 시황 분석을 하나의 대시보드에서 확인하세요.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="2" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 7.5h8M7 11h8M7 14.5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
]

export function LandingFeatureCards() {
  return (
    <div className="grid sm:grid-cols-3 gap-5">
      {FEATURES.map(({ color, colorBg, colorBorder, badge, title, description, icon }) => (
        <div
          key={title}
          className="rounded-2xl p-6 flex flex-col gap-4"
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            transition: 'border-color 200ms',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = colorBorder)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: colorBg, border: `1px solid ${colorBorder}`, color }}
          >
            {icon}
          </div>
          <div>
            <p className="text-[10px] font-mono tracking-widest uppercase mb-1.5" style={{ color }}>{badge}</p>
            <h3 className="text-sm font-semibold mb-2.5 leading-snug" style={{ color: 'var(--text)' }}>{title}</h3>
            <p className="text-xs leading-[1.75]" style={{ color: 'var(--text-secondary)' }}>{description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
