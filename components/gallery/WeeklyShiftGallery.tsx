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
      <div className="text-center py-16 text-zinc-400">
        <p className="text-sm">업로드된 궤적 이미지가 없습니다.</p>
      </div>
    )
  }

  return (
    <>
      <p className="text-xs mb-4 font-mono text-zinc-400">
        DTW 기준일: {label}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {assets.filter(a => a.imagePath).map(asset => (
          <button
            key={asset.name}
            onClick={() => setSelected(asset)}
            className="group relative rounded-xl overflow-hidden border border-zinc-200 hover:border-zinc-300 hover:shadow-md transition-all"
            style={{ aspectRatio: '4/3', background: '#fafafa' }}
          >
            <Image
              src={asset.imagePath}
              alt={asset.name}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
            />
            <div
              className="absolute inset-x-0 bottom-0 p-2.5"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)' }}
            >
              <p className="text-xs font-semibold text-white">{asset.name}</p>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden border border-zinc-200 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100">
              <h3 className="text-sm font-semibold text-zinc-900">
                {selected.name} — DTW 궤적
              </h3>
              <button
                onClick={() => setSelected(null)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors text-zinc-500 text-lg"
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
              <div className="px-5 py-4 border-t border-zinc-100 bg-zinc-50">
                <p className="text-sm leading-relaxed text-zinc-600">
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
