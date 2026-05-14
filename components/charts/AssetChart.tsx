'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts'

interface DataPoint {
  date: string
  A: number
  B: number
  C: number
}

interface AssetChartProps {
  asset: string
  data: DataPoint[]
  height?: number
}

const LINE_COLORS = {
  A: '#60a5fa',
  B: '#a78bfa',
  C: '#34d399',
}

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
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
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ background: p.color }} />
          <span style={{ color: 'var(--text-secondary)' }}>{p.name}</span>
          <span className="font-mono font-semibold ml-auto" style={{ color: p.color }}>
            {p.value.toFixed(1)}%
          </span>
        </div>
      ))}
    </div>
  )
}

export function AssetChart({ data, height = 180 }: AssetChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 9, fill: 'var(--text-muted)' }}
          tickLine={false}
          axisLine={{ stroke: 'rgba(0,0,0,0.08)' }}
          interval="preserveStartEnd"
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 9, fill: 'var(--text-muted)' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={v => `${v}%`}
        />
        <ReferenceLine y={50} stroke="rgba(0,0,0,0.10)" strokeDasharray="4 4" />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: '10px', color: 'var(--text-muted)' }}
          iconType="circle"
          iconSize={6}
        />
        {(['A', 'B', 'C'] as const).map(key => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            name={`모델 ${key}`}
            stroke={LINE_COLORS[key]}
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 3 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
