'use client'

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
  assetName: string
}

type MergedPoint = Record<string, number | string | undefined>

function buildMergedData(datasets: DtwDataset[]): MergedPoint[] {
  const allDates = Array.from(
    new Set(datasets.flatMap(ds => ds.data.map(p => p.date)))
  ).sort()

  const maps = datasets.map(ds => new Map(ds.data.map(p => [p.date, p])))

  return allDates.map(date => {
    const point: MergedPoint = { date }
    maps.forEach((m, i) => {
      const p = m.get(date)
      if (i <= 1) {
        // 최신 2개: ensemble + currentLevel 모두
        point[`master_${i}`] = p?.ensembleMaster
        point[`rank1_${i}`] = p?.ensembleRank1
      }
      // 모든 데이터: currentLevel
      point[`level_${i}`] = p?.currentLevel
    })
    return point
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

export function DtwChart({ datasets, assetName }: DtwChartProps) {
  const validDatasets = datasets.filter(ds => ds.data.length > 0)

  if (validDatasets.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-xs" style={{ color: 'var(--text-muted)' }}>
        데이터 없음
      </div>
    )
  }

  const merged = buildMergedData(validDatasets)

  const allValues = merged.flatMap(p =>
    Object.entries(p)
      .filter(([k]) => k !== 'date')
      .map(([, v]) => v as number)
  ).filter(v => v !== undefined && v !== 0)

  const minVal = Math.min(...allValues)
  const maxVal = Math.max(...allValues)
  const padding = (maxVal - minVal) * 0.1 || Math.abs(maxVal) * 0.05
  const yDomain: [number, number] = [minVal - padding, maxVal + padding]

  const formatDate = (d: string) => {
    const parts = d.split('-')
    return parts.length >= 3 ? `${parts[1]}/${parts[2]}` : d
  }

  return (
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

        {validDatasets.map((ds, i) => {
          const label = ds.label
          if (i === 0) {
            // 최신: 기본 색상 실선
            return [
              <Line key={`master_${i}`} type="monotone" dataKey={`master_${i}`}
                name="Ensemble Master" stroke="#a78bfa" strokeWidth={2}
                dot={false} activeDot={{ r: 3 }} connectNulls legendType="circle" />,
              <Line key={`rank1_${i}`} type="monotone" dataKey={`rank1_${i}`}
                name="Rank 1" stroke="#fbbf24" strokeWidth={1.5} strokeDasharray="5 3"
                dot={false} activeDot={{ r: 3 }} connectNulls legendType="circle" />,
              <Line key={`level_${i}`} type="monotone" dataKey={`level_${i}`}
                name="Current Level" stroke="#94a3b8" strokeWidth={2}
                dot={false} activeDot={{ r: 3 }} connectNulls legendType="circle" />,
            ]
          }
          if (i === 1) {
            // 이전 1주: 적색으로 명확히 구분
            return [
              <Line key={`master_${i}`} type="monotone" dataKey={`master_${i}`}
                name={`Prev Master (${label})`} stroke="#ef4444" strokeWidth={1.5}
                dot={false} activeDot={{ r: 2 }} connectNulls legendType="circle" />,
              <Line key={`rank1_${i}`} type="monotone" dataKey={`rank1_${i}`}
                name={`Prev Rank1 (${label})`} stroke="#ef4444" strokeWidth={1}
                strokeDasharray="5 3"
                dot={false} activeDot={{ r: 2 }} connectNulls legendType="circle" />,
              <Line key={`level_${i}`} type="monotone" dataKey={`level_${i}`}
                name={`Prev Level (${label})`} stroke="#fca5a5" strokeWidth={1}
                strokeDasharray="3 3"
                dot={false} activeDot={{ r: 2 }} connectNulls legendType="circle" />,
            ]
          }
          // 2번째 이상: 적색 계열 currentLevel만
          return [
            <Line key={`level_${i}`} type="monotone" dataKey={`level_${i}`}
              name={`Level (${label})`} stroke="#fca5a5" strokeWidth={1}
              strokeDasharray="2 4"
              dot={false} activeDot={{ r: 2 }} connectNulls legendType="circle" />,
          ]
        })}
      </LineChart>
    </ResponsiveContainer>
  )
}
