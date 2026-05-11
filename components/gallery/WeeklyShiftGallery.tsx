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
      <div className="text-center py-16" style={{ color: 'var(--muted)' }}>
        <p className="text-sm">업로드된 궤적 이미지가 없습니다.</p>
      </div>
    )
  }

  return (
    <>
      <p className="text-xs mb-4 font-mono" style={{ color: 'var(--muted)' }}>
        기준 주차: {label}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {assets.filter(a => a.imagePath).map(asset => (
          <button
            key={asset.name}
            onClick={() => setSelected(asset)}
            className="group relative rounded-xl overflow-hidden border transition-all hover:border-blue-500/50 hover:scale-[1.02]"
            style={{ borderColor: 'var(--border)', background: 'var(--card-hover)', aspectRatio: '4/3' }}
          >
            <Image
              src={asset.imagePath}
              alt={asset.name}
              fill
              className="object-cover transition-opacity group-hover:opacity-90"
            />
            <div className="absolute inset-x-0 bottom-0 p-2"
                 style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
              <p className="text-xs font-semibold text-white">{asset.name}</p>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-w-3xl w-full rounded-t-2xl sm:rounded-2xl overflow-hidden border"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b"
                 style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold text-white">{selected.name} — DTW 궤적</h3>
              <button
                onClick={() => setSelected(null)}
                className="w-7 h-7 flex items-center justify-center rounded-full transition-colors hover:bg-zinc-700 text-zinc-400 hover:text-white text-lg"
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
              <div className="px-5 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
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
