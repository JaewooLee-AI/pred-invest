'use client'

import { useState } from 'react'
import { DtwChart } from '@/components/charts/DtwChart'
import type { WeeklyShift } from '@/lib/db'
import type { ClosingPriceData } from '@/lib/csv-parser'

interface WeeklyShiftGalleryProps {
  shifts: WeeklyShift[]
  closingPrices: ClosingPriceData
}

export function WeeklyShiftGallery({ shifts, closingPrices }: WeeklyShiftGalleryProps) {
  const [selectedName, setSelectedName] = useState<string | null>(null)

  const primary = shifts[0]
  if (!primary) return null

  const activeAssets = primary.assets.filter(a => a.data?.length > 0)
  if (activeAssets.length === 0) return null

  const selectedAsset = activeAssets.find(a => a.name === selectedName) ?? null

  function getDatasetsForAsset(assetName: string) {
    return shifts
      .map(s => ({
        label: s.label,
        data: s.assets.find(a => a.name === assetName)?.data ?? [],
      }))
      .filter(ds => ds.data.length > 0)
  }

  function getAssetClosingPrices(assetName: string): Record<string, number> {
    const result: Record<string, number> = {}
    for (const [date, assets] of Object.entries(closingPrices)) {
      if (assets[assetName] !== undefined) result[date] = assets[assetName]
    }
    return result
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {activeAssets.map(asset => (
          <button
            key={asset.name}
            onClick={() => setSelectedName(asset.name)}
            className="group rounded-2xl p-4 text-left transition-all"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--purple-border)'
              ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--card-hover)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'
              ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--card)'
            }}
          >
            <p
              className="text-xs font-semibold mb-3 px-2 py-0.5 rounded-md inline-block"
              style={{ color: 'var(--purple)', background: 'var(--purple-tint)', border: '1px solid var(--purple-border)' }}
            >
              {asset.name}
            </p>
            <DtwChart datasets={getDatasetsForAsset(asset.name)} assetName={asset.name} closingPrices={getAssetClosingPrices(asset.name)} />
            {asset.description && (
              <p className="text-[10px] mt-2 line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                {asset.description}
              </p>
            )}
          </button>
        ))}
      </div>

      {selectedAsset && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
          onClick={() => setSelectedName(null)}
        >
          <div
            className="relative max-w-3xl w-full rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border-strong)',
              boxShadow: '0 16px 48px rgba(79,70,229,0.15), 0 4px 16px rgba(0,0,0,0.12)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                {selectedAsset.name} — DTW 궤적
              </h3>
              <button
                onClick={() => setSelectedName(null)}
                className="w-7 h-7 flex items-center justify-center rounded-full transition-colors text-lg"
                style={{ background: 'var(--bg)', color: 'var(--text-secondary)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--card-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg)')}
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <DtwChart datasets={getDatasetsForAsset(selectedAsset.name)} assetName={selectedAsset.name} closingPrices={getAssetClosingPrices(selectedAsset.name)} height={380} />
            </div>
            {selectedAsset.description && (
              <div className="px-5 py-4" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {selectedAsset.description}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
