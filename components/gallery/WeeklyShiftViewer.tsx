'use client'

import { useState } from 'react'
import { WeeklyShiftGallery } from './WeeklyShiftGallery'
import type { WeeklyShift } from '@/lib/db'

interface WeeklyShiftViewerProps {
  shifts: WeeklyShift[]
}

export function WeeklyShiftViewer({ shifts }: WeeklyShiftViewerProps) {
  const [selectedLabel, setSelectedLabel] = useState(shifts[0]?.label ?? '')

  const current = shifts.find(s => s.label === selectedLabel) ?? shifts[0]

  return (
    <div>
      {/* 기준일 선택 */}
      <div className="flex flex-wrap gap-2 mb-8">
        {shifts.map(s => {
          const isActive = s.label === selectedLabel
          return (
            <button
              key={s.label}
              onClick={() => setSelectedLabel(s.label)}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all"
              style={isActive ? {
                background: '#7c3aed',
                color: '#fff',
                boxShadow: '0 1px 4px 0 rgba(124,58,237,0.25)',
              } : {
                background: '#f4f4f5',
                color: '#71717a',
                border: '1px solid #e4e4e7',
              }}
            >
              {s.label}
            </button>
          )
        })}
      </div>

      {/* 선택된 기준일 차트 */}
      {current && <WeeklyShiftGallery assets={current.assets} />}
    </div>
  )
}
