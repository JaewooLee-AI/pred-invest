'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { PROB_ASSET_NAMES } from '@/lib/prob-index-parser'
import { ProbIndexChart } from './ProbIndexChart'

type ProbIndexPoint = { date: string; prob: number; index: number }

interface Props {
  probData: Record<string, ProbIndexPoint[]>
}

function ProbBadge({ prob }: { prob: number }) {
  const styles =
    prob >= 60
      ? { color: '#15803d', background: '#f0fdf4', border: '1px solid #bbf7d0' }
      : prob >= 40
      ? { color: '#b45309', background: '#fffbeb', border: '1px solid #fde68a' }
      : { color: '#b91c1c', background: '#fef2f2', border: '1px solid #fecaca' }
  return (
    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full" style={styles}>
      {prob.toFixed(1)}%
    </span>
  )
}

function AssetCard({ asset, data }: { asset: string; data: ProbIndexPoint[] }) {
  const latest = data[data.length - 1]
  return (
    <div
      className="rounded-xl border h-full p-4"
      style={{
        background: '#fff',
        borderColor: '#e4e4e7',
        boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.04)',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-zinc-900">{asset}</h3>
        <div className="flex items-center gap-2">
          {latest && (
            <>
              <ProbBadge prob={latest.prob} />
              <span className="text-xs font-mono text-blue-600 font-semibold">
                {latest.index.toFixed(2)}
              </span>
            </>
          )}
        </div>
      </div>
      <ProbIndexChart data={data} />
      <div className="mt-2 flex items-center gap-4 text-[10px]">
        <span className="flex items-center gap-1 text-zinc-400">
          <span
            className="inline-block w-5 border-t"
            style={{ borderColor: '#f59e0b', borderStyle: 'dashed', borderWidth: '1px' }}
          />
          상승 확률 (좌)
        </span>
        <span className="flex items-center gap-1 text-zinc-400">
          <span
            className="inline-block w-5 border-t-2"
            style={{ borderColor: '#2563eb' }}
          />
          예상 지수 (우)
        </span>
      </div>
    </div>
  )
}

export function ProbIndexCarousel({ probData }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)

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
              <AssetCard asset={asset} data={probData[asset] ?? []} />
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center gap-2 mt-3">
          <span className="text-xs font-mono text-zinc-400">
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
                  background: i === current ? '#2563eb' : '#e4e4e7',
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
          />
        ))}
      </div>
    </>
  )
}
