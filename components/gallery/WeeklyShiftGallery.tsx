'use client'

import { useState } from 'react'
import { DtwChart } from '@/components/charts/DtwChart'
import type { AssetShift } from '@/lib/db'

interface WeeklyShiftGalleryProps {
  assets: AssetShift[]
}

export function WeeklyShiftGallery({ assets }: WeeklyShiftGalleryProps) {
  const [selected, setSelected] = useState<AssetShift | null>(null)

  const activeAssets = assets.filter(a => a.data?.length > 0)

  if (activeAssets.length === 0) return null

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {activeAssets.map(asset => (
          <button
            key={asset.name}
            onClick={() => setSelected(asset)}
            className="group rounded-xl border border-zinc-200 hover:border-violet-300 hover:shadow-md transition-all bg-white p-4 text-left"
          >
            <p className="text-xs font-semibold text-violet-600 mb-3">{asset.name}</p>
            <DtwChart data={asset.data} assetName={asset.name} />
            {asset.description && (
              <p className="text-[10px] text-zinc-400 mt-2 line-clamp-2">{asset.description}</p>
            )}
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
            className="relative max-w-3xl w-full bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden border border-zinc-200 shadow-2xl"
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
            <div className="p-6">
              <DtwChart data={selected.data} assetName={selected.name} />
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
