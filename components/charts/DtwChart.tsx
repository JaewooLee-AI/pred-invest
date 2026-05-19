'use client'

import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import type { DtwDataPoint } from '@/lib/csv-parser'

export interface DtwDataset {
  label: string
  data: DtwDataPoint[]
}

interface DtwChartProps {
  datasets: DtwDataset[]
  assetName?: string
  height?: number
  closingPrices?: Record<string, number>  // { date: close }
}

// DTW 날짜(주간) + 종가 일간 날짜를 합산한 차트 포인트
interface ChartPoint {
  date: string
  ensembleMaster?: number
  ensembleRank1?: number
  currentLevel?: number
  actualClose?: number
}

// 현재 데이터에 없는 날짜만 이전 데이터에서 가져와 하나의 연속 배열로 합산
function buildMergedData(datasets: DtwDataset[], prevCount: number): DtwDataPoint[] {
  const current = datasets[0]?.data ?? []
  const currentDates = new Set(current.map(d => d.date))

  const sortedCurrent = [...current].sort((a, b) => a.date.localeCompare(b.date))
  const latestCurrentLevel = sortedCurrent[sortedCurrent.length - 1]?.currentLevel ?? 0

  const seenDates = new Set(currentDates)
  const extra: DtwDataPoint[] = []
  for (const ds of datasets.slice(1, prevCount + 1)) {
    for (const p of ds.data) {
      if (!seenDates.has(p.date)) {
        seenDates.add(p.date)
        extra.push({ ...p, currentLevel: latestCurrentLevel })
      }
    }
  }

  return [...extra, ...current].sort((a, b) => a.date.localeCompare(b.date))
}

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}) => {
  if (!active || !payload?.length) return null
  const visible = payload.filter(p => p.value !== undefined && p.value !== 0)
  if (!visible.length) return null
  return (
      <div
        className="rounded-[12px] p-3 text-[13px] bg-white"
        style={{
          border: '1px solid rgba(0,0,0,0.05)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        }}
      >
      <p className="font-semibold mb-2 text-[#86868b]">{label}</p>
      {visible.map(p => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ background: p.color }} />
          <span className="text-[#86868b]">{p.name}</span>
          <span className="font-mono font-semibold ml-auto" style={{ color: p.color }}>
            {p.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </span>
        </div>
      ))}
    </div>
  )
}

