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
}

const PROB_COLOR = '#f59e0b'
const INDEX_COLOR = '#2563eb'

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string; dataKey: string }>
  label?: string
}) => {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-lg border p-3 text-xs shadow-md"
      style={{ background: '#fff', borderColor: '#e4e4e7' }}
    >
      <p className="font-semibold mb-2 text-zinc-500">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.color }} />
          <span className="text-zinc-500">{p.name}</span>
          <span className="font-mono font-semibold" style={{ color: p.color }}>
            {p.dataKey === 'prob' ? `${p.value.toFixed(1)}%` : p.value.toFixed(2)}
          </span>
        </div>
      ))}
    </div>
  )
}

export function ProbIndexChart({ data }: ProbIndexChartProps) {
  if (!data.length) return (
    <div className="h-44 flex items-center justify-center text-xs text-zinc-400">
      데이터 없음
    </div>
  )

  const indexMin = Math.min(...data.map(d => d.index))
  const indexMax = Math.max(...data.map(d => d.index))
  const pad = Math.max((indexMax - indexMin) * 0.15, 1)

  return (
    <ResponsiveContainer width="100%" height={180}>
      <ComposedChart data={data} margin={{ top: 4, right: 28, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 9, fill: '#9ca3af' }}
          tickLine={false}
          axisLine={{ stroke: '#e5e7eb' }}
          interval="preserveStartEnd"
        />
        {/* Left: Prob axis */}
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
        {/* Right: Index axis */}
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
        <ReferenceLine yAxisId="prob" y={50} stroke="#e5e7eb" strokeDasharray="4 4" />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: '10px', color: '#9ca3af' }}
          iconSize={6}
        />
        {/* Prob: thin dashed */}
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
        {/* Index: thick solid */}
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
