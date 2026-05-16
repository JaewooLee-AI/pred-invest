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
  const dtwSelectedIdx = weeklyShifts.findIndex(s => s.label === weeklyShift?.label)
  // 최신 기준으로 최대 3개 합산 (선택일 + 이전 2개)
  const dtwShifts = weeklyShifts.slice(dtwSelectedIdx, dtwSelectedIdx + 3)

  return (
    <>
      {/* 1. DTW (Most Important) */}
      <section className="mb-14">
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
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {weeklyShift.assets.filter(a => a.data?.length > 0).slice(0, 3).map(asset => (
                  <div
                    key={asset.name}
                    className="rounded-2xl p-5 card-hover bg-white"
                    style={{ border: '1px solid rgba(0,0,0,0.05)' }}
                  >
                    <p
                      className="text-[14px] font-semibold mb-4 px-2.5 py-1 rounded-md inline-block"
                      style={{ color: '#1d1d1f', background: '#f5f5f7' }}
                    >
                      {asset.name}
                    </p>
                    <DtwChart
                      assetName={asset.name}
                      datasets={dtwShifts.map(s => ({
                        label: s.label,
                        data: s.assets.find(a => a.name === asset.name)?.data ?? [],
                      }))}
                    />
                  </div>
                ))}
              </div>
              {weeklyShift.assets.filter(a => a.data?.length > 0).length > 3 && (
                <Link href="/weekly-shift" className="w-full">
                  <div
                    className="rounded-2xl flex items-center justify-center text-[14px] font-medium transition-colors py-3 cursor-pointer w-full"
                    style={{
                      border: '1px solid rgba(0,0,0,0.05)',
                      background: '#f5f5f7',
                      color: '#86868b',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.background = '#e8e8ed'
                      ;(e.currentTarget as HTMLDivElement).style.color = '#1d1d1f'
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.background = '#f5f5f7'
                      ;(e.currentTarget as HTMLDivElement).style.color = '#86868b'
                    }}
                  >
                    전체 자산 상세 분석 →
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

      <Divider />

      {/* 2. Classification */}
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

      {/* 3. Prob & Index */}
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

      {/* 4. Notices */}
      <section>
        <SectionHeader
          title="분석 리포트 및 공지사항"
          sub="최신 분석 자료"
          badge="Reports"
          accent="var(--emerald)"
          accentTint="var(--emerald-tint)"
          accentBorder="var(--emerald-border)"
        />
        {notices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {notices.slice(0, 4).map(n => (
              <a
                key={n.id}
                href={n.filePath}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-[18px] p-5 block transition-all card-hover bg-white"
              >
                <div className="flex flex-col gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm"
                    style={{ background: '#f5f5f7', border: '1px solid rgba(0,0,0,0.05)' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
                      <rect x="1" y="1" width="12" height="12" rx="2" stroke="#86868b" strokeWidth="1.2" />
                      <path d="M4 5h6M4 7h6M4 9h4" stroke="#86868b" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <p
                      className="text-[15px] font-semibold truncate transition-colors text-[#1d1d1f]"
                    >
                      {n.filename}
                    </p>
                    <p className="text-[13px] mt-1.5 leading-relaxed line-clamp-2 text-[#86868b]">
                      {n.description}
                    </p>
                    <p className="text-[11px] mt-3 font-medium text-[#86868b]">
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
    </>
  )
}

/* ─── Sub-components ─── */

function SectionHeader({
  title, sub, badge,
  dates, selectedDate, onSelectDate,
}: {
  title: string; sub: string
  badge: string; accent: string; accentTint: string; accentBorder: string // Kept for prop compat, ignoring unused
  dates?: string[]; selectedDate?: string; onSelectDate?: (v: string) => void
}) {
  return (
    <div className="mb-6">
      {/* Date row */}
      {dates && dates.length > 0 && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[13px] font-medium text-[#86868b]">기준일</span>
          {dates.length === 1 ? (
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-semibold text-[#1d1d1f]">
                {selectedDate}
              </span>
              <span
                className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                style={{ background: '#f5f5f7', color: '#86868b' }}
              >
                최신
              </span>
            </div>
          ) : (
            <select
              value={selectedDate}
              onChange={e => onSelectDate?.(e.target.value)}
              className="text-[14px] font-semibold rounded-md border px-2 py-0.5 outline-none cursor-pointer"
              style={{ borderColor: 'rgba(0,0,0,0.1)', background: '#fff', color: '#1d1d1f' }}
            >
              {dates.map((d, i) => (
                <option key={d} value={d}>
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
          className="text-[12px] font-semibold px-2.5 py-1 rounded-full tracking-wide"
          style={{ background: '#f5f5f7', color: '#1d1d1f' }}
        >
          {badge}
        </span>
        <h2 className="text-[20px] font-semibold text-[#1d1d1f]">{title}</h2>
        <span className="text-[15px] hidden sm:inline text-[#86868b]">{sub}</span>
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
      className={`rounded-[18px] flex flex-col items-center justify-center text-center bg-white ${compact ? 'py-10' : 'py-16'}`}
      style={{
        border: '1px solid rgba(0,0,0,0.05)',
      }}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
        style={{ background: '#f5f5f7' }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="3" y="9" width="14" height="9" rx="2" stroke="#86868b" strokeWidth="1.5" />
          <path d="M7 9V6a3 3 0 016 0v3" stroke="#86868b" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="10" cy="13.5" r="1.5" fill="#86868b" />
        </svg>
      </div>
      <p className="text-[17px] font-semibold mb-2 text-[#1d1d1f]">
        로그인 후 확인 가능합니다
      </p>
      <p className="text-[14px] mb-6 text-[#86868b]">
        분석 데이터에 접근하려면 로그인하세요
      </p>
      <Link
        href="/login"
        className="px-6 py-2 rounded-full text-[14px] font-normal transition-colors"
        style={{ background: '#0071e3', color: '#fff' }}
        onMouseEnter={e => e.currentTarget.style.background = '#0077ed'}
        onMouseLeave={e => e.currentTarget.style.background = '#0071e3'}
      >
        로그인하기
      </Link>
    </div>
  )
}

function EmptyState({ msg, cta, href }: { msg: string; cta: string; href: string }) {
  return (
    <div
      className="rounded-[18px] py-16 flex flex-col items-center justify-center text-center bg-white"
      style={{ border: '1px solid rgba(0,0,0,0.05)' }}
    >
      <p className="text-[15px] mb-4 text-[#86868b]">{msg}</p>
      <Link
        href={href}
        className="text-[14px] font-medium"
        style={{ color: '#0071e3' }}
      >
        {cta} →
      </Link>
    </div>
  )
}
