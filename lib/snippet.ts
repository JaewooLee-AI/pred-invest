export function extractRandomSnippet(rawText: string): string {
  const cleaned = rawText.replace(/[\t ]+/g, ' ').replace(/\r\n/g, '\n')
  const sentences = cleaned
    .split(/(?<=[.?!])\s+/)
    .map(s => s.replace(/\n+/g, ' ').trim())
    .filter(s => s.length >= 30)

  if (sentences.length === 0) return ''

  const count = Math.min(sentences.length, 2 + Math.floor(Math.random() * 2))
  const picked: string[] = []
  const used = new Set<number>()

  while (picked.length < count) {
    const idx = Math.floor(Math.random() * sentences.length)
    if (!used.has(idx)) {
      used.add(idx)
      picked.push(sentences[idx])
    }
    if (used.size >= sentences.length) break
  }

  return picked.join(' ') + '...'
}
