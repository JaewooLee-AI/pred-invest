import { Navbar } from '@/components/Navbar'
import { WeeklyShiftViewer } from '@/components/gallery/WeeklyShiftViewer'
import { getAllWeeklyShifts } from '@/lib/db'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function WeeklyShiftPage() {
  const shifts = await getAllWeeklyShifts()

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12">

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full tracking-wide"
                style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', color: '#6d28d9' }}
              >
                DTW Analysis
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight">
              주간 DTW 궤적
            </h1>
            <p className="text-base text-zinc-500 mt-2">
              Dynamic Time Warping 기반 멀티 타임프레임 크로스에셋 변곡점 분석
            </p>
          </div>
          <Link
            href="/about/dtw"
            className="text-sm text-zinc-500 hover:text-zinc-800 transition-colors mt-1"
          >
            DTW 모델 안내 →
          </Link>
        </div>

        {/* Legend */}
        <div className="rounded-xl border border-zinc-200 p-5 mb-10 grid grid-cols-1 sm:grid-cols-3 gap-5 bg-zinc-50">
          <div className="flex items-start gap-3">
            <div className="flex items-center gap-1.5 mt-1 shrink-0">
              <div className="w-7 h-[2.5px] rounded-full" style={{ background: '#7c3aed' }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900">보라색 실선 — Ensemble Master</p>
              <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                과거 유사 국면의 앙상블 평균 미래 궤적 — 기본 시나리오
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex items-center gap-[3px] mt-1 shrink-0">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="w-2 h-[2.5px] rounded-full" style={{ background: '#eab308' }} />
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900">노란색 점선 — Rank 1</p>
              <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                역사상 가장 유사한 단일 궤적 — 꼬리 위험(Tail Risk) 지표
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex items-center gap-1.5 mt-1 shrink-0">
              <div className="w-7 h-[2.5px] rounded-full" style={{ background: '#18181b' }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900">검은색 실선 — Current Level</p>
              <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                현재 가격 수준 (기준선)
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {shifts.length === 0 ? (
          <div className="rounded-xl py-20 flex flex-col items-center justify-center text-center border border-dashed border-zinc-200 bg-zinc-50">
            <p className="text-sm text-zinc-400 mb-2">업로드된 주간 궤적 데이터가 없습니다.</p>
            <Link href="/admin/weekly-shift" className="text-xs text-violet-600 hover:text-violet-700 transition-colors">
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
