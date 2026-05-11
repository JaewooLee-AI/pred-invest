import { Navbar } from '@/components/Navbar'
import { ChartCarousel } from '@/components/charts/ChartCarousel'
import { AssetChart } from '@/components/charts/AssetChart'
import { getLatestCsvUpload, getAllNotices, getLatestWeeklyShift } from '@/lib/db'
import { ASSET_NAMES } from '@/lib/csv-parser'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const [csvData, notices, weeklyShift] = await Promise.all([
    getLatestCsvUpload(),
    getAllNotices(),
    getLatestWeeklyShift(),
  ])

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Hero / Status Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
          <StatCard
            label="기준일"
            value={csvData?.referenceDate ?? '—'}
            color="var(--accent-amber)"
            sub={csvData ? `업로드: ${new Date(csvData.uploadedAt).toLocaleDateString('ko-KR')}` : '데이터 없음'}
          />
          <StatCard
            label="주간 궤적"
            value={weeklyShift?.label ?? '—'}
            color="var(--accent-purple)"
            sub={weeklyShift ? `${weeklyShift.assets.filter(a => a.imagePath).length}개 자산 이미지` : '데이터 없음'}
          />
          <StatCard
            label="공지사항"
            value={`${notices.length}건`}
            color="var(--accent-emerald)"
            sub="최신 공지 목록"
          />
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-4">
          {/* Charts Section — 9 assets */}
          <section className="col-span-12">
            <SectionHeader title="다중 자산군 상승 확률" sub="A·B·C 모델 3종 — 50주 예측 시계열" infoHref="/about/classification" infoLabel="분류 모델 안내 →" />
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

          {/* Weekly Shift Preview */}
          <section className="col-span-12 lg:col-span-8">
            <SectionHeader title="주간 DTW 궤적" sub="현재 시장과 가장 유사한 과거 궤적 투사" infoHref="/about/dtw" infoLabel="DTW 안내 →" />
            {weeklyShift ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {weeklyShift.assets.filter(a => a.imagePath).slice(0, 3).map(asset => (
                  <ShiftThumb key={asset.name} asset={asset} />
                ))}
                {weeklyShift.assets.filter(a => a.imagePath).length > 3 && (
                  <Link href="/weekly-shift">
                    <div
                      className="rounded-xl border flex items-center justify-center text-xs transition-colors hover:border-purple-500/50 cursor-pointer"
                      style={{ borderColor: 'var(--border)', background: 'var(--card)', aspectRatio: '4/3', color: 'var(--muted)' }}
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
            <SectionHeader title="공지사항" sub="최신 분석 리포트" />
            {notices.length > 0 ? (
              <div className="flex flex-col gap-3">
                {notices.slice(0, 4).map(n => (
                  <a
                    key={n.id}
                    href={n.filePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border p-4 hover:border-emerald-500/40 transition-colors block"
                    style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-lg shrink-0">📄</span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{n.filename}</p>
                        <p className="text-xs mt-1 leading-relaxed line-clamp-3"
                           style={{ color: 'var(--muted)' }}>
                          {n.description}
                        </p>
                        <p className="text-xs mt-2 font-mono" style={{ color: '#52525b' }}>
                          {new Date(n.uploadedAt).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
                {notices.length > 4 && (
                  <Link href="/notices" className="text-xs text-center py-2" style={{ color: 'var(--muted)' }}>
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
    <div className="rounded-xl border p-5" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
      <p className="text-xs font-medium mb-1" style={{ color: 'var(--muted)' }}>{label}</p>
      <p className="text-2xl font-bold font-mono" style={{ color }}>{value}</p>
      <p className="text-xs mt-1" style={{ color: '#52525b' }}>{sub}</p>
    </div>
  )
}

function SectionHeader({ title, sub, infoHref, infoLabel }: { title: string; sub: string; infoHref?: string; infoLabel?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4">
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      <span className="text-xs hidden sm:inline" style={{ color: 'var(--muted)' }}>{sub}</span>
      {infoHref && (
        <Link
          href={infoHref}
          className="ml-auto text-xs px-2.5 py-1 rounded-full border transition-colors hover:bg-zinc-800"
          style={{ color: 'var(--muted)', borderColor: 'var(--border)' }}
        >
          {infoLabel ?? '모델 안내 →'}
        </Link>
      )}
    </div>
  )
}

function AssetCard({ asset, data, comment }: {
  asset: string
  data: Array<{ date: string; A: number; B: number; C: number }>
  comment: string
}) {
  const latest = data[data.length - 1]
  const avgProb = latest ? ((latest.A + latest.B + latest.C) / 3).toFixed(1) : null

  return (
    <div className="rounded-xl border p-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">{asset}</h3>
        {avgProb && (
          <span
            className="text-xs font-mono font-bold px-2 py-0.5 rounded"
            style={{
              background: parseFloat(avgProb) >= 60 ? 'rgba(16,185,129,0.15)' : parseFloat(avgProb) >= 40 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
              color: parseFloat(avgProb) >= 60 ? '#10b981' : parseFloat(avgProb) >= 40 ? '#f59e0b' : '#ef4444',
            }}
          >
            {avgProb}%
          </span>
        )}
      </div>
      {data.length > 0 ? (
        <AssetChart asset={asset} data={data} />
      ) : (
        <div className="h-44 flex items-center justify-center text-xs" style={{ color: 'var(--muted)' }}>
          데이터 없음
        </div>
      )}
      {comment && (
        <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>{comment}</p>
        </div>
      )}
    </div>
  )
}

function ShiftThumb({ asset }: { asset: { name: string; imagePath: string; description: string } }) {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset.imagePath}
        alt={asset.name}
        className="w-full object-cover"
        style={{ aspectRatio: '4/3' }}
      />
      <div className="px-3 py-2">
        <p className="text-xs font-semibold text-white">{asset.name}</p>
        {asset.description && (
          <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--muted)' }}>{asset.description}</p>
        )}
      </div>
    </div>
  )
}

function EmptyState({ msg, cta, href }: { msg: string; cta: string; href: string }) {
  return (
    <div
      className="rounded-xl border flex flex-col items-center justify-center py-12 text-center"
      style={{ borderColor: 'var(--border)', background: 'var(--card)', borderStyle: 'dashed' }}
    >
      <p className="text-sm mb-1" style={{ color: 'var(--muted)' }}>{msg}</p>
      <Link href={href} className="text-xs mt-2 underline underline-offset-2" style={{ color: 'var(--accent-blue)' }}>
        {cta}
      </Link>
    </div>
  )
}
