import Link from 'next/link'
import { getDB } from '@/lib/db'

export default async function AdminPage() {
  const db = await getDB()
  const stats = [
    { label: 'CSV 업로드', count: db.csvUploads.length, href: '/admin/upload-csv', color: 'var(--accent-blue)' },
    { label: '주간 궤적', count: db.weeklyShifts.length, href: '/admin/weekly-shift', color: 'var(--accent-purple)' },
    { label: '공지사항', count: db.notices.length, href: '/admin/notice', color: 'var(--accent-emerald)' },
  ]

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold text-white mb-1">관리자 대시보드</h1>
      <p className="text-xs mb-8" style={{ color: 'var(--muted)' }}>데이터 업로드 및 관리</p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map(s => (
          <Link key={s.href} href={s.href}>
            <div
              className="rounded-xl border p-5 hover:border-zinc-600 transition-colors cursor-pointer"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <p className="text-xs font-medium mb-2" style={{ color: 'var(--muted)' }}>{s.label}</p>
              <p className="text-3xl font-bold" style={{ color: s.color }}>{s.count}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>/ 최대 50개 보관</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <QuickLink href="/admin/upload-csv" title="CSV 업로드" desc="자산군 상승 확률 데이터 업로드" icon="📊" />
        <QuickLink href="/admin/weekly-shift" title="주간 궤적 업로드" desc="DTW 롤링 시프트 이미지 업로드" icon="📈" />
        <QuickLink href="/admin/notice" title="공지사항 업로드" desc="PDF 공지사항 및 설명 업로드" icon="📄" />
        <QuickLink href="/" title="사용자 화면 보기" desc="메인 대시보드 미리보기" icon="👁️" />
      </div>
    </div>
  )
}

function QuickLink({ href, title, desc, icon }: { href: string; title: string; desc: string; icon: string }) {
  return (
    <Link href={href}>
      <div
        className="rounded-xl border p-4 hover:border-zinc-600 transition-colors cursor-pointer flex items-center gap-4"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{desc}</p>
        </div>
      </div>
    </Link>
  )
}
