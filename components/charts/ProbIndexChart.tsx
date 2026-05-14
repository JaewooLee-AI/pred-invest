'use client'

import {
  ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts'

interface DataPoint {
  date: string
  prob: number
  index: number
}

interface ProbIndexChartProps {
  data: DataPoint[]
  height?: number
}

const PROB_COLOR = '#fbbf24'
const INDEX_COLOR = '#60a5fa'

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string; dataKey: string }>
  label?: string
}) => {
  if (!active || !payload?.length) return null
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
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ background: p.color }} />
          <span style={{ color: 'var(--text-secondary)' }}>{p.name}</span>
          <span className="font-mono font-semibold ml-auto" style={{ color: p.color }}>
            {p.dataKey === 'prob' ? `${p.value.toFixed(1)}%` : p.value.toFixed(2)}
          </span>
        </div>
      ))}
    </div>
  )
}

export function ProbIndexChart({ data, height = 180 }: ProbIndexChartProps) {
  if (!data.length) return (
    <div className="h-44 flex items-center justify-center text-xs" style={{ color: 'var(--text-muted)' }}>
      데이터 없음
    </div>
  )

  const indexMin = Math.min(...data.map(d => d.index))
  const indexMax = Math.max(...data.map(d => d.index))
  const pad = Math.max((indexMax - indexMin) * 0.15, 1)

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 4, right: 28, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 9, fill: 'var(--text-muted)' }}
          tickLine={false}
          axisLine={{ stroke: 'rgba(0,0,0,0.08)' }}
          interval="preserveStartEnd"
        />
        <YAxis
          yAxisId="prob"
          orientation="left"
          domain={[0, 100]}
          tick={{ fontSize: 9, fill: PROB_COLOR }}
          tickLine={false}
          axisLine={false}
          tickFormatter={v => `${v}%`}
          width={32}
        />
        <YAxis
          yAxisId="index"
          orientation="right"
          domain={[indexMin - pad, indexMax + pad]}
          tick={{ fontSize: 9, fill: INDEX_COLOR }}
          tickLine={false}
          axisLine={false}
          tickFormatter={v => v.toFixed(1)}
          width={32}
        />
        <ReferenceLine yAxisId="prob" y={50} stroke="rgba(0,0,0,0.10)" strokeDasharray="4 4" />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: '10px', color: 'var(--text-muted)' }}
          iconSize={6}
        />
        <Line
          yAxisId="prob"
          type="monotone"
          dataKey="prob"
          name="상승 확률"
          stroke={PROB_COLOR}
          strokeWidth={1}
          strokeDasharray="5 3"
          dot={false}
          activeDot={{ r: 3 }}
        />
        <Line
          yAxisId="index"
          type="monotone"
          dataKey="index"
          name="예상 지수"
          stroke={INDEX_COLOR}
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 3 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
