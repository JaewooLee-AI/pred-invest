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

interface UnifiedPoint {
  date: string
  ensembleMaster?: number
  ensembleRank1?: number
  currentLevel?: number
  prevMaster?: number
  prevRank1?: number
}

function buildUnifiedData(current: DtwDataPoint[], prevDatasets: DtwDataset[]): UnifiedPoint[] {
  // 이전 데이터 전체를 포함 (날짜 겹침 여부 무관) — 겹치는 구간에서 두 예측선 동시 표시
  // 여러 이전 데이터셋은 최신 이전 우선으로 병합
  const prevMap = new Map<string, { master: number; rank1: number }>()
  for (const ds of [...prevDatasets].reverse()) {
    for (const p of ds.data) {
      prevMap.set(p.date, { master: p.ensembleMaster, rank1: p.ensembleRank1 })
    }
  }

  const currMap = new Map(current.map(d => [d.date, d]))
  const allDates = Array.from(new Set([...prevMap.keys(), ...currMap.keys()])).sort()

  return allDates.map(date => {
    const c = currMap.get(date)
    const p = prevMap.get(date)
    return {
      date,
      ensembleMaster: c?.ensembleMaster,
      ensembleRank1: c?.ensembleRank1,
      currentLevel: c?.currentLevel,
      prevMaster: p?.master,
      prevRank1: p?.rank1,
    }
  })
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
  const availablePrev = datasets.slice(1)

  if (current.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-xs" style={{ color: 'var(--text-muted)' }}>
        데이터 없음
      </div>
    )
  }

  const prevDatasets = availablePrev.slice(0, prevCount)
  const merged = buildUnifiedData(current, prevDatasets)
  const hasPrev = prevCount > 0 && prevDatasets.some(ds => ds.data.length > 0)

  const allValues = merged.flatMap(p => [
    p.ensembleMaster, p.ensembleRank1, p.currentLevel, p.prevMaster, p.prevRank1,
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
      {/* 이전 기간 포함 토글 */}
      {availablePrev.length > 0 && (
        <div className="flex items-center gap-1 mb-2">
          <span className="text-[9px] mr-1" style={{ color: 'var(--text-muted)' }}>이전 포함</span>
          {[0, ...availablePrev.map((_, i) => i + 1)].map(n => (
            <button
              key={n}
              onClick={() => setPrevCount(n)}
              className="text-[9px] px-1.5 py-0.5 rounded transition-all"
              style={prevCount === n ? {
                background: n === 0 ? 'rgba(99,102,241,0.15)' : 'rgba(239,68,68,0.15)',
                color: n === 0 ? 'var(--purple)' : '#ef4444',
                border: `1px solid ${n === 0 ? 'var(--purple-border)' : 'rgba(239,68,68,0.3)'}`,
              } : {
                background: 'transparent',
                color: 'var(--text-muted)',
                border: '1px solid transparent',
              }}
            >
              {n === 0 ? '없음' : `${n}주 전`}
            </button>
          ))}
        </div>
      )}

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={merged} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
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

          {/* 이전 기간 — 적색 (현재에 없는 날짜만) */}
          {hasPrev && (
            <Line type="monotone" dataKey="prevMaster"
              name="Prev Master" stroke="#ef4444" strokeWidth={1.5}
              dot={false} activeDot={{ r: 2 }} connectNulls legendType="circle" />
          )}
          {hasPrev && (
            <Line type="monotone" dataKey="prevRank1"
              name="Prev Rank 1" stroke="#ef4444" strokeWidth={1}
              strokeDasharray="5 3"
              dot={false} activeDot={{ r: 2 }} connectNulls legendType="circle" />
          )}

          {/* 현재 기간 — 기본 색상 */}
          <Line type="monotone" dataKey="ensembleMaster"
            name="Ensemble Master" stroke="#a78bfa" strokeWidth={2}
            dot={false} activeDot={{ r: 3 }} connectNulls legendType="circle" />
          <Line type="monotone" dataKey="ensembleRank1"
            name="Rank 1" stroke="#fbbf24" strokeWidth={1.5} strokeDasharray="5 3"
            dot={false} activeDot={{ r: 3 }} connectNulls legendType="circle" />
          <Line type="monotone" dataKey="currentLevel"
            name="Current Level" stroke="#94a3b8" strokeWidth={2}
            dot={false} activeDot={{ r: 3 }} connectNulls legendType="circle" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
