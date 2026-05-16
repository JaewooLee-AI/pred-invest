'use client'

import { useState } from 'react'
import { WeeklyShiftGallery } from './WeeklyShiftGallery'
import type { WeeklyShift } from '@/lib/db'
import type { ClosingPriceData } from '@/lib/csv-parser'

interface WeeklyShiftViewerProps {
  shifts: WeeklyShift[]
  closingPrices: ClosingPriceData
}

export function WeeklyShiftViewer({ shifts, closingPrices }: WeeklyShiftViewerProps) {
  const [selectedLabel, setSelectedLabel] = useState(shifts[0]?.label ?? '')
  const selectedIdx = shifts.findIndex(s => s.label === selectedLabel)
  const activeShifts = shifts.slice(selectedIdx)

  return (
    <div>
      {/* 기준일 선택 */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>기준일</span>
        <select
          value={selectedLabel}
          onChange={e => setSelectedLabel(e.target.value)}
          className="text-sm font-medium rounded-xl px-3 py-2 outline-none cursor-pointer transition-colors"
          style={{
            background: 'var(--card)',
            border: '1px solid var(--purple-border)',
            color: 'var(--purple)',
            boxShadow: '0 0 0 0 transparent',
          }}
        >
          {shifts.map(s => (
            <option key={s.label} value={s.label}>{s.label}</option>
          ))}
        </select>
      </div>

      {activeShifts.length > 0 && <WeeklyShiftGallery shifts={activeShifts} closingPrices={closingPrices} />}
    </div>
  )
}
