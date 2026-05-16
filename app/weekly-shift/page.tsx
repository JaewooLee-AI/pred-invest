import { Navbar } from '@/components/Navbar'
import { WeeklyShiftViewer } from '@/components/gallery/WeeklyShiftViewer'
import { getAllWeeklyShifts } from '@/lib/db'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function WeeklyShiftPage() {
  const shifts = await getAllWeeklyShifts()

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-10 sm:py-14">

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span
                className="text-[10px] font-semibold px-2.5 py-1 rounded-full tracking-wide"
                style={{ background: 'var(--purple-tint)', border: '1px solid var(--purple-border)', color: 'var(--purple)' }}
              >
                DTW Analysis
              </span>
            </div>
            <h1
              className="text-3xl sm:text-4xl font-bold tracking-tight"
              style={{
                background: 'linear-gradient(135deg, var(--text) 0%, var(--text-secondary) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              주간 DTW 궤적
            </h1>
            <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
              Dynamic Time Warping 기반 멀티 타임프레임 크로스에셋 변곡점 분석
            </p>
          </div>
          <Link href="/about/dtw" className="text-sm transition-colors mt-1" style={{ color: 'var(--text-secondary)' }}>
            DTW 모델 안내 →
          </Link>
        </div>

        {/* Legend */}
        <div
          className="rounded-2xl p-5 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-5"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-start gap-3">
            <div className="flex items-center gap-1.5 mt-1 shrink-0">
              <div className="w-7 h-[2.5px] rounded-full" style={{ background: '#a78bfa' }} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>보라색 실선 — Ensemble Master</p>
              <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                과거 유사 국면의 앙상블 평균 미래 궤적 — 기본 시나리오
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex items-center gap-[3px] mt-1 shrink-0">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="w-2 h-[2.5px] rounded-full" style={{ background: '#fbbf24' }} />
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>노란색 점선 — Rank 1</p>
              <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                역사상 가장 유사한 단일 궤적 — 꼬리 위험(Tail Risk) 지표
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex items-center gap-1.5 mt-1 shrink-0">
              <div className="w-7 h-[2.5px] rounded-full" style={{ background: '#94a3b8' }} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>회색 실선 — Current Level</p>
              <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                현재 가격 수준 (기준선)
              </p>
            </div>
          </div>
        </div>

        {/* Multi-period explanation */}
        <div
          className="rounded-2xl p-5 mb-10"
          style={{ background: 'var(--purple-tint)', border: '1px solid var(--purple-border)' }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: 'rgba(167,139,250,0.2)', border: '1px solid var(--purple-border)' }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M7 2l5 5-5 5" stroke="#a78bfa" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--purple)' }}>이전 기간 데이터 연결</p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                각 차트 상단의 <span className="font-semibold">이전 포함</span> 드롭다운에서 포함할 이전 주 수를 선택하면,
                해당 주차의 기준일부터 현재 기준일 직전까지의 데이터를 이어붙여 더 넓은 기간의 궤적을 확인할 수 있습니다.
                이전 기간 데이터는 현재 기준일 데이터와 겹치지 않는 날짜만 추가되며, 동일한 색상의 연속 선으로 표시됩니다.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {shifts.length === 0 ? (
          <div
            className="rounded-2xl py-20 flex flex-col items-center justify-center text-center"
            style={{ border: '1px dashed var(--border)', background: 'var(--card)' }}
          >
            <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>업로드된 주간 궤적 데이터가 없습니다.</p>
            <Link href="/admin/weekly-shift" className="text-xs" style={{ color: 'var(--purple)' }}>
              관리자 페이지에서 업로드하세요 →
            </Link>
          </div>
        ) : (
          <WeeklyShiftViewer shifts={shifts} />
        )}
      </main>
    </div>
  )
}
