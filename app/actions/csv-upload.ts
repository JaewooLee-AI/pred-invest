'use server'

import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { addCsvUpload } from '@/lib/db'
import { parseCsvText, ASSET_NAMES } from '@/lib/csv-parser'
import { cleanupOldFiles } from '@/lib/storage'
import { revalidatePath } from 'next/cache'

export async function uploadCsvAction(formData: FormData) {
  const file = formData.get('csvFile') as File | null
  const referenceDate = formData.get('referenceDate') as string

  if (!file || !referenceDate) {
    return { error: 'CSV 파일과 기준일을 모두 입력해주세요.' }
  }

  const text = await file.text()
  const chartData = parseCsvText(text)

  if (Object.keys(chartData).length === 0) {
    return { error: 'CSV 파싱에 실패했습니다. 파일 형식을 확인해주세요.' }
  }

  const assetComments: Record<string, string> = {}
  for (const asset of ASSET_NAMES) {
    assetComments[asset] = (formData.get(`comment_${asset}`) as string) || ''
  }

  const id = uuidv4()
  await addCsvUpload({
    id,
    uploadedAt: new Date().toISOString(),
    referenceDate,
    chartData,
    assetComments,
  })

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'csv')
  await cleanupOldFiles(uploadDir)

  revalidatePath('/')
  return { success: true }
}
