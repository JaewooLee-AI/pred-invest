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
    <div className="min-h-screen" style={{ background: '#000' }}>
      <Navbar />

      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 sm:py-10">

        {/* Stat row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
          <StatCard
            label="분류모델 기준일"
            value={csvData?.referenceDate ?? '—'}
            color="#ff9f0a"
            sub={csvData ? `업로드: ${new Date(csvData.uploadedAt).toLocaleDateString('ko-KR')}` : '데이터 없음'}
          />
          <StatCard
            label="DTW 기준일"
            value={weeklyShift?.label ?? '—'}
            color="#bf5af2"
            sub={weeklyShift ? `${weeklyShift.assets.filter(a => a.imagePath).length}개 자산 이미지` : '데이터 없음'}
          />
          <StatCard
            label="공지사항"
            value={`${notices.length}건`}
            color="#30d158"
            sub="최신 공지 목록"
          />
        </div>

        {/* Charts Section */}
        <section className="mb-12">
          <SectionHeader
            title="다중 자산군 상승 확률"
            sub="A·B·C 모델 3종 — 50주 예측 시계열"
            infoHref="/about/classification"
            infoLabel="분류 모델 안내"
            color="#2997ff"
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
        <div className="grid grid-cols-12 gap-5">
          {/* Weekly Shift */}
          <section className="col-span-12 lg:col-span-8">
            <SectionHeader
              title="주간 DTW 궤적"
              sub="현재 시장과 가장 유사한 과거 궤적 투사"
              infoHref="/about/dtw"
              infoLabel="DTW 안내"
              color="#bf5af2"
            />
            {weeklyShift ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {weeklyShift.assets.filter(a => a.imagePath).slice(0, 3).map(asset => (
                  <ShiftThumb key={asset.name} asset={asset} />
                ))}
                {weeklyShift.assets.filter(a => a.imagePath).length > 3 && (
                  <Link href="/weekly-shift">
                    <div
                      className="rounded-2xl flex items-center justify-center text-xs transition-all hover:opacity-80 cursor-pointer"
                      style={{
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: 'rgba(255,255,255,0.03)',
                        aspectRatio: '4/3',
                        color: '#86868b',
                      }}
                    >
                      +{weeklyShift.assets.filter(a => a.imagePath).length - 3}개 더보기 →
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
          <section className="col-span-12 lg:col-span-4">
            <SectionHeader title="공지사항" sub="최신 분석 리포트" color="#30d158" />
            {notices.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                {notices.slice(0, 4).map(n => (
                  <a
                    key={n.id}
                    href={n.filePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-2xl p-4 transition-all hover:opacity-80 block"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-base"
                        style={{ background: 'rgba(48,209,88,0.1)' }}
                      >
                        📄
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate" style={{ color: '#f5f5f7' }}>{n.filename}</p>
                        <p className="text-xs mt-1 leading-relaxed line-clamp-2" style={{ color: '#86868b' }}>
                          {n.description}
                        </p>
                        <p className="text-xs mt-2 font-mono" style={{ color: '#3a3a3c' }}>
                          {new Date(n.uploadedAt).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
                {notices.length > 4 && (
                  <Link href="/notices" className="text-xs text-center py-2 transition-colors hover:opacity-80" style={{ color: '#86868b' }}>
                    전체 보기 →
                  </Link>
                )}
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

function StatCard({ label, value, color, sub }: { label: string; value: string; color: string; sub: string }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <p className="text-xs mb-2" style={{ color: '#86868b' }}>{label}</p>
      <p className="text-2xl font-bold font-mono tracking-tight" style={{ color }}>{value}</p>
      <p className="text-xs mt-1.5" style={{ color: '#3a3a3c' }}>{sub}</p>
    </div>
  )
}

function SectionHeader({
  title, sub, infoHref, infoLabel,
}: {
  title: string; sub: string; infoHref?: string; infoLabel?: string; color?: string
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4">
      <h2 className="text-sm font-semibold" style={{ color: '#f5f5f7' }}>{title}</h2>
      <span className="text-xs hidden sm:inline" style={{ color: '#86868b' }}>{sub}</span>
      {infoHref && (
        <Link
          href={infoHref}
          className="ml-auto text-xs px-3 py-1 rounded-full transition-all hover:opacity-80"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#86868b',
          }}
        >
          {infoLabel ?? '안내'} →
        </Link>
      )}
    </div>
  )
}

function ShiftThumb({ asset }: { asset: { name: string; imagePath: string; description: string } }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset.imagePath}
        alt={asset.name}
        className="w-full object-cover"
        style={{ aspectRatio: '4/3' }}
      />
      <div className="px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.03)' }}>
        <p className="text-xs font-semibold" style={{ color: '#f5f5f7' }}>{asset.name}</p>
        {asset.description && (
          <p className="text-xs mt-0.5 line-clamp-2" style={{ color: '#86868b' }}>{asset.description}</p>
        )}
      </div>
    </div>
  )
}

function EmptyState({ msg, cta, href }: { msg: string; cta: string; href: string }) {
  return (
    <div
      className="rounded-2xl flex flex-col items-center justify-center py-12 text-center"
      style={{
        border: '1px dashed rgba(255,255,255,0.1)',
        background: 'rgba(255,255,255,0.02)',
      }}
    >
      <p className="text-sm mb-1" style={{ color: '#86868b' }}>{msg}</p>
      <Link href={href} className="text-xs mt-2 transition-all hover:opacity-80" style={{ color: '#2997ff' }}>
        {cta}
      </Link>
    </div>
  )
}
