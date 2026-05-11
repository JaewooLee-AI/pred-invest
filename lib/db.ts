import fs from 'fs/promises'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'data', 'db.json')

export interface AssetComment {
  [asset: string]: string
}

export interface CsvUpload {
  id: string
  uploadedAt: string
  referenceDate: string
  chartData: Record<string, Array<{ date: string; A: number; B: number; C: number }>>
  assetComments: AssetComment
}

export interface AssetShift {
  name: string
  imagePath: string
  description: string
}

export interface WeeklyShift {
  id: string
  uploadedAt: string
  label: string
  assets: AssetShift[]
}

export interface Notice {
  id: string
  uploadedAt: string
  filename: string
  filePath: string
  description: string
}

export interface DB {
  csvUploads: CsvUpload[]
  weeklyShifts: WeeklyShift[]
  notices: Notice[]
}

async function readDB(): Promise<DB> {
  try {
    const raw = await fs.readFile(DB_PATH, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return { csvUploads: [], weeklyShifts: [], notices: [] }
  }
}

async function writeDB(db: DB): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf-8')
}

export async function getDB(): Promise<DB> {
  return readDB()
}

export async function addCsvUpload(upload: CsvUpload): Promise<void> {
  const db = await readDB()
  db.csvUploads.unshift(upload)
  if (db.csvUploads.length > 50) db.csvUploads = db.csvUploads.slice(0, 50)
  await writeDB(db)
}

export async function addWeeklyShift(shift: WeeklyShift): Promise<void> {
  const db = await readDB()
  db.weeklyShifts.unshift(shift)
  if (db.weeklyShifts.length > 50) db.weeklyShifts = db.weeklyShifts.slice(0, 50)
  await writeDB(db)
}

export async function addNotice(notice: Notice): Promise<void> {
  const db = await readDB()
  db.notices.unshift(notice)
  if (db.notices.length > 50) db.notices = db.notices.slice(0, 50)
  await writeDB(db)
}

export async function getLatestCsvUpload(): Promise<CsvUpload | null> {
  const db = await readDB()
  return db.csvUploads[0] ?? null
}

export async function getLatestWeeklyShift(): Promise<WeeklyShift | null> {
  const db = await readDB()
  return db.weeklyShifts[0] ?? null
}

export async function getAllWeeklyShifts(): Promise<WeeklyShift[]> {
  const db = await readDB()
  return db.weeklyShifts
}

export async function getAllNotices(): Promise<Notice[]> {
  const db = await readDB()
  return db.notices
}
