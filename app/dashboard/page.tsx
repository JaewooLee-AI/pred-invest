import { Navbar } from '@/components/Navbar'
import { DashboardContent } from '@/components/DashboardContent'
import { getAllCsvUploads, getAllProbUploads, getAllWeeklyShifts, getAllNotices } from '@/lib/db'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  const [csvUploads, probUploads, weeklyShifts, notices] = await Promise.all([
    getAllCsvUploads(),
    getAllProbUploads(),
    getAllWeeklyShifts(),
    getAllNotices(),
  ])

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <span
              className="text-[10px] font-mono tracking-[0.18em] uppercase px-2.5 py-1 rounded-full"
              style={{
                color: 'var(--indigo-soft)',
                background: 'rgba(99,102,241,0.10)',
                border: '1px solid rgba(99,102,241,0.22)',
              }}
            >
              CrossAsset Analytics
            </span>
          </div>
          <h1
            className="text-3xl sm:text-[2.6rem] font-extrabold tracking-tight leading-[1.15]"
            style={{
              background: 'linear-gradient(120deg, #3b82f6 0%, #6366f1 40%, #ffffff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            CrossAsset Dashboard
          </h1>
          <p className="text-sm mt-3 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            다중 자산군 상승 확률 &middot; DTW 궤적 &middot; 시장 분석 리포트
          </p>
        </div>

        <DashboardContent
          csvUploads={csvUploads}
          probUploads={probUploads}
          weeklyShifts={weeklyShifts}
          notices={notices}
          isAuthenticated={true}
        />
      </main>
    </div>
  )
}
