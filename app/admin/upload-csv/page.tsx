'use client'

import { useRef, useState, useTransition } from 'react'
import { uploadCsvAction } from '@/app/actions/csv-upload'
import { ASSET_NAMES } from '@/lib/csv-parser'

export default function UploadCsvPage() {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(formData: FormData) {
    setMessage(null)
    startTransition(async () => {
      const result = await uploadCsvAction(formData)
      if (result.error) setMessage({ type: 'error', text: result.error })
      else setMessage({ type: 'success', text: 'CSV 데이터가 성공적으로 업로드되었습니다.' })
    })
  }

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-xl font-bold text-white mb-1">CSV 데이터 업로드</h1>
      <p className="text-xs mb-6" style={{ color: 'var(--muted)' }}>
        0424_class_total.csv 형식의 파일과 기준일, 자산별 코멘트를 업로드합니다.
      </p>

      <form action={handleSubmit} className="flex flex-col gap-5">
        <div
          className="rounded-xl border p-5"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <h2 className="text-sm font-semibold text-white mb-4">기본 정보</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>CSV 파일 *</p>
              {/* 숨겨진 실제 file input */}
              <input
                ref={fileRef}
                name="csvFile"
                type="file"
                accept=".csv"
                required
                onChange={e => setFileName(e.target.files?.[0]?.name ?? null)}
                className="hidden"
              />
              {/* 클릭 가능한 커스텀 버튼 */}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full rounded-lg border px-3 py-2 text-xs text-left transition-colors hover:border-blue-500"
                style={{ background: '#0e0e11', borderColor: 'var(--border)', color: fileName ? 'var(--text)' : 'var(--muted)' }}
              >
                {fileName ? `✓ ${fileName}` : '파일 선택 (클릭)'}
              </button>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>
                기준일 *
              </label>
              <input
                name="referenceDate"
                type="date"
                required
                className="w-full rounded-lg border px-3 py-2 text-sm text-white outline-none focus:border-blue-500 transition-colors"
                style={{ background: '#0e0e11', borderColor: 'var(--border)' }}
              />
            </div>
          </div>
        </div>

        <div
          className="rounded-xl border p-5"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <h2 className="text-sm font-semibold text-white mb-4">자산별 코멘트 (9개 자산군)</h2>
          <div className="grid grid-cols-1 gap-3">
            {ASSET_NAMES.map(asset => (
              <div key={asset}>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--accent-blue)' }}>
                  {asset}
                </label>
                <textarea
                  name={`comment_${asset}`}
                  rows={2}
                  placeholder={`${asset} 시장 분석 코멘트를 입력하세요...`}
                  className="w-full rounded-lg border px-3 py-2 text-xs text-white outline-none focus:border-blue-500 transition-colors resize-none"
                  style={{ background: '#0e0e11', borderColor: 'var(--border)', color: 'var(--text)' }}
                />
              </div>
            ))}
          </div>
        </div>

        {message && (
          <div
            className={`rounded-lg px-4 py-3 text-sm ${message.type === 'success' ? 'text-emerald-400 bg-emerald-900/20 border border-emerald-800' : 'text-red-400 bg-red-900/20 border border-red-800'}`}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="self-start px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50"
          style={{ background: 'var(--accent-blue)' }}
        >
          {isPending ? '업로드 중...' : '업로드 완료'}
        </button>
      </form>
    </div>
  )
}