export function DtwChart({ datasets, height = 200, closingPrices }: DtwChartProps) {
  const [prevCount, setPrevCount] = useState(0)
  const [showClose, setShowClose] = useState(true)

  const current = datasets[0]?.data ?? []
  const availablePrev = datasets.slice(1).filter(ds => ds.data.length > 0)
  const hasCloseData = !!closingPrices && Object.keys(closingPrices).length > 0

  if (current.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-xs" style={{ color: 'var(--text-muted)' }}>
        데이터 없음
      </div>
    )
  }

  const baseData = buildMergedData(datasets, prevCount)

  // 종가 데이터가 있으면 전체 범위를 영업일(월~금)로 채워 X축 간격을 균일하게 만듦
  const data: ChartPoint[] = (() => {
    const sorted = [...baseData].sort((a, b) => a.date.localeCompare(b.date))
    const minDate = sorted[0]?.date ?? ''
    const maxDate = sorted[sorted.length - 1]?.date ?? ''
    const map: Record<string, ChartPoint> = {}

    if (hasCloseData && minDate && maxDate) {
      // 전체 영업일 삽입 (종가 유무와 관계없이 — X축 균일화)
      const cur = new Date(minDate + 'T00:00:00Z')
      const end = new Date(maxDate + 'T00:00:00Z')
      while (cur <= end) {
        const dow = cur.getUTCDay()
        if (dow !== 0 && dow !== 6) {
          const ds = cur.toISOString().split('T')[0]
          map[ds] = { date: ds, actualClose: closingPrices![ds] }
        }
        cur.setUTCDate(cur.getUTCDate() + 1)
      }
    }

    // DTW 주간 데이터 덮어쓰기
    for (const d of baseData) {
      map[d.date] = {
        ...map[d.date],
        date: d.date,
        ensembleMaster: d.ensembleMaster || undefined,
        ensembleRank1: d.ensembleRank1 || undefined,
        currentLevel: d.currentLevel || undefined,
      }
    }

    return Object.values(map).sort((a, b) => a.date.localeCompare(b.date))
  })()

  const allValues = data.flatMap(d => [
    d.ensembleMaster, d.ensembleRank1, d.currentLevel,
    (showClose && d.actualClose !== undefined) ? d.actualClose : undefined,
  ]).filter((v): v is number => v !== undefined && v !== 0)
  const minVal = Math.min(...allValues)
  const maxVal = Math.max(...allValues)
  const padding = (maxVal - minVal) * 0.1 || Math.abs(maxVal) * 0.05
  const yDomain: [number, number] = [minVal - padding, maxVal + padding]

  const formatDate = (d: string) => {
    const parts = d.split('-')
    return parts.length >= 3 ? `${parts[1]}/${parts[2]}` : d
  }

  return (
    <div>
      {(availablePrev.length > 0 || hasCloseData) && (
        <div className="flex items-center gap-3 mb-2">
          {availablePrev.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>이전 포함</span>
              <select
                value={prevCount}
                onChange={e => setPrevCount(Number(e.target.value))}
                className="text-[9px] font-mono rounded border px-1.5 py-0.5 outline-none cursor-pointer"
                style={{
                  borderColor: 'var(--purple-border)',
                  background: 'var(--purple-tint)',
                  color: 'var(--purple)',
                }}
              >
                <option value={0}>없음</option>
                {availablePrev.map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}주 전</option>
                ))}
              </select>
            </div>
          )}
          {hasCloseData && (
            <button
              onClick={() => setShowClose(v => !v)}
              className="flex items-center gap-1 text-[9px] font-mono rounded border px-1.5 py-0.5 transition-colors"
              style={{
                borderColor: showClose ? 'rgba(52,199,89,0.35)' : 'var(--border)',
                background: showClose ? 'rgba(52,199,89,0.08)' : 'transparent',
                color: showClose ? '#34c759' : 'var(--text-muted)',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: showClose ? '#34c759' : 'var(--text-muted)' }}
              />
              종가
            </button>
          )}
        </div>
      )}

      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 9, fill: 'var(--text-muted)' }}
            tickLine={false}
            axisLine={{ stroke: 'rgba(0,0,0,0.08)' }}
            interval="preserveStartEnd"
            tickFormatter={formatDate}
          />
          <YAxis
            domain={yDomain}
            tick={{ fontSize: 9, fill: 'var(--text-muted)' }}
            tickLine={false}
            axisLine={false}
            width={55}
            tickFormatter={v => v.toLocaleString()}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '10px', color: 'var(--text-muted)' }} iconType="circle" iconSize={6} />
          <Line type="monotone" dataKey="ensembleMaster"
            name="Ensemble Master" stroke="#0071e3" strokeWidth={2.5}
            dot={false} activeDot={{ r: 4, strokeWidth: 0, fill: '#0071e3' }} connectNulls />
          <Line type="monotone" dataKey="ensembleRank1"
            name="Rank 1" stroke="#ff9500" strokeWidth={2} strokeDasharray="5 4"
            dot={false} activeDot={{ r: 4, strokeWidth: 0, fill: '#ff9500' }} connectNulls />
          <Line type="monotone" dataKey="currentLevel"
            name="Current Level" stroke="#8e8e93" strokeWidth={2}
            dot={false} activeDot={{ r: 3, strokeWidth: 0, fill: '#8e8e93' }} connectNulls />
          {hasCloseData && showClose && (
            <Line type="monotone" dataKey="actualClose"
              name="실제 종가" stroke="#34c759" strokeWidth={2} strokeDasharray="3 3"
              dot={false} activeDot={{ r: 4, strokeWidth: 0, fill: '#34c759' }} connectNulls />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
