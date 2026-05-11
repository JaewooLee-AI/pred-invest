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
}

const LINE_COLORS = {
  A: '#3b82f6',
  B: '#a855f7',
  C: '#10b981',
}

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border p-3 text-xs"
         style={{ background: '#1f1f23', borderColor: 'var(--border)' }}>
      <p className="font-semibold mb-2" style={{ color: 'var(--muted)' }}>{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.color }} />
          <span style={{ color: 'var(--muted)' }}>{p.name}</span>
          <span className="font-mono font-semibold" style={{ color: p.color }}>
            {p.value.toFixed(1)}%
          </span>
        </div>
      ))}
    </div>
  )
}

export function AssetChart({ asset, data }: AssetChartProps) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 9, fill: '#71717a' }}
          tickLine={false}
          axisLine={{ stroke: '#27272a' }}
          interval="preserveStartEnd"
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 9, fill: '#71717a' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={v => `${v}%`}
        />
        <ReferenceLine y={50} stroke="#3f3f46" strokeDasharray="4 4" />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: '10px', color: '#71717a' }}
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
