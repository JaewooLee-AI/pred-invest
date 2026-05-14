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
                background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
                color: '#fff',
                boxShadow: '0 0 16px rgba(99,102,241,0.25)',
              } : {
                background: 'var(--bg-elevated)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
              }}
            >
              {s.label}
            </button>
          )
        })}
      </div>

      {current && <WeeklyShiftGallery assets={current.assets} />}
    </div>
  )
}
