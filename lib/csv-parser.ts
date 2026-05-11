export interface ParsedChartData {
  [asset: string]: Array<{ date: string; A: number; B: number; C: number }>
}

export const ASSET_NAMES = [
  'S&P500', 'NASDAQ', 'KOSPI', 'GOLD', 'DXY', 'USDKRW', 'USDJPY', '10YUSB', 'WTI'
]

function parsePercent(val: string): number {
  return parseFloat(val.replace('%', '').trim()) || 0
}

export function parseCsvText(text: string): ParsedChartData {
  const lines = text.split('\n').filter(l => l.trim())
  if (lines.length < 3) return {}

  const row1 = lines[0].split(',').map(s => s.trim())
  const row2 = lines[1].split(',').map(s => s.trim())

  // Build column headers by forward-filling asset names
  const headers: string[] = []
  let currentAsset = ''
  for (let i = 0; i < row1.length; i++) {
    if (i === 0) { headers.push('date'); continue }
    if (row1[i]) currentAsset = row1[i]
    const sub = row2[i] || ''
    headers.push(`${currentAsset}_${sub}`)
  }

  const result: ParsedChartData = {}

  for (let i = 2; i < lines.length; i++) {
    const cols = lines[i].split(',').map(s => s.trim())
    if (!cols[0]) continue
    const date = cols[0]

    for (const asset of ASSET_NAMES) {
      const idxA = headers.indexOf(`${asset}_A`)
      const idxB = headers.indexOf(`${asset}_B`)
      const idxC = headers.indexOf(`${asset}_C`)
      if (idxA < 0) continue

      if (!result[asset]) result[asset] = []
      result[asset].push({
        date,
        A: idxA >= 0 && cols[idxA] ? parsePercent(cols[idxA]) : 0,
        B: idxB >= 0 && cols[idxB] ? parsePercent(cols[idxB]) : 0,
        C: idxC >= 0 && cols[idxC] ? parsePercent(cols[idxC]) : 0,
      })
    }
  }

  return result
}
