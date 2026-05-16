import Link from 'next/link'
import { getLatestCsvUpload, getAllWeeklyShifts, getAllNotices, getLatestProbUpload, getClosingPrices } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const [csvUpload, probUpload, weeklyShifts, notices, closingPriceData] = await Promise.all([
    getLatestCsvUpload(),
    getLatestProbUpload(),
    getAllWeeklyShifts(),
    getAllNotices(),
    getClosingPrices(),
  ])

  const stats = [
    { label: 'CSV 업로드', count: csvUpload ? 1 : 0, href: '/admin/upload-csv', accent: 'var(--blue)', borderTop: '#60a5fa' },
    { label: '확률/지수 업로드', count: probUpload ? 1 : 0, href: '/admin/upload-prob', accent: 'var(--amber)', borderTop: '#fbbf24' },
    { label: '주간 궤적', count: weeklyShifts.length, href: '/admin/weekly-shift', accent: 'var(--purple)', borderTop: '#a78bfa' },
    { label: '종가 데이터', count: Object.keys(closingPriceData).length, href: '/admin/closing-price', accent: 'var(--emerald)', borderTop: '#34d399' },
    { label: '공지사항', count: notices.length, href: '/admin/notice', accent: 'var(--rose)', borderTop: '#f87171' },
  ]

  const quickLinks = [
    { href: '/admin/upload-csv', title: 'CSV 업로드', desc: 'A/B/C 모델 상승 확률 데이터 업로드', accent: 'var(--blue)' },
    { href: '/admin/upload-prob', title: '확률/지수 업로드', desc: '자산별 상승 확률 & 예상 지수 업로드', accent: 'var(--amber)' },
    { href: '/admin/weekly-shift', title: '주간 궤적 업로드', desc: 'DTW 롤링 시프트 CSV 업로드', accent: 'var(--purple)' },
    { href: '/admin/closing-price', title: '종가 데이터 업로드', desc: '자산별 날짜별 종가 CSV 업로드', accent: 'var(--emerald)' },
    { href: '/admin/notice', title: '공지사항 업로드', desc: 'PDF 공지사항 및 설명 업로드', accent: 'var(--rose)' },
    { href: '/', title: '사용자 화면 보기', desc: '메인 대시보드 미리보기', accent: 'var(--text-secondary)' },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-[10px] font-mono tracking-[0.18em] uppercase px-2.5 py-1 rounded-full"
            style={{ color: 'var(--indigo-soft)', background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(99,102,241,0.22)' }}
          >
            Admin Console
          </span>
        </div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>관리자 대시보드</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>데이터 업로드 및 관리</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        {stats.map(s => (
          <Link key={s.href} href={s.href}>
            <div
              className="rounded-2xl p-5 card-hover cursor-pointer"
              style={{ borderTop: `2px solid ${s.borderTop}` }}
            >
              <p className="text-[10px] font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                {s.label}
              </p>
              <p className="text-3xl font-bold" style={{ color: s.accent }}>{s.count}</p>
              <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>건 등록됨</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {quickLinks.map(q => (
          <Link key={q.href} href={q.href}>
            <div className="rounded-2xl p-4 card-hover cursor-pointer flex items-center gap-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-base"
                style={{ color: q.accent, background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
              >
                →
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{q.title}</p>
                <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{q.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
