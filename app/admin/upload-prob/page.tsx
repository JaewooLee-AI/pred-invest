'use client'

import { useState } from 'react'
import { uploadProbAction } from '@/app/actions/prob-upload'
import { PROB_ASSET_NAMES } from '@/lib/prob-index-parser'

export default function UploadProbPage() {
  const [isPending, setIsPending] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage(null)
    setIsPending(true)
    try {
      const formData = new FormData(e.currentTarget)
      const result = await uploadProbAction(formData)
      if (result.error) setMessage({ type: 'error', text: result.error })
      else setMessage({ type: 'success', text: '확률/지수 CSV 데이터가 성공적으로 업로드되었습니다.' })
    } catch (err) {
      setMessage({ type: 'error', text: `업로드 실패: ${err instanceof Error ? err.message : String(err)}` })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-xl font-bold text-zinc-900 mb-1">확률 & 예상 지수 CSV 업로드</h1>
      <p className="text-xs mb-6 text-zinc-500">
        컬럼 형식: <code className="font-mono bg-zinc-100 px-1 rounded">Date, 자산_Prob, 자산_Index</code> — 9개 자산군 (S&P500, NASDAQ, KOSPI, GOLD, DXY, USDKRW, USDJPY, 10YUSB, WTI)
      </p>

      <div className="rounded-xl border p-4 mb-5 text-xs" style={{ background: '#fffbeb', borderColor: '#fde68a' }}>
        <p className="font-semibold text-amber-700 mb-2">예시 컬럼명</p>
        <p className="font-mono text-amber-600 leading-relaxed break-all">
          Date, S&P500_Prob, S&P500_Index, NASDAQ_Prob, NASDAQ_Index, KOSPI_Prob, KOSPI_Index, GOLD_Prob, GOLD_Index, DXY_Prob, DXY_Index, USDKRW_Prob, USDKRW_Index, USDJPY_Prob, USDJPY_Index, 10YUSB_Prob, 10YUSB_Index, WTI_Prob, WTI_Index
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {PROB_ASSET_NAMES.map(a => (
            <span key={a} className="px-2 py-0.5 rounded font-mono text-[10px] bg-amber-100 text-amber-700">{a}</span>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="rounded-xl border border-zinc-200 p-5 bg-white">
          <h2 className="text-sm font-semibold text-zinc-900 mb-4">업로드 정보</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium mb-1.5 text-zinc-500">CSV 파일 *</p>
              <input
                name="probFile"
                type="file"
                accept=".csv"
                required
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 p-1.5 text-xs text-zinc-700 cursor-pointer
                  file:mr-2 file:rounded file:border-0 file:bg-blue-100 file:px-2.5 file:py-1 file:text-xs file:font-medium file:text-blue-700 file:cursor-pointer hover:file:bg-blue-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5 text-zinc-500">기준일 *</label>
              <input
                name="referenceDate"
                type="date"
                required
                className="w-full rounded-lg border px-3 py-2 text-sm text-zinc-900 outline-none focus:border-blue-500 transition-colors"
                style={{ background: '#f9fafb', borderColor: '#e4e4e7' }}
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
          className="self-start px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50 bg-blue-600 hover:bg-blue-700"
        >
          {isPending ? '업로드 중...' : '업로드 완료'}
        </button>
      </form>
    </div>
  )
}
