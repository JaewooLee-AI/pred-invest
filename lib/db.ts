import { supabase } from './supabase'
import type { ProbIndexPoint } from './prob-index-parser'

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

export async function addCsvUpload(upload: CsvUpload): Promise<void> {
  const { error } = await supabase.from('pred_invest_csv_uploads').upsert({
    id: upload.id,
    uploaded_at: upload.uploadedAt,
    reference_date: upload.referenceDate,
    chart_data: upload.chartData,
    asset_comments: upload.assetComments,
  })
  if (error) throw error

  // Keep only 50 most recent
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
  const { error } = await supabase.from('pred_invest_weekly_shifts').upsert({
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
    .order('uploaded_at', { ascending: false })
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
    .order('uploaded_at', { ascending: false })
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
  const { error } = await supabase.from('pred_invest_prob_uploads').upsert({
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
