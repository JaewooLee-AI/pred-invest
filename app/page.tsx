import { Navbar } from '@/components/Navbar'
import { DashboardContent } from '@/components/DashboardContent'
import { getAllCsvUploads, getAllProbUploads, getAllWeeklyShifts, getAllNotices } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const [csvUploads, probUploads, weeklyShifts, notices] = await Promise.all([
    getAllCsvUploads(),
    getAllProbUploads(),
    getAllWeeklyShifts(),
    getAllNotices(),
  ])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">

        {/* Page header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight leading-tight">
            크로스에셋 대시보드
          </h1>
          <p className="text-base text-zinc-500 mt-2">
            다중 자산군 상승 확률 · DTW 궤적 · 시장 분석 리포트
          </p>
        </div>

        <DashboardContent
          csvUploads={csvUploads}
          probUploads={probUploads}
          weeklyShifts={weeklyShifts}
          notices={notices}
        />
      </main>
    </div>
  )
}
