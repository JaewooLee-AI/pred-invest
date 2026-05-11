'use client'

import { useRef, useState, useTransition } from 'react'
import { uploadNoticeAction } from '@/app/actions/notice'

export default function NoticePage() {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(formData: FormData) {
    setMessage(null)
    startTransition(async () => {
      const result = await uploadNoticeAction(formData)
      if (result?.error) setMessage({ type: 'error', text: result.error })
      else setMessage({ type: 'success', text: '공지사항이 성공적으로 업로드되었습니다.' })
    })
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-xl font-bold text-white mb-1">공지사항 업로드</h1>
      <p className="text-xs mb-6" style={{ color: 'var(--muted)' }}>
        PDF 문서를 업로드합니다. 설명을 비워두면 자동으로 내용을 추출합니다.
      </p>

      <div className="rounded-lg border p-4 mb-6 text-xs"
           style={{ borderColor: '#3b4a3b', background: '#0f1a0f', color: '#6db36d' }}>
        <strong>자동 추출 안내:</strong> 설명 입력 없이 PDF만 업로드하면 시스템이 문서 내 무작위
        문장 2~3개를 자동 추출합니다. 스캔본 PDF는 추출 실패 시 수동 입력이 요청됩니다.
      </div>

      <form action={handleSubmit} className="flex flex-col gap-5">
        <div className="rounded-xl border p-5" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>PDF 파일 *</p>
              <input
                ref={fileRef}
                name="pdfFile"
                type="file"
                accept=".pdf"
                required
                onChange={e => setFileName(e.target.files?.[0]?.name ?? null)}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full rounded-lg border px-3 py-2 text-xs text-left transition-colors hover:border-emerald-500"
                style={{ background: '#0e0e11', borderColor: 'var(--border)', color: fileName ? 'var(--text)' : 'var(--muted)' }}
              >
                {fileName ? `✓ ${fileName}` : 'PDF 파일 선택 (클릭)'}
              </button>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>
                설명 (선택 — 비워두면 자동 추출)
              </label>
              <textarea
                name="description"
                rows={4}
                placeholder="공지사항 설명을 직접 입력하거나 비워두면 자동 추출됩니다..."
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-emerald-500 transition-colors resize-none"
                style={{ background: '#0e0e11', borderColor: 'var(--border)', color: 'var(--text)' }}
              />
            </div>
          </div>
        </div>

        {message && (
          <div className={`rounded-lg px-4 py-3 text-sm ${message.type === 'success' ? 'text-emerald-400 bg-emerald-900/20 border border-emerald-800' : 'text-red-400 bg-red-900/20 border border-red-800'}`}>
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="self-start px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50"
          style={{ background: 'var(--accent-emerald)' }}
        >
          {isPending ? '업로드 중...' : '공지사항 저장'}
        </button>
      </form>
    </div>
  )
}
