import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CrossAsset Dashboard — 크로스에셋 분석',
  description: '다중 자산군 상승 확률 및 DTW 궤적 분석 대시보드',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
        {children}
      </body>
    </html>
  )
}
