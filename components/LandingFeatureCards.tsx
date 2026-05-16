'use client'

const FEATURES = [
  {
    title: '다중 자산군 상승 확률 시각화',
    description: 'S&P500, NASDAQ, KOSPI 등 9개 자산군의 미래 50주 상승 확률을 A·B·C 세 가지 앙상블 모델로 비교 분석합니다.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
  },
  {
    title: '시계열 변곡점 궤적 분석',
    description: '과거 30년의 금융 데이터에서 현재 시장과 가장 유사한 국면을 탐지하는 DTW 알고리즘으로 변곡점을 선제적으로 제공합니다.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
      </svg>
    ),
  },
  {
    title: 'AI 기반 시장 분석 리포트',
    description: '전문가가 작성한 시황 분석 리포트를 AI 자동 요약으로 핵심 인사이트만 추출하여 대시보드에서 제공합니다.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
]

export function LandingFeatureCards() {
  return (
    <div className="grid sm:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
      {FEATURES.map(({ title, description, icon }) => (
        <div
          key={title}
          className="rounded-[18px] p-8 flex flex-col items-center text-center bg-white"
          style={{
            boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
            border: '1px solid rgba(0,0,0,0.02)',
            transition: 'transform 200ms ease, box-shadow 200ms ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.02)'
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.08)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.04)'
          }}
        >
          <div className="mb-6 text-[#1d1d1f]">
            {icon}
          </div>
          <h3 className="text-[20px] font-semibold mb-3 text-[#1d1d1f] tracking-tight">{title}</h3>
          <p className="text-[15px] leading-[1.6] text-[#86868b]">{description}</p>
        </div>
      ))}
    </div>
  )
}
