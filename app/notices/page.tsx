import { Navbar } from '@/components/Navbar'
import { getAllNotices } from '@/lib/db'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function NoticesPage() {
  const notices = await getAllNotices()

  return (
    <div className="min-h-screen" style={{ background: '#000' }}>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-8 py-8 sm:py-10">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{
                background: 'linear-gradient(180deg, #ffffff 30%, rgba(255,255,255,0.55) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              공지사항
            </h1>
            <p className="text-xs mt-1.5" style={{ color: '#86868b' }}>분석 리포트 및 시황 공지</p>
          </div>
          <span
            className="text-xs font-mono px-2.5 py-1 rounded-full"
            style={{
              background: 'rgba(48,209,88,0.1)',
              border: '1px solid rgba(48,209,88,0.2)',
              color: '#30d158',
            }}
          >
            {notices.length}건
          </span>
        </div>

        {notices.length === 0 ? (
          <div
            className="rounded-2xl flex flex-col items-center justify-center py-24 text-center"
            style={{ border: '1px dashed rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}
          >
            <p className="text-sm mb-1.5" style={{ color: '#86868b' }}>등록된 공지사항이 없습니다.</p>
            <Link href="/admin/notice" className="text-xs transition-all hover:opacity-80" style={{ color: '#30d158' }}>
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
                className="rounded-2xl p-5 transition-all hover:opacity-80 block"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg"
                    style={{ background: 'rgba(48,209,88,0.1)' }}
                  >
                    📄
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold truncate" style={{ color: '#f5f5f7' }}>{n.filename}</p>
                      <span className="text-xs font-mono shrink-0" style={{ color: '#3a3a3c' }}>
                        {new Date(n.uploadedAt).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                    <p className="text-xs mt-2 leading-relaxed" style={{ color: '#86868b' }}>
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
