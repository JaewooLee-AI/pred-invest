'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChartCarousel } from '@/components/charts/ChartCarousel'
import { ProbIndexCarousel } from '@/components/charts/ProbIndexCarousel'
import { DtwChart } from '@/components/charts/DtwChart'
import { WeeklyShiftGallery } from '@/components/gallery/WeeklyShiftGallery'
import type { CsvUpload, ProbUpload, WeeklyShift, Notice } from '@/lib/db'

interface Props {
  csvUploads: CsvUpload[]
  probUploads: ProbUpload[]
  weeklyShifts: WeeklyShift[]
  notices: Notice[]
}

export function DashboardContent({ csvUploads, probUploads, weeklyShifts, notices }: Props) {
  const [csvKey, setCsvKey] = useState(csvUploads[0]?.referenceDate ?? '')
  const [probKey, setProbKey] = useState(probUploads[0]?.referenceDate ?? '')
  const [dtwKey, setDtwKey] = useState(weeklyShifts[0]?.label ?? '')

  const csvData = csvUploads.find(u => u.referenceDate === csvKey) ?? csvUploads[0] ?? null
  const probData = probUploads.find(u => u.referenceDate === probKey) ?? probUploads[0] ?? null
  const weeklyShift = weeklyShifts.find(s => s.label === dtwKey) ?? weeklyShifts[0] ?? null

  return (
    <>
      {/* Stat cards with date selectors — 아래 섹션 순서와 동일: Prob/Index → Classification → DTW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        <DateStatCard
          label="Prob/Index 기준일"
          selected={probData?.referenceDate ?? '—'}
          dates={probUploads.map(u => u.referenceDate)}
          onSelect={setProbKey}
          accent="#b45309"
          accentBg="#fffbeb"
          accentBd="#fde68a"
        />
        <DateStatCard
          label="분류모델 기준일"
          selected={csvData?.referenceDate ?? '—'}
          dates={csvUploads.map(u => u.referenceDate)}
          onSelect={setCsvKey}
          accent="#2563eb"
          accentBg="#eff6ff"
          accentBd="#bfdbfe"
        />
        <DateStatCard
          label="DTW 기준일"
          selected={weeklyShift?.label ?? '—'}
          dates={weeklyShifts.map(s => s.label)}
          onSelect={setDtwKey}
          accent="#7c3aed"
          accentBg="#f5f3ff"
          accentBd="#ddd6fe"
        />
      </div>

      {/* Divider */}
      <div className="border-t border-zinc-100 my-10" />

      {/* Prob & Index section */}
      <section className="mb-12">
        <SectionHeader
          title="예측 확률 & 예상 지수"
          sub="자산별 상승 확률(점선) · 예상 지수(실선) 주간 예측"
          badge="Prob/Index"
          badgeColor="#b45309"
          badgeBg="#fffbeb"
          badgeBd="#fde68a"
          href="/admin/upload-prob"
          hrefLabel="데이터 업로드 →"
        />
        {probData ? (
          <ProbIndexCarousel probData={probData.probData} />
        ) : (
          <EmptyState
            msg="업로드된 확률/지수 데이터가 없습니다."
            cta="관리자 페이지에서 CSV를 업로드하세요."
            href="/admin/upload-prob"
          />
        )}
      </section>

      {/* Divider */}
      <div className="border-t border-zinc-100 mb-10" />

      {/* Classification section */}
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
        {/* Weekly DTW */}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {weeklyShift.assets.filter(a => a.data?.length > 0).slice(0, 2).map(asset => (
                <div key={asset.name} className="rounded-xl border border-zinc-200 bg-white p-4">
                  <p className="text-xs font-semibold text-violet-600 mb-2">{asset.name}</p>
                  <DtwChart data={asset.data} assetName={asset.name} />
                </div>
              ))}
              {weeklyShift.assets.filter(a => a.data?.length > 0).length > 2 && (
                <Link href="/weekly-shift" className="sm:col-span-2">
                  <div
                    className="rounded-xl flex items-center justify-center text-sm font-medium text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 transition-colors cursor-pointer py-4"
                    style={{ border: '1px dashed #e4e4e7' }}
                  >
                    +{weeklyShift.assets.filter(a => a.data?.length > 0).length - 2}개 더보기 →
                  </div>
                </Link>
              )}
            </div>
          ) : (
            <EmptyState
              msg="주간 궤적 데이터가 없습니다."
              cta="관리자 페이지에서 CSV를 업로드하세요."
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
    </>
  )
}

function DateStatCard({
  label, selected, dates, onSelect, accent, accentBg, accentBd,
}: {
  label: string
  selected: string
  dates: string[]
  onSelect: (v: string) => void
  accent: string
  accentBg: string
  accentBd: string
}) {
  return (
    <div
      className="rounded-xl p-5 border bg-white"
      style={{ borderColor: '#e4e4e7', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.04)' }}
    >
      <p className="text-xs font-medium text-zinc-500 mb-2">{label}</p>
      <p className="text-xl sm:text-2xl font-bold font-mono tracking-tight truncate" style={{ color: accent }}>
        {selected}
      </p>
      {dates.length > 1 ? (
        <select
          value={selected}
          onChange={e => onSelect(e.target.value)}
          className="mt-2 w-full text-xs rounded-md border px-2 py-1.5 outline-none cursor-pointer transition-colors"
          style={{
            borderColor: accentBd,
            background: accentBg,
            color: accent,
          }}
        >
          {dates.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      ) : (
        <p className="text-xs text-zinc-400 mt-1.5">
          {dates.length === 0 ? '데이터 없음' : '최신 데이터'}
        </p>
      )}
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
        <Link href={href} className="ml-auto text-xs text-zinc-400 hover:text-zinc-700 transition-colors">
          {hrefLabel}
        </Link>
      )}
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
