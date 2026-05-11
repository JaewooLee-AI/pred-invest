import { Navbar } from '@/components/Navbar'
import { getAllNotices } from '@/lib/db'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function NoticesPage() {
  const notices = await getAllNotices()

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-8 py-8 sm:py-12">

        <div className="flex items-start justify-between mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full tracking-wide"
                style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d' }}
              >
                Reports
              </span>
              <span className="text-xs font-mono text-zinc-400">{notices.length}건</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight">
              공지사항
            </h1>
            <p className="text-base text-zinc-500 mt-2">분석 리포트 및 시황 공지</p>
          </div>
        </div>

        {notices.length === 0 ? (
          <div className="rounded-xl py-20 flex flex-col items-center justify-center text-center border border-dashed border-zinc-200 bg-zinc-50">
            <p className="text-sm text-zinc-400 mb-2">등록된 공지사항이 없습니다.</p>
            <Link href="/admin/notice" className="text-xs text-green-600 hover:text-green-700 transition-colors">
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
                className="group rounded-xl p-5 border border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm transition-all block"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg"
                    style={{ background: '#f0fdf4' }}
                  >
                    📄
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-zinc-900 group-hover:text-green-700 transition-colors truncate">
                        {n.filename}
                      </p>
                      <span className="text-xs font-mono text-zinc-400 shrink-0">
                        {new Date(n.uploadedAt).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                    <p className="text-sm mt-1.5 leading-relaxed text-zinc-500">
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
