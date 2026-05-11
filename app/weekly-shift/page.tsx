import { Navbar } from '@/components/Navbar'
import { WeeklyShiftGallery } from '@/components/gallery/WeeklyShiftGallery'
import { getAllWeeklyShifts } from '@/lib/db'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function WeeklyShiftPage() {
  const shifts = await getAllWeeklyShifts()

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl font-bold text-white">주간 DTW 궤적</h1>
            <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
              Dynamic Time Warping 기반 멀티 타임프레임 크로스에셋 변곡점 분석
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/about/dtw"
              className="text-xs px-3 py-1.5 rounded-full border transition-colors hover:bg-zinc-800"
              style={{ color: 'var(--muted)', borderColor: 'var(--border)' }}
            >
              DTW 모델 안내 →
            </Link>
            <span className="text-xs font-mono px-2 py-1 rounded border"
                  style={{ color: 'var(--muted)', borderColor: 'var(--border)', background: 'var(--card)' }}>
              {shifts.length}개 기록
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="rounded-xl border p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs"
             style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex items-start gap-2">
            <div className="w-4 h-1 mt-1.5 rounded shrink-0" style={{ background: '#a855f7' }} />
            <div>
              <p className="font-semibold text-white">보라색 실선 (Ensemble Average)</p>
              <p style={{ color: 'var(--muted)' }}>과거 5개 유사 국면의 평균 미래 궤적 — 기본 시나리오</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-4 border-t-2 border-dashed mt-1.5 shrink-0" style={{ borderColor: '#f97316' }} />
            <div>
              <p className="font-semibold text-white">주황색 점선 (Rank 1 Trajectory)</p>
              <p style={{ color: 'var(--muted)' }}>역사상 가장 유사한 단일 궤적 — 꼬리 위험(Tail Risk) 지표</p>
            </div>
          </div>
        </div>

        {shifts.length === 0 ? (
          <div className="rounded-xl border flex flex-col items-center justify-center py-24 text-center"
               style={{ borderColor: 'var(--border)', background: 'var(--card)', borderStyle: 'dashed' }}>
            <p className="text-sm mb-1" style={{ color: 'var(--muted)' }}>업로드된 주간 궤적 데이터가 없습니다.</p>
            <Link href="/admin/weekly-shift" className="text-xs underline underline-offset-2 mt-2"
                  style={{ color: 'var(--accent-purple)' }}>
              관리자 페이지에서 업로드하세요 →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {shifts.map(shift => (
              <section key={shift.id}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-purple)' }} />
                  <h2 className="text-sm font-semibold text-white">
                    Week of {shift.label}
                  </h2>
                  <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
                    {new Date(shift.uploadedAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <div className="rounded-xl border p-5" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                  <WeeklyShiftGallery assets={shift.assets} label={shift.label} />
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
