import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
}

export function Card({ children, className = '', style }: CardProps) {
  return (
    <div
      className={`rounded-xl border p-4 ${className}`}
      style={{ background: 'var(--card)', borderColor: 'var(--border)', ...style }}
    >
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h3 className={`text-xs font-semibold uppercase tracking-widest mb-3 ${className}`}
        style={{ color: 'var(--muted)' }}>
      {children}
    </h3>
  )
}
