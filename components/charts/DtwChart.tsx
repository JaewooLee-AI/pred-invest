'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import type { DtwDataPoint } from '@/lib/csv-parser'

interface DtwChartProps {
  data: DtwDataPoint[]
  assetName: string
}

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border p-3 text-xs shadow-md bg-white" style={{ borderColor: '#e4e4e7' }}>
      <p className="font-semibold mb-2 text-zinc-500">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.color }} />
          <span className="text-zinc-500">{p.name}</span>
          <span className="font-mono font-semibold" style={{ color: p.color }}>
            {p.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </span>
        </div>
      ))}
    </div>
  )
}

export function DtwChart({ data, assetName }: DtwChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-xs text-zinc-400">
        데이터 없음
      </div>
    )
  }

  const allValues = data.flatMap(d => [d.ensembleMaster, d.ensembleRank1, d.currentLevel]).filter(v => v !== 0)
  const minVal = Math.min(...allValues)
  const maxVal = Math.max(...allValues)
  const padding = (maxVal - minVal) * 0.1 || Math.abs(maxVal) * 0.05
  const yDomain: [number, number] = [minVal - padding, maxVal + padding]

  const formatDate = (d: string) => {
    const parts = d.split('-')
    if (parts.length >= 3) return `${parts[1]}/${parts[2]}`
    return d
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 9, fill: '#9ca3af' }}
          tickLine={false}
          axisLine={{ stroke: '#e5e7eb' }}
          interval="preserveStartEnd"
          tickFormatter={formatDate}
        />
        <YAxis
          domain={yDomain}
          tick={{ fontSize: 9, fill: '#9ca3af' }}
          tickLine={false}
          axisLine={false}
          width={55}
          tickFormatter={v => v.toLocaleString()}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: '10px', color: '#9ca3af' }}
          iconType="circle"
          iconSize={6}
        />
        <Line
          type="monotone"
          dataKey="ensembleMaster"
          name="Ensemble Master"
          stroke="#7c3aed"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 3 }}
        />
        <Line
          type="monotone"
          dataKey="ensembleRank1"
          name="Rank 1"
          stroke="#eab308"
          strokeWidth={1.5}
          strokeDasharray="5 3"
          dot={false}
          activeDot={{ r: 3 }}
        />
        <Line
          type="monotone"
          dataKey="currentLevel"
          name="Current Level"
          stroke="#18181b"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
