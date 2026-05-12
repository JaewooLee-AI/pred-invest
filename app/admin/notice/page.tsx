'use client'

import { useState } from 'react'
import { uploadNoticeAction } from '@/app/actions/notice'

export default function NoticePage() {
  const [isPending, setIsPending] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage(null)
    setIsPending(true)
    try {
      const formData = new FormData(e.currentTarget)
      const result = await uploadNoticeAction(formData)
      if (result?.error) setMessage({ type: 'error', text: result.error })
      else setMessage({ type: 'success', text: '공지사항이 성공적으로 업로드되었습니다.' })
    } catch (err) {
      setMessage({ type: 'error', text: `업로드 실패: ${err instanceof Error ? err.message : String(err)}` })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-xl font-bold text-zinc-900 mb-1">공지사항 업로드</h1>
      <p className="text-xs mb-6 text-zinc-500">
        PDF 문서를 업로드합니다. 설명을 비워두면 자동으로 내용을 추출합니다.
      </p>

      <div className="rounded-lg border border-emerald-200 p-4 mb-6 text-xs bg-emerald-50">
        <strong className="text-emerald-700">자동 추출 안내:</strong>
        <span className="text-emerald-600"> 설명 입력 없이 PDF만 업로드하면 시스템이 문서 내 무작위 문장 2~3개를 자동 추출합니다. 스캔본 PDF는 추출 실패 시 수동 입력이 요청됩니다.</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="rounded-xl border border-zinc-200 p-5 bg-white">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs font-medium mb-1.5 text-zinc-500">PDF 파일 *</p>
              <input
                name="pdfFile"
                type="file"
                accept=".pdf"
                required
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 p-1.5 text-xs text-zinc-700 cursor-pointer
                  file:mr-2 file:rounded file:border-0 file:bg-emerald-100 file:px-2.5 file:py-1 file:text-xs file:font-medium file:text-emerald-700 file:cursor-pointer hover:file:bg-emerald-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5 text-zinc-500">
                설명 (선택 — 비워두면 자동 추출)
              </label>
              <textarea
                name="description"
                rows={4}
                placeholder="공지사항 설명을 직접 입력하거나 비워두면 자동 추출됩니다..."
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-400 transition-colors resize-none bg-zinc-50"
              />
            </div>
          </div>
        </div>

        {message && (
          <div className={`rounded-lg px-4 py-3 text-sm ${
            message.type === 'success'
              ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
              : 'text-red-700 bg-red-50 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="self-start px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50 bg-emerald-600 hover:bg-emerald-700"
        >
          {isPending ? '업로드 중...' : '공지사항 저장'}
        </button>
      </form>
    </div>
  )
}
