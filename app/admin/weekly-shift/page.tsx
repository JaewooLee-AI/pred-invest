'use client'

import { useRef, useState, useTransition } from 'react'
import { uploadWeeklyShiftAction } from '@/app/actions/weekly-shift'
import { ASSET_NAMES } from '@/lib/csv-parser'

function AssetImageSlot({ asset }: { asset: string }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  return (
    <div className="rounded-lg border p-4 flex gap-4 items-start"
         style={{ borderColor: 'var(--border)', background: '#111113' }}>
      <div className="w-40 shrink-0">
        <p className="text-xs font-semibold mb-2" style={{ color: 'var(--accent-purple)' }}>{asset}</p>
        {/* 숨겨진 실제 file input */}
        <input
          ref={fileRef}
          name={`image_${asset}`}
          type="file"
          accept="image/*"
          onChange={e => setFileName(e.target.files?.[0]?.name ?? null)}
          className="hidden"
        />
        {/* 클릭 가능한 커스텀 버튼 */}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex flex-col items-center justify-center w-full h-20 rounded-lg border-2 border-dashed transition-colors hover:border-purple-500/70 text-xs"
          style={{
            borderColor: fileName ? '#a855f7' : 'var(--border)',
            color: fileName ? '#a855f7' : 'var(--muted)',
            background: 'transparent',
          }}
        >
          {fileName ? (
            <>
              <span className="text-base mb-1">✓</span>
              <span className="truncate max-w-[120px] text-center">{fileName}</span>
            </>
          ) : (
            <>
              <span className="text-base mb-1">+</span>
              <span>이미지 선택</span>
            </>
          )}
        </button>
      </div>
      <div className="flex-1">
        <p className="text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>변곡점 설명</p>
        <textarea
          name={`desc_${asset}`}
          rows={3}
          placeholder={`${asset} 궤적 분석 및 변곡점 의미...`}
          className="w-full rounded-lg border px-3 py-2 text-xs outline-none focus:border-purple-500 transition-colors resize-none"
          style={{ background: '#0e0e11', borderColor: 'var(--border)', color: 'var(--text)' }}
        />
      </div>
    </div>
  )
}

export default function WeeklyShiftPage() {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  async function handleSubmit(formData: FormData) {
    setMessage(null)
    startTransition(async () => {
      const result = await uploadWeeklyShiftAction(formData)
      if (result.error) setMessage({ type: 'error', text: result.error })
      else setMessage({ type: 'success', text: '주간 궤적이 성공적으로 업로드되었습니다.' })
    })
  }

  const today = new Date().toISOString().slice(0, 10)

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-xl font-bold text-white mb-1">주간 DTW 궤적 업로드</h1>
      <p className="text-xs mb-6" style={{ color: 'var(--muted)' }}>
        9개 자산군의 DTW 롤링 시프트 차트 이미지와 변곡점 설명을 업로드합니다.
      </p>

      <form action={handleSubmit} className="flex flex-col gap-5">
        <div className="rounded-xl border p-5" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <p className="text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>주차 레이블</p>
          <input
            name="label"
            type="date"
            defaultValue={today}
            className="rounded-lg border px-3 py-2 text-sm text-white outline-none focus:border-purple-500 transition-colors"
            style={{ background: '#0e0e11', borderColor: 'var(--border)' }}
          />
        </div>

        <div className="rounded-xl border p-5" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <h2 className="text-sm font-semibold text-white mb-4">자산별 이미지 & 설명</h2>
          <div className="grid grid-cols-1 gap-4">
            {ASSET_NAMES.map(asset => (
              <AssetImageSlot key={asset} asset={asset} />
            ))}
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
          style={{ background: 'var(--accent-purple)' }}
        >
          {isPending ? '업로드 중...' : '주간 궤적 저장'}
        </button>
      </form>
    </div>
  )
}
