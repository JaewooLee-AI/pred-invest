import { Navbar } from '@/components/Navbar'
import { DashboardContent } from '@/components/DashboardContent'
import { getAllCsvUploads, getAllProbUploads, getAllWeeklyShifts, getAllNotices, getClosingPrices } from '@/lib/db'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  const [csvUploads, probUploads, weeklyShifts, notices, closingPrices] = await Promise.all([
    getAllCsvUploads(),
    getAllProbUploads(),
    getAllWeeklyShifts(),
    getAllNotices(),
    getClosingPrices(),
  ])

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span
              className="text-[11px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full"
              style={{
                color: '#86868b',
                background: '#f5f5f7',
                border: '1px solid rgba(0,0,0,0.05)',
              }}
            >
              CrossAsset Analytics
            </span>
          </div>
          <h1
            className="text-[40px] sm:text-[48px] font-extrabold tracking-tight leading-[1.1]"
            style={{ color: '#1d1d1f' }}
          >
            CrossAsset Dashboard
          </h1>
          <p className="text-[17px] mt-3 leading-relaxed font-normal" style={{ color: '#86868b' }}>
            다중 자산군 상승 확률 &middot; DTW 궤적 &middot; 시장 분석 리포트
          </p>
        </div>

        <DashboardContent
          csvUploads={csvUploads}
          probUploads={probUploads}
          weeklyShifts={weeklyShifts}
          notices={notices}
          closingPrices={closingPrices}
          isAuthenticated={true}
        />
      </main>
    </div>
  )
}
