export interface ProbIndexPoint {
  date: string
  prob: number
  index: number
}

export interface ParsedProbIndexData {
  [asset: string]: ProbIndexPoint[]
}

export const PROB_ASSET_NAMES = [
  'S&P500', 'NASDAQ', 'KOSPI', 'GOLD', 'DXY', 'USDKRW', 'USDJPY', '10YUSB', 'WTI',
]

export function parseProbIndexCsv(text: string): ParsedProbIndexData {
  const lines = text.split('\n').filter(l => l.trim())
  if (lines.length < 2) return {}

  const headers = lines[0].split(',').map(s => s.trim())
  const result: ParsedProbIndexData = {}

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(s => s.trim())
    if (!cols[0]) continue
    const date = cols[0]

    for (const asset of PROB_ASSET_NAMES) {
      const probIdx = headers.indexOf(`${asset}_Prob`)
      const indexIdx = headers.indexOf(`${asset}_Index`)
      if (probIdx < 0 || indexIdx < 0) continue

      if (!result[asset]) result[asset] = []
      result[asset].push({
        date,
        prob: parseFloat(cols[probIdx]) || 0,
        index: parseFloat(cols[indexIdx]) || 0,
      })
    }
  }

  return result
}
