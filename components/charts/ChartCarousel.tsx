'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { ASSET_NAMES } from '@/lib/csv-parser'
import { AssetChart } from './AssetChart'

type DataPoint = { date: string; A: number; B: number; C: number }

interface Props {
  chartData: Record<string, DataPoint[]>
  assetComments: Record<string, string>
}

function ProbBadge({ avg }: { avg: string }) {
  const v = parseFloat(avg)
  const color = v >= 60 ? '#10b981' : v >= 40 ? '#f59e0b' : '#ef4444'
  const bg = v >= 60 ? 'rgba(16,185,129,0.15)' : v >= 40 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)'
  return (
    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded" style={{ color, background: bg }}>
      {avg}%
    </span>
  )
}

function AssetCardContent({ asset, data, comment }: { asset: string; data: DataPoint[]; comment: string }) {
  const latest = data[data.length - 1]
  const avgProb = latest ? ((latest.A + latest.B + latest.C) / 3).toFixed(1) : null
  return (
    <div className="rounded-xl border p-4 h-full" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">{asset}</h3>
        {avgProb && <ProbBadge avg={avgProb} />}
      </div>
      {data.length > 0 ? (
        <AssetChart asset={asset} data={data} />
      ) : (
        <div className="h-44 flex items-center justify-center text-xs" style={{ color: 'var(--muted)' }}>
          데이터 없음
        </div>
      )}
      {comment && (
        <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>{comment}</p>
        </div>
      )}
    </div>
  )
}

export function ChartCarousel({ chartData, assetComments }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)

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

  return (
    <>
      {/* ── Mobile: horizontal snap carousel ── */}
      <div className="sm:hidden -mx-4">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
        >
          {ASSET_NAMES.map(asset => (
            <div
              key={asset}
              className="snap-start shrink-0 px-4"
              style={{ width: '100vw' }}
            >
              <AssetCardContent
                asset={asset}
                data={chartData[asset] ?? []}
                comment={assetComments[asset] ?? ''}
              />
            </div>
          ))}
        </div>

        {/* Progress counter + dots */}
        <div className="flex flex-col items-center gap-2 mt-3">
          <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
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
                  background: i === current ? '#a855f7' : '#3f3f46',
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

      {/* ── Desktop: 3-column grid ── */}
      <div className="hidden sm:grid sm:grid-cols-3 gap-4">
        {ASSET_NAMES.map(asset => (
          <AssetCardContent
            key={asset}
            asset={asset}
            data={chartData[asset] ?? []}
            comment={assetComments[asset] ?? ''}
          />
        ))}
      </div>
    </>
  )
}
