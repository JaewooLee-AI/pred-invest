'use client'

import { useRef, useState } from 'react'
import { uploadClosingPriceAction } from '@/app/actions/closing-price'
import { DTW_ASSET_NAMES } from '@/lib/csv-parser'

export default function ClosingPricePage() {
  const [isPending, setIsPending] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    if (!formRef.current) return
    setMessage(null)
    setIsPending(true)
    try {
      const formData = new FormData(formRef.current)
      const result = await uploadClosingPriceAction(formData)
      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: `종가 데이터 저장 완료 — ${result.count}일치 데이터가 병합되었습니다.` })
        formRef.current.reset()
      }
    } catch (err) {
      setMessage({ type: 'error', text: `업로드 실패: ${err instanceof Error ? err.message : String(err)}` })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-xl font-bold text-zinc-900 mb-1">종가 데이터 업로드</h1>
      <p className="text-xs mb-1 text-zinc-500">
        자산별 날짜별 종가(Close) CSV를 업로드합니다. 기존 데이터와 날짜별로 병합됩니다.
      </p>
      <p className="text-xs mb-6 text-zinc-400">
        필수 컬럼: <span className="font-mono">Date</span> +{' '}
        {DTW_ASSET_NAMES.map(a => `${a}_Close`).join(', ')}
        {' '}(없는 컬럼은 무시)
      </p>

      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="rounded-xl border border-zinc-200 p-5 bg-white">
          <p className="text-xs font-medium mb-2 text-zinc-500">CSV 파일 선택</p>
          <input
            name="csv"
            type="file"
            accept=".csv,text/csv"
            required
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 p-1.5 text-xs text-zinc-700 cursor-pointer
              file:mr-2 file:rounded file:border-0 file:bg-violet-100 file:px-2.5 file:py-1 file:text-xs file:font-medium file:text-violet-700 file:cursor-pointer hover:file:bg-violet-200"
          />
          <p className="text-[10px] text-zinc-400 mt-2">
            예: closing_prices.csv — 컬럼 형식: Date, SP500_Close, NASDAQ_Close, ...
          </p>
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
          className="self-start px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50 bg-violet-600 hover:bg-violet-700"
        >
          {isPending ? '업로드 중...' : '종가 데이터 저장'}
        </button>
      </form>
    </div>
  )
}
