import fs from 'fs/promises'
import path from 'path'

export async function cleanupOldFiles(dirPath: string, limit = 50): Promise<void> {
  try {
    const entries = await fs.readdir(dirPath)
    const stats = await Promise.all(
      entries.map(async (name) => {
        try {
          const fullPath = path.join(dirPath, name)
          const stat = await fs.stat(fullPath)
          return { name, fullPath, mtime: stat.mtime.getTime() }
        } catch {
          return null
        }
      })
    )

    const files = stats
      .filter((s): s is NonNullable<typeof s> => s !== null && !s.name.startsWith('.'))
      .sort((a, b) => b.mtime - a.mtime)

    const toDelete = files.slice(limit)
    await Promise.all(
      toDelete.map(async ({ fullPath }) => {
        try {
          await fs.unlink(fullPath)
        } catch (err) {
          console.error(`GC: failed to delete ${fullPath}`, err)
        }
      })
    )
  } catch (err) {
    console.error(`GC: failed to scan ${dirPath}`, err)
  }
}
