'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { PROB_ASSET_NAMES } from '@/lib/prob-index-parser'
import { ProbIndexChart } from './ProbIndexChart'

type ProbIndexPoint = { date: string; prob: number; index: number }

interface SelectedChart {
  asset: string
  data: ProbIndexPoint[]
}

interface Props {
  probData: Record<string, ProbIndexPoint[]>
}

function ProbBadge({ prob }: { prob: number }) {
  const styles =
    prob >= 60
      ? { color: 'var(--emerald)', background: 'var(--emerald-tint)', border: '1px solid var(--emerald-border)' }
      : prob >= 40
      ? { color: 'var(--amber)', background: 'var(--amber-tint)', border: '1px solid var(--amber-border)' }
      : { color: 'var(--rose)', background: 'var(--rose-tint)', border: '1px solid var(--rose-border)' }
  return (
    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full" style={styles}>
      {prob.toFixed(1)}%
    </span>
  )
}

function AssetCard({ asset, data, onClick }: { asset: string; data: ProbIndexPoint[]; onClick: () => void }) {
  const latest = data[data.length - 1]
  return (
    <button
      onClick={onClick}
      className="rounded-xl h-full p-4 text-left w-full"
      style={{ background: 'var(--card)', border: '1px solid var(--border)', transition: 'border-color 180ms, background 180ms', cursor: 'pointer' }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--amber-border)'
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
          {latest && (
            <>
              <ProbBadge prob={latest.prob} />
              <span className="text-xs font-mono font-semibold" style={{ color: 'var(--blue)' }}>
                {latest.index.toFixed(2)}
              </span>
            </>
          )}
          {/* Expand hint */}
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
            <path d="M8 1h4v4M5 8l6.5-6.5M1 5V1h4M5 5.5 1.5 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <ProbIndexChart data={data} />
      <div className="mt-2 flex items-center gap-4 text-[10px]">
        <span className="flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
          <span className="inline-block w-5 border-t" style={{ borderColor: 'var(--amber)', borderStyle: 'dashed', borderWidth: '1px' }} />
          상승 확률 (좌)
        </span>
        <span className="flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
          <span className="inline-block w-5 border-t-2" style={{ borderColor: 'var(--blue)' }} />
          예상 지수 (우)
        </span>
      </div>
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
              {selected.asset} — Prob / Index
            </h3>
            {latest && (
              <>
                <ProbBadge prob={latest.prob} />
                <span className="text-xs font-mono font-semibold" style={{ color: 'var(--blue)' }}>
                  {latest.index.toFixed(2)}
                </span>
              </>
            )}
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
          <ProbIndexChart data={selected.data} height={320} />
        </div>

        {/* Legend */}
        <div className="px-5 py-3 flex items-center gap-6" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
          <span className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span className="inline-block w-6 border-t" style={{ borderColor: 'var(--amber)', borderStyle: 'dashed', borderWidth: '1.5px' }} />
            상승 확률 (좌축)
          </span>
          <span className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span className="inline-block w-6 border-t-2" style={{ borderColor: 'var(--blue)' }} />
            예상 지수 (우축)
          </span>
        </div>
      </div>
    </div>
  )
}

export function ProbIndexCarousel({ probData }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<SelectedChart | null>(null)

  const onScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const idx = Math.round(el.scrollLeft / el.clientWidth)
    setCurrent(Math.min(PROB_ASSET_NAMES.length - 1, idx))
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
    setSelected({ asset, data: probData[asset] ?? [] })
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
          {PROB_ASSET_NAMES.map(asset => (
            <div key={asset} className="snap-start shrink-0 px-4" style={{ width: '100vw' }}>
              <AssetCard asset={asset} data={probData[asset] ?? []} onClick={() => openModal(asset)} />
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center gap-2 mt-3">
          <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            {current + 1} / {PROB_ASSET_NAMES.length}
          </span>
          <div className="flex gap-1.5">
            {PROB_ASSET_NAMES.map((asset, i) => (
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
        {PROB_ASSET_NAMES.map(asset => (
          <AssetCard
            key={asset}
            asset={asset}
            data={probData[asset] ?? []}
            onClick={() => openModal(asset)}
          />
        ))}
      </div>

      {selected && <ChartModal selected={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
