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
}

// 현재 데이터에 없는 날짜만 이전 데이터에서 가져와 하나의 연속 배열로 합산
function buildMergedData(datasets: DtwDataset[], prevCount: number): DtwDataPoint[] {
  const current = datasets[0]?.data ?? []
  const currentDates = new Set(current.map(d => d.date))

  const extra: DtwDataPoint[] = []
  for (const ds of datasets.slice(1, prevCount + 1)) {
    for (const p of ds.data) {
      if (!currentDates.has(p.date)) {
        extra.push(p)
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
      className="rounded-xl p-3 text-xs shadow-xl"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        boxShadow: '0 8px 24px rgba(79,70,229,0.10)',
      }}
    >
      <p className="font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>{label}</p>
      {visible.map(p => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ background: p.color }} />
          <span style={{ color: 'var(--text-secondary)' }}>{p.name}</span>
          <span className="font-mono font-semibold ml-auto" style={{ color: p.color }}>
            {p.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </span>
        </div>
      ))}
    </div>
  )
}

export function DtwChart({ datasets }: DtwChartProps) {
  const [prevCount, setPrevCount] = useState(0)

  const current = datasets[0]?.data ?? []
  const availablePrev = datasets.slice(1).filter(ds => ds.data.length > 0)

  if (current.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-xs" style={{ color: 'var(--text-muted)' }}>
        데이터 없음
      </div>
    )
  }

  const data = buildMergedData(datasets, prevCount)

  const allValues = data.flatMap(d => [d.ensembleMaster, d.ensembleRank1, d.currentLevel])
    .filter(v => v !== 0 && v !== undefined)
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
      {availablePrev.length > 0 && (
        <div className="flex items-center gap-1.5 mb-2">
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

      <ResponsiveContainer width="100%" height={200}>
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
            name="Ensemble Master" stroke="#a78bfa" strokeWidth={2}
            dot={false} activeDot={{ r: 3 }} />
          <Line type="monotone" dataKey="ensembleRank1"
            name="Rank 1" stroke="#fbbf24" strokeWidth={1.5} strokeDasharray="5 3"
            dot={false} activeDot={{ r: 3 }} />
          <Line type="monotone" dataKey="currentLevel"
            name="Current Level" stroke="#94a3b8" strokeWidth={2}
            dot={false} activeDot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
