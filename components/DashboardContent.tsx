'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChartCarousel } from '@/components/charts/ChartCarousel'
import { ProbIndexCarousel } from '@/components/charts/ProbIndexCarousel'
import { DtwChart } from '@/components/charts/DtwChart'
import type { CsvUpload, ProbUpload, WeeklyShift, Notice } from '@/lib/db'

interface Props {
  csvUploads: CsvUpload[]
  probUploads: ProbUpload[]
  weeklyShifts: WeeklyShift[]
  notices: Notice[]
  isAuthenticated: boolean
}

export function DashboardContent({ csvUploads, probUploads, weeklyShifts, notices, isAuthenticated }: Props) {
  const [csvKey, setCsvKey] = useState(csvUploads[0]?.referenceDate ?? '')
  const [probKey, setProbKey] = useState(probUploads[0]?.referenceDate ?? '')
  const [dtwKey, setDtwKey] = useState(weeklyShifts[0]?.label ?? '')

  const csvData = csvUploads.find(u => u.referenceDate === csvKey) ?? csvUploads[0] ?? null
  const probData = probUploads.find(u => u.referenceDate === probKey) ?? probUploads[0] ?? null
  const weeklyShift = weeklyShifts.find(s => s.label === dtwKey) ?? weeklyShifts[0] ?? null

  return (
    <>
      <Divider />

      {/* Prob & Index */}
      <section className="mb-14">
        <SectionHeader
          title="예측 확률 & 예상 지수"
          sub="자산별 상승 확률(점선) · 예상 지수(실선) 주간 예측"
          badge="Prob / Index"
          accent="var(--amber)"
          accentTint="var(--amber-tint)"
          accentBorder="var(--amber-border)"
          dates={isAuthenticated ? probUploads.map(u => u.referenceDate) : []}
          selectedDate={probData?.referenceDate ?? ''}
          onSelectDate={setProbKey}
        />
        {isAuthenticated ? (
          probData ? (
            <ProbIndexCarousel probData={probData.probData} />
          ) : (
            <EmptyState msg="업로드된 확률/지수 데이터가 없습니다." href="/admin/upload-prob" cta="관리자 업로드" />
          )
        ) : (
          <AuthGate />
        )}
      </section>

      <Divider />

      {/* Classification */}
      <section className="mb-14">
        <SectionHeader
          title="다중 자산군 상승 확률"
          sub="A · B · C 모델 3종 앙상블 — 50주 예측"
          badge="Classification"
          accent="var(--blue)"
          accentTint="var(--blue-tint)"
          accentBorder="var(--blue-border)"
          dates={isAuthenticated ? csvUploads.map(u => u.referenceDate) : []}
          selectedDate={csvData?.referenceDate ?? ''}
          onSelectDate={setCsvKey}
        />
        {isAuthenticated ? (
          csvData ? (
            <ChartCarousel chartData={csvData.chartData} assetComments={csvData.assetComments} />
          ) : (
            <EmptyState msg="업로드된 CSV 데이터가 없습니다." href="/admin/upload-csv" cta="관리자 업로드" />
          )
        ) : (
          <AuthGate />
        )}
      </section>

      <Divider />

      {/* DTW + Notices grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* DTW */}
        <section className="lg:col-span-8">
          <SectionHeader
            title="주간 DTW 궤적"
            sub="현재 시장과 가장 유사한 과거 패턴 투사"
            badge="DTW"
            accent="var(--purple)"
            accentTint="var(--purple-tint)"
            accentBorder="var(--purple-border)"
            dates={isAuthenticated ? weeklyShifts.map(s => s.label) : []}
            selectedDate={weeklyShift?.label ?? ''}
            onSelectDate={setDtwKey}
          />
          {isAuthenticated ? (
            weeklyShift ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {weeklyShift.assets.filter(a => a.data?.length > 0).slice(0, 2).map(asset => (
                  <div
                    key={asset.name}
                    className="rounded-2xl p-4"
                    style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                  >
                    <p
                      className="text-xs font-semibold mb-3 px-2 py-0.5 rounded-md inline-block"
                      style={{
                        color: 'var(--purple)',
                        background: 'var(--purple-tint)',
                        border: '1px solid var(--purple-border)',
                      }}
                    >
                      {asset.name}
                    </p>
                    <DtwChart data={asset.data} assetName={asset.name} />
                  </div>
                ))}
                {weeklyShift.assets.filter(a => a.data?.length > 0).length > 2 && (
                  <Link href="/weekly-shift" className="sm:col-span-2">
                    <div
                      className="rounded-2xl flex items-center justify-center text-sm font-medium transition-colors py-5 cursor-pointer"
                      style={{
                        border: '1px dashed rgba(167,139,250,0.25)',
                        color: 'var(--text-muted)',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLDivElement).style.background = 'var(--purple-tint)'
                        ;(e.currentTarget as HTMLDivElement).style.color = 'var(--purple)'
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLDivElement).style.background = 'transparent'
                        ;(e.currentTarget as HTMLDivElement).style.color = 'var(--text-muted)'
                      }}
                    >
                      +{weeklyShift.assets.filter(a => a.data?.length > 0).length - 2}개 더보기 →
                    </div>
                  </Link>
                )}
              </div>
            ) : (
              <EmptyState msg="주간 궤적 데이터가 없습니다." href="/admin/weekly-shift" cta="관리자 업로드" />
            )
          ) : (
            <AuthGate compact />
          )}
        </section>

        {/* Notices — visible to all */}
        <section className="lg:col-span-4">
          <SectionHeader
            title="공지사항"
            sub="최신 분석 리포트"
            badge="Reports"
            accent="var(--emerald)"
            accentTint="var(--emerald-tint)"
            accentBorder="var(--emerald-border)"
          />
          {notices.length > 0 ? (
            <div className="flex flex-col gap-2">
              {notices.slice(0, 4).map(n => (
                <a
                  key={n.id}
                  href={n.filePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl p-4 block transition-all"
                  style={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border-strong)'
                    ;(e.currentTarget as HTMLAnchorElement).style.background = 'var(--card-hover)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border)'
                    ;(e.currentTarget as HTMLAnchorElement).style.background = 'var(--card)'
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm"
                      style={{ background: 'var(--emerald-tint)', border: '1px solid var(--emerald-border)' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <rect x="1" y="1" width="12" height="12" rx="2" stroke="var(--emerald)" strokeWidth="1.2" />
                        <path d="M4 5h6M4 7h6M4 9h4" stroke="var(--emerald)" strokeWidth="1.2" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-xs font-semibold truncate transition-colors"
                        style={{ color: 'var(--text)' }}
                      >
                        {n.filename}
                      </p>
                      <p className="text-xs mt-1 leading-relaxed line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                        {n.description}
                      </p>
                      <p className="text-[10px] mt-1.5 font-mono" style={{ color: 'var(--text-muted)' }}>
                        {new Date(n.uploadedAt).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <EmptyState msg="공지사항이 없습니다." href="/admin/notice" cta="관리자 업로드" />
          )}
        </section>
      </div>
    </>
  )
}

/* ─── Sub-components ─── */

function SectionHeader({
  title, sub, badge, accent, accentTint, accentBorder,
  dates, selectedDate, onSelectDate,
}: {
  title: string; sub: string
  badge: string; accent: string; accentTint: string; accentBorder: string
  dates?: string[]; selectedDate?: string; onSelectDate?: (v: string) => void
}) {
  return (
    <div className="mb-6">
      {/* Date row — above title */}
      {dates && dates.length > 0 && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>기준일</span>
          {dates.length === 1 ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold font-mono" style={{ color: accent }}>
                {selectedDate}
              </span>
              <span
                className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                style={{ background: accentTint, border: `1px solid ${accentBorder}`, color: accent }}
              >
                최신
              </span>
            </div>
          ) : (
            <select
              value={selectedDate}
              onChange={e => onSelectDate?.(e.target.value)}
              className="text-sm font-bold font-mono rounded-md border px-2 py-0.5 outline-none cursor-pointer"
              style={{ borderColor: accentBorder, background: accentTint, color: accent }}
            >
              {dates.map((d, i) => (
                <option key={d} value={d} style={{ background: 'var(--card)', color: 'var(--text)' }}>
                  {d}{i === 0 ? ' (최신)' : ''}
                </option>
              ))}
            </select>
          )}
        </div>
      )}
      {/* Title row */}
      <div className="flex flex-wrap items-center gap-3">
        <span
          className="text-[10px] font-semibold px-2.5 py-1 rounded-full tracking-wide"
          style={{ background: accentTint, border: `1px solid ${accentBorder}`, color: accent }}
        >
          {badge}
        </span>
        <h2 className="text-base font-bold" style={{ color: 'var(--text)' }}>{title}</h2>
        <span className="text-xs hidden sm:inline" style={{ color: 'var(--text-muted)' }}>{sub}</span>
      </div>
    </div>
  )
}

function Divider() {
  return (
    <div
      className="mb-12"
      style={{ height: '1px', background: 'linear-gradient(90deg, var(--border-strong) 0%, transparent 100%)' }}
    />
  )
}

function AuthGate({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`rounded-2xl flex flex-col items-center justify-center text-center ${compact ? 'py-10' : 'py-16'}`}
      style={{
        background: 'var(--card)',
        border: '1px dashed var(--border-strong)',
      }}
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
        style={{
          background: 'rgba(99,102,241,0.12)',
          border: '1px solid rgba(99,102,241,0.25)',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="3" y="9" width="14" height="9" rx="2" stroke="#818cf8" strokeWidth="1.5" />
          <path d="M7 9V6a3 3 0 016 0v3" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="10" cy="13.5" r="1.5" fill="#818cf8" />
        </svg>
      </div>
      <p className="text-sm font-semibold mb-1.5" style={{ color: 'var(--text)' }}>
        로그인 후 확인 가능합니다
      </p>
      <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>
        분석 데이터에 접근하려면 로그인하세요
      </p>
      <Link
        href="/login"
        className="px-5 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
        style={{
          background: 'linear-gradient(135deg, #6366f1, #818cf8)',
          color: '#fff',
          boxShadow: '0 0 16px rgba(99,102,241,0.25)',
        }}
      >
        로그인하기
      </Link>
    </div>
  )
}

function EmptyState({ msg, cta, href }: { msg: string; cta: string; href: string }) {
  return (
    <div
      className="rounded-2xl py-14 flex flex-col items-center justify-center text-center"
      style={{ border: '1px dashed var(--border)', background: 'var(--card)' }}
    >
      <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>{msg}</p>
      <Link
        href={href}
        className="text-xs transition-colors"
        style={{ color: 'var(--indigo-soft)' }}
      >
        {cta} →
      </Link>
    </div>
  )
}
