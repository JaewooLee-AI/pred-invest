import { supabase } from './supabase'
import type { ProbIndexPoint } from './prob-index-parser'
import type { ClosingPriceData, DtwDataPoint } from './csv-parser'

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

export interface ProbUpload {
  id: string
  uploadedAt: string
  referenceDate: string
  probData: Record<string, ProbIndexPoint[]>
}

export interface AssetShift {
  name: string
  description: string
  data: DtwDataPoint[]
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

export async function addCsvUpload(upload: CsvUpload): Promise<void> {
  // referenceDate를 키로 사용: 동일 기준일 재업로드 시 덮어씀
  await supabase.from('pred_invest_csv_uploads').delete().eq('reference_date', upload.referenceDate)

  const { error } = await supabase.from('pred_invest_csv_uploads').insert({
    id: upload.id,
    uploaded_at: upload.uploadedAt,
    reference_date: upload.referenceDate,
    chart_data: upload.chartData,
    asset_comments: upload.assetComments,
  })
  if (error) throw error

  const { data: old } = await supabase
    .from('pred_invest_csv_uploads')
    .select('id')
    .order('uploaded_at', { ascending: false })
    .range(50, 9999)
  if (old?.length) {
    await supabase.from('pred_invest_csv_uploads').delete().in('id', old.map(r => r.id))
  }
}

export async function addWeeklyShift(shift: WeeklyShift): Promise<void> {
  // label을 키로 사용: 동일 label이 있으면 덮어씀
  await supabase.from('pred_invest_weekly_shifts').delete().eq('label', shift.label)

  const { error } = await supabase.from('pred_invest_weekly_shifts').insert({
    id: shift.id,
    uploaded_at: shift.uploadedAt,
    label: shift.label,
    assets: shift.assets,
  })
  if (error) throw error

  const { data: old } = await supabase
    .from('pred_invest_weekly_shifts')
    .select('id')
    .order('uploaded_at', { ascending: false })
    .range(50, 9999)
  if (old?.length) {
    await supabase.from('pred_invest_weekly_shifts').delete().in('id', old.map(r => r.id))
  }
}

export async function addNotice(notice: Notice): Promise<void> {
  const { error } = await supabase.from('pred_invest_notices').upsert({
    id: notice.id,
    uploaded_at: notice.uploadedAt,
    filename: notice.filename,
    file_path: notice.filePath,
    description: notice.description,
  })
  if (error) throw error

  const { data: old } = await supabase
    .from('pred_invest_notices')
    .select('id')
    .order('uploaded_at', { ascending: false })
    .range(50, 9999)
  if (old?.length) {
    await supabase.from('pred_invest_notices').delete().in('id', old.map(r => r.id))
  }
}

export async function getLatestCsvUpload(): Promise<CsvUpload | null> {
  const { data } = await supabase
    .from('pred_invest_csv_uploads')
    .select('*')
    .order('uploaded_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (!data) return null
  return {
    id: data.id,
    uploadedAt: data.uploaded_at,
    referenceDate: data.reference_date,
    chartData: data.chart_data,
    assetComments: data.asset_comments,
  }
}

export async function getLatestWeeklyShift(): Promise<WeeklyShift | null> {
  const { data } = await supabase
    .from('pred_invest_weekly_shifts')
    .select('*')
    .order('label', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (!data) return null
  return {
    id: data.id,
    uploadedAt: data.uploaded_at,
    label: data.label,
    assets: data.assets,
  }
}

export async function getAllWeeklyShifts(): Promise<WeeklyShift[]> {
  const { data } = await supabase
    .from('pred_invest_weekly_shifts')
    .select('*')
    .order('label', { ascending: false })
    .limit(50)
  if (!data) return []
  return data.map(r => ({
    id: r.id,
    uploadedAt: r.uploaded_at,
    label: r.label,
    assets: r.assets,
  }))
}

export async function addProbUpload(upload: ProbUpload): Promise<void> {
  // referenceDate를 키로 사용: 동일 기준일 재업로드 시 덮어씀
  await supabase.from('pred_invest_prob_uploads').delete().eq('reference_date', upload.referenceDate)

  const { error } = await supabase.from('pred_invest_prob_uploads').insert({
    id: upload.id,
    uploaded_at: upload.uploadedAt,
    reference_date: upload.referenceDate,
    prob_data: upload.probData,
  })
  if (error) throw error

  const { data: old } = await supabase
    .from('pred_invest_prob_uploads')
    .select('id')
    .order('uploaded_at', { ascending: false })
    .range(50, 9999)
  if (old?.length) {
    await supabase.from('pred_invest_prob_uploads').delete().in('id', old.map(r => r.id))
  }
}

export async function getAllCsvUploads(): Promise<CsvUpload[]> {
  const { data } = await supabase
    .from('pred_invest_csv_uploads')
    .select('*')
    .order('uploaded_at', { ascending: false })
    .limit(50)
  if (!data) return []
  return data.map(r => ({
    id: r.id,
    uploadedAt: r.uploaded_at,
    referenceDate: r.reference_date,
    chartData: r.chart_data,
    assetComments: r.asset_comments,
  }))
}

export async function getAllProbUploads(): Promise<ProbUpload[]> {
  const { data } = await supabase
    .from('pred_invest_prob_uploads')
    .select('*')
    .order('uploaded_at', { ascending: false })
    .limit(50)
  if (!data) return []
  return data.map(r => ({
    id: r.id,
    uploadedAt: r.uploaded_at,
    referenceDate: r.reference_date,
    probData: r.prob_data,
  }))
}

export async function getLatestProbUpload(): Promise<ProbUpload | null> {
  const { data } = await supabase
    .from('pred_invest_prob_uploads')
    .select('*')
    .order('uploaded_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (!data) return null
  return {
    id: data.id,
    uploadedAt: data.uploaded_at,
    referenceDate: data.reference_date,
    probData: data.prob_data,
  }
}

export interface RegisteredUser {
  id: string
  email: string
  firstLoginAt: string
  approved: boolean
  approvedAt: string | null
  approvedBy: string | null
  createdAt: string
}

export async function getAllRegisteredUsers(): Promise<RegisteredUser[]> {
  const { data } = await supabase
    .from('pred_invest_users')
    .select('*')
    .order('created_at', { ascending: true })
  if (!data) return []
  return data.map(r => ({
    id: r.id,
    email: r.email,
    firstLoginAt: r.first_login_at,
    approved: r.approved,
    approvedAt: r.approved_at ?? null,
    approvedBy: r.approved_by ?? null,
    createdAt: r.created_at,
  }))
}

export async function getClosingPrices(): Promise<ClosingPriceData> {
  const { data } = await supabase
    .from('pred_invest_closing_prices')
    .select('prices')
    .eq('id', 'singleton')
    .maybeSingle()
  return (data?.prices as ClosingPriceData) ?? {}
}

export async function upsertClosingPrices(newPrices: ClosingPriceData): Promise<void> {
  const existing = await getClosingPrices()
  const merged: ClosingPriceData = { ...existing }
  for (const [date, assets] of Object.entries(newPrices)) {
    merged[date] = { ...(merged[date] ?? {}), ...assets }
  }
  const { error } = await supabase
    .from('pred_invest_closing_prices')
    .upsert({ id: 'singleton', uploaded_at: new Date().toISOString(), prices: merged })
  if (error) throw error
}

export async function getAllNotices(): Promise<Notice[]> {
  const { data } = await supabase
    .from('pred_invest_notices')
    .select('*')
    .order('uploaded_at', { ascending: false })
    .limit(50)
  if (!data) return []
  return data.map(r => ({
    id: r.id,
    uploadedAt: r.uploaded_at,
    filename: r.filename,
    filePath: r.file_path,
    description: r.description,
  }))
}
