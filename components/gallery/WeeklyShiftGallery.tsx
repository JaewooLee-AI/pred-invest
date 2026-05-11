'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { AssetShift } from '@/lib/db'

interface WeeklyShiftGalleryProps {
  assets: AssetShift[]
  label: string
}

export function WeeklyShiftGallery({ assets, label }: WeeklyShiftGalleryProps) {
  const [selected, setSelected] = useState<AssetShift | null>(null)
  const hasImages = assets.some(a => a.imagePath)

  if (!hasImages) {
    return (
      <div className="text-center py-16" style={{ color: '#86868b' }}>
        <p className="text-sm">업로드된 궤적 이미지가 없습니다.</p>
      </div>
    )
  }

  return (
    <>
      <p className="text-xs mb-4 font-mono" style={{ color: '#3a3a3c' }}>
        DTW 기준일: {label}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {assets.filter(a => a.imagePath).map(asset => (
          <button
            key={asset.name}
            onClick={() => setSelected(asset)}
            className="group relative rounded-2xl overflow-hidden transition-all hover:opacity-80 hover:scale-[1.01]"
            style={{
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)',
              aspectRatio: '4/3',
            }}
          >
            <Image
              src={asset.imagePath}
              alt={asset.name}
              fill
              className="object-cover"
            />
            <div
              className="absolute inset-x-0 bottom-0 p-2.5"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}
            >
              <p className="text-xs font-semibold text-white">{asset.name}</p>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
          style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-w-2xl w-full rounded-t-3xl sm:rounded-3xl overflow-hidden"
            style={{
              background: '#1c1c1e',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div
              className="flex items-center justify-between px-5 py-3.5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
            >
              <h3 className="text-sm font-semibold" style={{ color: '#f5f5f7' }}>
                {selected.name} — DTW 궤적
              </h3>
              <button
                onClick={() => setSelected(null)}
                className="w-7 h-7 flex items-center justify-center rounded-full transition-all hover:opacity-80 text-lg"
                style={{ background: 'rgba(255,255,255,0.08)', color: '#86868b' }}
              >
                ×
              </button>
            </div>
            <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
              <Image
                src={selected.imagePath}
                alt={selected.name}
                fill
                className="object-contain"
              />
            </div>
            {selected.description && (
              <div className="px-5 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-sm leading-relaxed" style={{ color: '#86868b' }}>
                  {selected.description}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
