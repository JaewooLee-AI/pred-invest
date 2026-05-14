import { Navbar } from '@/components/Navbar'
import { getAllNotices } from '@/lib/db'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function NoticesPage() {
  const notices = await getAllNotices()

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-8 py-10 sm:py-14">

        <div className="flex items-start justify-between mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span
                className="text-[10px] font-semibold px-2.5 py-1 rounded-full tracking-wide"
                style={{ background: 'var(--emerald-tint)', border: '1px solid var(--emerald-border)', color: 'var(--emerald)' }}
              >
                Reports
              </span>
              <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{notices.length}건</span>
            </div>
            <h1
              className="text-3xl sm:text-4xl font-bold tracking-tight"
              style={{
                background: 'linear-gradient(135deg, var(--text) 0%, var(--text-secondary) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              공지사항
            </h1>
            <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>분석 리포트 및 시황 공지</p>
          </div>
        </div>

        {notices.length === 0 ? (
          <div
            className="rounded-2xl py-20 flex flex-col items-center justify-center text-center"
            style={{ border: '1px dashed var(--border)', background: 'var(--card)' }}
          >
            <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>등록된 공지사항이 없습니다.</p>
            <Link href="/admin/notice" className="text-xs transition-colors" style={{ color: 'var(--emerald)' }}>
              관리자 페이지에서 업로드하세요 →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {notices.map(n => (
              <a
                key={n.id}
                href={n.filePath}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl p-5 block card-hover"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'var(--emerald-tint)', border: '1px solid var(--emerald-border)' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="1.5" y="1.5" width="13" height="13" rx="2.5" stroke="var(--emerald)" strokeWidth="1.2" />
                      <path d="M4.5 5.5h7M4.5 8h7M4.5 10.5h5" stroke="var(--emerald)" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>
                        {n.filename}
                      </p>
                      <span className="text-[10px] font-mono shrink-0" style={{ color: 'var(--text-muted)' }}>
                        {new Date(n.uploadedAt).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                    <p className="text-sm mt-1.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
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
