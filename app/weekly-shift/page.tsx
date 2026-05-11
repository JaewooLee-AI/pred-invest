import { Navbar } from '@/components/Navbar'
import { WeeklyShiftGallery } from '@/components/gallery/WeeklyShiftGallery'
import { getAllWeeklyShifts } from '@/lib/db'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function WeeklyShiftPage() {
  const shifts = await getAllWeeklyShifts()

  return (
    <div className="min-h-screen" style={{ background: '#000' }}>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-10">

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{
                background: 'linear-gradient(180deg, #ffffff 30%, rgba(255,255,255,0.55) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              주간 DTW 궤적
            </h1>
            <p className="text-xs mt-1.5" style={{ color: '#86868b' }}>
              Dynamic Time Warping 기반 멀티 타임프레임 크로스에셋 변곡점 분석
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <Link
              href="/about/dtw"
              className="text-xs px-3.5 py-1.5 rounded-full transition-all hover:opacity-80"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#86868b',
              }}
            >
              DTW 모델 안내 →
            </Link>
            <span
              className="text-xs font-mono px-2.5 py-1 rounded-full"
              style={{
                background: 'rgba(191,90,242,0.1)',
                border: '1px solid rgba(191,90,242,0.2)',
                color: '#bf5af2',
              }}
            >
              {shifts.length}개 기록
            </span>
          </div>
        </div>

        {/* Legend */}
        <div
          className="rounded-2xl p-5 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex items-start gap-3">
            <div className="flex items-center gap-1 mt-1.5 shrink-0">
              <div className="w-6 h-[2px] rounded-full" style={{ background: '#bf5af2' }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#bf5af2', boxShadow: '0 0 5px #bf5af2' }} />
            </div>
            <div>
              <p className="font-semibold mb-0.5" style={{ color: '#f5f5f7' }}>보라색 실선 — Ensemble Average</p>
              <p style={{ color: '#86868b' }}>과거 5개 유사 국면의 평균 미래 궤적 — 기본 시나리오</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex items-center gap-0.5 mt-1.5 shrink-0">
              {[0,1,2,3].map(i => <div key={i} className="w-1.5 h-[2px] rounded-full" style={{ background: '#ff9f0a' }} />)}
              <div className="w-1.5 h-1.5 rounded-full ml-0.5" style={{ background: '#ff9f0a', boxShadow: '0 0 5px #ff9f0a' }} />
            </div>
            <div>
              <p className="font-semibold mb-0.5" style={{ color: '#f5f5f7' }}>주황색 점선 — Rank 1 Trajectory</p>
              <p style={{ color: '#86868b' }}>역사상 가장 유사한 단일 궤적 — 꼬리 위험(Tail Risk) 지표</p>
            </div>
          </div>
        </div>

        {/* Content */}
        {shifts.length === 0 ? (
          <div
            className="rounded-2xl flex flex-col items-center justify-center py-24 text-center"
            style={{
              border: '1px dashed rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            <p className="text-sm mb-1.5" style={{ color: '#86868b' }}>업로드된 주간 궤적 데이터가 없습니다.</p>
            <Link
              href="/admin/weekly-shift"
              className="text-xs transition-all hover:opacity-80"
              style={{ color: '#bf5af2' }}
            >
              관리자 페이지에서 업로드하세요 →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            {shifts.map(shift => (
              <section key={shift.id}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-2 h-2 rounded-full" style={{ background: '#bf5af2', boxShadow: '0 0 8px #bf5af290' }} />
                  <h2 className="text-sm font-semibold" style={{ color: '#f5f5f7' }}>
                    DTW 기준일: {shift.label}
                  </h2>
                  <span className="text-xs font-mono" style={{ color: '#3a3a3c' }}>
                    {new Date(shift.uploadedAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <div
                  className="rounded-2xl p-5"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
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
