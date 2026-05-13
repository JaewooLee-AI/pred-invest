'use client'

import { useRef, useState } from 'react'
import { uploadWeeklyShiftAction } from '@/app/actions/weekly-shift'
import { DTW_ASSET_NAMES } from '@/lib/csv-parser'

function AssetCsvSlot({ asset }: { asset: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 p-4 flex gap-4 items-start bg-white">
      <div className="w-52 shrink-0">
        <p className="text-xs font-semibold mb-2 text-violet-600">{asset}</p>
        <input
          name={`csv_${asset}`}
          type="file"
          accept=".csv,text/csv"
          className="w-full rounded-lg border border-zinc-200 bg-zinc-50 p-1.5 text-xs text-zinc-700 cursor-pointer
            file:mr-2 file:rounded file:border-0 file:bg-violet-100 file:px-2.5 file:py-1 file:text-xs file:font-medium file:text-violet-700 file:cursor-pointer hover:file:bg-violet-200"
        />
        <p className="text-[10px] text-zinc-400 mt-1">
          예: {asset}_DTW_Projection_12W.csv
        </p>
      </div>
      <div className="flex-1">
        <p className="text-xs font-medium mb-1.5 text-zinc-500">변곡점 설명</p>
        <textarea
          name={`desc_${asset}`}
          rows={3}
          placeholder={`${asset} 궤적 분석 및 변곡점 의미...`}
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-xs text-zinc-900 outline-none focus:border-violet-400 transition-colors resize-none bg-zinc-50"
        />
      </div>
    </div>
  )
}

export default function WeeklyShiftPage() {
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
      const result = await uploadWeeklyShiftAction(formData)
      if (result.error) setMessage({ type: 'error', text: result.error })
      else {
        setMessage({ type: 'success', text: '주간 DTW 궤적이 성공적으로 업로드되었습니다.' })
        formRef.current.reset()
      }
    } catch (err) {
      setMessage({ type: 'error', text: `업로드 실패: ${err instanceof Error ? err.message : String(err)}` })
    } finally {
      setIsPending(false)
    }
  }

  const today = new Date().toISOString().slice(0, 10)

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-xl font-bold text-zinc-900 mb-1">주간 DTW 궤적 업로드</h1>
      <p className="text-xs mb-6 text-zinc-500">
        10개 자산군의 DTW Projection CSV 파일을 업로드합니다.
        컬럼 형식: Date, {'{ASSET}'}_Ensemble_Master, {'{ASSET}'}_Ensemble_Rank_1, {'{ASSET}'}_Current_Level
      </p>

      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="rounded-xl border border-zinc-200 p-5 bg-white">
          <p className="text-xs font-medium mb-1 text-zinc-500">DTW 기준일</p>
          <p className="text-xs mb-2 text-zinc-400">예: 2026-05-08, 5월 둘째 주, 2026 W19 등 자유 형식</p>
          <input
            name="label"
            type="text"
            defaultValue={today}
            placeholder="DTW 기준일을 입력하세요"
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-violet-400 transition-colors w-full sm:w-auto bg-zinc-50"
            style={{ minWidth: '240px' }}
          />
        </div>

        <div className="rounded-xl border border-zinc-200 p-5 bg-white">
          <h2 className="text-sm font-semibold text-zinc-900 mb-1">자산별 CSV & 설명</h2>
          <p className="text-xs text-zinc-400 mb-4">CSV 파일을 업로드하지 않은 자산은 해당 회차에서 빈 차트로 표시됩니다.</p>
          <div className="grid grid-cols-1 gap-4">
            {DTW_ASSET_NAMES.map(asset => (
              <AssetCsvSlot key={asset} asset={asset} />
            ))}
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
          className="self-start px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50 bg-violet-600 hover:bg-violet-700"
        >
          {isPending ? '업로드 중...' : '주간 궤적 저장'}
        </button>
      </form>
    </div>
  )
}
