'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { ASSET_NAMES } from '@/lib/csv-parser'
import { AssetChart } from './AssetChart'

type DataPoint = { date: string; A: number; B: number; C: number }

interface SelectedChart {
  asset: string
  data: DataPoint[]
  comment: string
}

interface Props {
  chartData: Record<string, DataPoint[]>
  assetComments: Record<string, string>
}

function ProbBadge({ avg }: { avg: string }) {
  const v = parseFloat(avg)
  const styles =
    v >= 60
      ? { color: 'var(--emerald)', background: 'var(--emerald-tint)', border: '1px solid var(--emerald-border)' }
      : v >= 40
      ? { color: 'var(--amber)', background: 'var(--amber-tint)', border: '1px solid var(--amber-border)' }
      : { color: 'var(--rose)', background: 'var(--rose-tint)', border: '1px solid var(--rose-border)' }
  return (
    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full" style={styles}>
      {avg}%
    </span>
  )
}

function AssetCardContent({
  asset, data, comment, onClick,
}: {
  asset: string; data: DataPoint[]; comment: string; onClick: () => void
}) {
  const latest = data[data.length - 1]
  const avgProb = latest ? ((latest.A + latest.B + latest.C) / 3).toFixed(1) : null
  return (
    <button
      onClick={onClick}
      className="rounded-xl h-full p-4 text-left w-full group"
      style={{ background: 'var(--card)', border: '1px solid var(--border)', transition: 'border-color 180ms, background 180ms', cursor: 'pointer' }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--blue-border)'
        e.currentTarget.style.background = 'var(--card-hover)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.background = 'var(--card)'
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{asset}</h3>
        <div className="flex items-center gap-2">
          {avgProb && <ProbBadge avg={avgProb} />}
          {/* Expand hint */}
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
            <path d="M8 1h4v4M5 8l6.5-6.5M1 5V1h4M5 5.5 1.5 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      {data.length > 0 ? (
        <AssetChart asset={asset} data={data} />
      ) : (
        <div className="h-44 flex items-center justify-center text-xs" style={{ color: 'var(--text-muted)' }}>
          데이터 없음
        </div>
      )}
      {comment && (
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{comment}</p>
        </div>
      )}
    </button>
  )
}

function ChartModal({ selected, onClose }: { selected: SelectedChart; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const latest = selected.data[selected.data.length - 1]
  const avgProb = latest ? ((latest.A + latest.B + latest.C) / 3).toFixed(1) : null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
      onClick={onClose}
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
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
              {selected.asset} — 상승 확률
            </h3>
            {avgProb && <ProbBadge avg={avgProb} />}
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full text-lg transition-colors"
            style={{ background: 'var(--bg)', color: 'var(--text-secondary)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--card-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg)')}
          >
            ×
          </button>
        </div>

        {/* Chart */}
        <div className="p-6">
          <AssetChart asset={selected.asset} data={selected.data} height={320} />
        </div>

        {/* Comment */}
        {selected.comment && (
          <div className="px-5 py-4" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {selected.comment}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export function ChartCarousel({ chartData, assetComments }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<SelectedChart | null>(null)

  const onScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const idx = Math.round(el.scrollLeft / el.clientWidth)
    setCurrent(Math.min(ASSET_NAMES.length - 1, idx))
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [onScroll])

  const scrollTo = (i: number) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ left: el.clientWidth * i, behavior: 'smooth' })
  }

  const openModal = (asset: string) => {
    setSelected({
      asset,
      data: chartData[asset] ?? [],
      comment: assetComments[asset] ?? '',
    })
  }

  return (
    <>
      {/* Mobile: snap carousel */}
      <div className="sm:hidden -mx-4">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
        >
          {ASSET_NAMES.map(asset => (
            <div key={asset} className="snap-start shrink-0 px-4" style={{ width: '100vw' }}>
              <AssetCardContent
                asset={asset}
                data={chartData[asset] ?? []}
                comment={assetComments[asset] ?? ''}
                onClick={() => openModal(asset)}
              />
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center gap-2 mt-3">
          <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            {current + 1} / {ASSET_NAMES.length}
          </span>
          <div className="flex gap-1.5">
            {ASSET_NAMES.map((asset, i) => (
              <button
                key={asset}
                onClick={() => scrollTo(i)}
                aria-label={asset}
                style={{
                  width: i === current ? '1.25rem' : '0.375rem',
                  height: '0.375rem',
                  borderRadius: '999px',
                  background: i === current ? '#818cf8' : 'rgba(79,70,229,0.15)',
                  transition: 'all 0.2s',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Desktop: 3-column grid */}
      <div className="hidden sm:grid sm:grid-cols-3 gap-4">
        {ASSET_NAMES.map(asset => (
          <AssetCardContent
            key={asset}
            asset={asset}
            data={chartData[asset] ?? []}
            comment={assetComments[asset] ?? ''}
            onClick={() => openModal(asset)}
          />
        ))}
      </div>

      {selected && <ChartModal selected={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
