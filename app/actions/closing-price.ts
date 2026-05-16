'use server'

import { parseClosingPriceCsv } from '@/lib/csv-parser'
import { upsertClosingPrices } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function uploadClosingPriceAction(formData: FormData) {
  const file = formData.get('csv') as File | null
  if (!file || file.size === 0) return { error: 'CSV 파일을 선택해주세요.' }

  const text = await file.text()
  const prices = parseClosingPriceCsv(text)
  if (Object.keys(prices).length === 0) return { error: 'Date 컬럼 또는 _Close 컬럼을 찾을 수 없습니다.' }

  await upsertClosingPrices(prices)
  revalidatePath('/weekly-shift')
  return { success: true, count: Object.keys(prices).length }
}
