import { Navbar } from '@/components/Navbar'
import { getAllNotices } from '@/lib/db'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function NoticesPage() {
  const notices = await getAllNotices()

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-white">공지사항</h1>
            <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
              분석 리포트 및 시황 공지
            </p>
          </div>
          <span className="text-xs font-mono px-2 py-1 rounded border"
                style={{ color: 'var(--muted)', borderColor: 'var(--border)', background: 'var(--card)' }}>
            {notices.length}건
          </span>
        </div>

        {notices.length === 0 ? (
          <div className="rounded-xl border flex flex-col items-center justify-center py-24 text-center"
               style={{ borderColor: 'var(--border)', background: 'var(--card)', borderStyle: 'dashed' }}>
            <p className="text-sm mb-1" style={{ color: 'var(--muted)' }}>등록된 공지사항이 없습니다.</p>
            <Link href="/admin/notice" className="text-xs underline underline-offset-2 mt-2"
                  style={{ color: 'var(--accent-emerald)' }}>
              관리자 페이지에서 업로드하세요 →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {notices.map(n => (
              <a
                key={n.id}
                href={n.filePath}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border p-5 hover:border-emerald-500/40 transition-all hover:translate-y-[-1px] block"
                style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-lg"
                    style={{ background: 'rgba(16,185,129,0.1)' }}
                  >
                    📄
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-white truncate">{n.filename}</p>
                      <span className="text-xs font-mono shrink-0" style={{ color: '#52525b' }}>
                        {new Date(n.uploadedAt).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                    <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--muted)' }}>
                      {n.description}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
