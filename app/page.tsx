import { Navbar } from '@/components/Navbar'
import { ChartCarousel } from '@/components/charts/ChartCarousel'
import { getLatestCsvUpload, getAllNotices, getLatestWeeklyShift } from '@/lib/db'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const [csvData, notices, weeklyShift] = await Promise.all([
    getLatestCsvUpload(),
    getAllNotices(),
    getLatestWeeklyShift(),
  ])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">

        {/* Page header */}
        <div className="mb-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight leading-tight">
                크로스에셋 대시보드
              </h1>
              <p className="text-base text-zinc-500 mt-2">
                다중 자산군 상승 확률 · DTW 궤적 · 시장 분석 리포트
              </p>
            </div>
            <div className="flex items-center gap-2 mt-1">
              {csvData && (
                <span
                  className="text-xs font-mono px-2.5 py-1 rounded-full"
                  style={{ background: '#fffbeb', border: '1px solid #fde68a', color: '#b45309' }}
                >
                  기준일 {csvData.referenceDate}
                </span>
              )}
            </div>
          </div>

          {/* Stat row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <StatCard
              label="분류모델 기준일"
              value={csvData?.referenceDate ?? '—'}
              sub={csvData ? `업로드: ${new Date(csvData.uploadedAt).toLocaleDateString('ko-KR')}` : '데이터 없음'}
              accent="#2563eb"
              accentBg="#eff6ff"
              accentBd="#bfdbfe"
            />
            <StatCard
              label="DTW 기준일"
              value={weeklyShift?.label ?? '—'}
              sub={weeklyShift ? `${weeklyShift.assets.filter(a => a.imagePath).length}개 자산 이미지` : '데이터 없음'}
              accent="#7c3aed"
              accentBg="#f5f3ff"
              accentBd="#ddd6fe"
            />
            <StatCard
              label="공지사항"
              value={`${notices.length}건`}
              sub="최신 공지 목록"
              accent="#16a34a"
              accentBg="#f0fdf4"
              accentBd="#bbf7d0"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-100 mb-10" />

        {/* Charts section */}
        <section className="mb-12">
          <SectionHeader
            title="다중 자산군 상승 확률"
            sub="A·B·C 모델 3종 앙상블 — 50주 예측"
            badge="Classification"
            badgeColor="#1d4ed8"
            badgeBg="#eff6ff"
            badgeBd="#bfdbfe"
            href="/about/classification"
            hrefLabel="모델 안내 →"
          />
          {csvData ? (
            <ChartCarousel chartData={csvData.chartData} assetComments={csvData.assetComments} />
          ) : (
            <EmptyState
              msg="업로드된 CSV 데이터가 없습니다."
              cta="관리자 페이지에서 CSV를 업로드하세요."
              href="/admin/upload-csv"
            />
          )}
        </section>

        {/* Bottom grid */}
        <div className="border-t border-zinc-100 mb-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Weekly shift */}
          <section className="lg:col-span-8">
            <SectionHeader
              title="주간 DTW 궤적"
              sub="현재 시장과 가장 유사한 과거 패턴 투사"
              badge="DTW"
              badgeColor="#6d28d9"
              badgeBg="#f5f3ff"
              badgeBd="#ddd6fe"
              href="/about/dtw"
              hrefLabel="DTW 안내 →"
            />
            {weeklyShift ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {weeklyShift.assets.filter(a => a.imagePath).slice(0, 3).map(asset => (
                  <ShiftThumb key={asset.name} asset={asset} />
                ))}
                {weeklyShift.assets.filter(a => a.imagePath).length > 3 && (
                  <Link href="/weekly-shift">
                    <div
                      className="rounded-xl flex items-center justify-center text-sm font-medium text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 transition-colors cursor-pointer"
                      style={{ border: '1px dashed #e4e4e7', aspectRatio: '4/3' }}
                    >
                      +{weeklyShift.assets.filter(a => a.imagePath).length - 3}개 더보기
                    </div>
                  </Link>
                )}
              </div>
            ) : (
              <EmptyState
                msg="주간 궤적 데이터가 없습니다."
                cta="관리자 페이지에서 이미지를 업로드하세요."
                href="/admin/weekly-shift"
              />
            )}
          </section>

          {/* Notices */}
          <section className="lg:col-span-4">
            <SectionHeader
              title="공지사항"
              sub="최신 분석 리포트"
              badge="Reports"
              badgeColor="#15803d"
              badgeBg="#f0fdf4"
              badgeBd="#bbf7d0"
              href="/notices"
              hrefLabel="전체 보기 →"
            />
            {notices.length > 0 ? (
              <div className="flex flex-col gap-2">
                {notices.slice(0, 4).map(n => (
                  <a
                    key={n.id}
                    href={n.filePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl p-4 border border-zinc-200 hover:border-zinc-300 hover:shadow-sm transition-all block bg-white"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm"
                        style={{ background: '#f0fdf4' }}
                      >
                        📄
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-zinc-900 truncate">{n.filename}</p>
                        <p className="text-xs mt-1 leading-relaxed text-zinc-500 line-clamp-2">
                          {n.description}
                        </p>
                        <p className="text-xs mt-1.5 font-mono text-zinc-400">
                          {new Date(n.uploadedAt).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <EmptyState
                msg="공지사항이 없습니다."
                cta="관리자 페이지에서 PDF를 업로드하세요."
                href="/admin/notice"
              />
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

function StatCard({
  label, value, sub, accent,
}: {
  label: string; value: string; sub: string
  accent: string; accentBg?: string; accentBd?: string
}) {
  return (
    <div
      className="rounded-xl p-5 border bg-white"
      style={{ borderColor: '#e4e4e7', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.04)' }}
    >
      <p className="text-xs font-medium text-zinc-500 mb-2">{label}</p>
      <p
        className="text-2xl sm:text-3xl font-bold font-mono tracking-tight"
        style={{ color: accent }}
      >
        {value}
      </p>
      <p className="text-xs text-zinc-400 mt-1.5">{sub}</p>
    </div>
  )
}

function SectionHeader({
  title, sub, badge, badgeColor, badgeBg, badgeBd, href, hrefLabel,
}: {
  title: string; sub: string
  badge: string; badgeColor: string; badgeBg: string; badgeBd: string
  href?: string; hrefLabel?: string
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-5">
      <span
        className="text-[10px] font-semibold px-2.5 py-1 rounded-full tracking-wide"
        style={{ background: badgeBg, border: `1px solid ${badgeBd}`, color: badgeColor }}
      >
        {badge}
      </span>
      <h2 className="text-base font-bold text-zinc-900">{title}</h2>
      <span className="text-sm text-zinc-400 hidden sm:inline">{sub}</span>
      {href && (
        <Link
          href={href}
          className="ml-auto text-xs text-zinc-400 hover:text-zinc-700 transition-colors"
        >
          {hrefLabel}
        </Link>
      )}
    </div>
  )
}

function ShiftThumb({ asset }: { asset: { name: string; imagePath: string; description: string } }) {
  return (
    <div
      className="rounded-xl overflow-hidden border border-zinc-200 hover:border-zinc-300 hover:shadow-sm transition-all"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset.imagePath}
        alt={asset.name}
        className="w-full object-cover"
        style={{ aspectRatio: '4/3' }}
      />
      <div className="px-3 py-2.5 bg-white">
        <p className="text-xs font-semibold text-zinc-900">{asset.name}</p>
        {asset.description && (
          <p className="text-xs mt-0.5 line-clamp-2 text-zinc-500">{asset.description}</p>
        )}
      </div>
    </div>
  )
}

function EmptyState({ msg, cta, href }: { msg: string; cta: string; href: string }) {
  return (
    <div className="rounded-xl py-14 flex flex-col items-center justify-center text-center border border-dashed border-zinc-200 bg-zinc-50">
      <p className="text-sm text-zinc-400 mb-2">{msg}</p>
      <Link href={href} className="text-xs text-blue-600 hover:text-blue-700 transition-colors">
        {cta}
      </Link>
    </div>
  )
}
