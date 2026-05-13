'use server'

import { v4 as uuidv4 } from 'uuid'
import { addWeeklyShift } from '@/lib/db'
import { parseDtwCsvText, DTW_ASSET_NAMES } from '@/lib/csv-parser'
import { revalidatePath } from 'next/cache'

export async function uploadWeeklyShiftAction(formData: FormData) {
  const label = (formData.get('label') as string)?.trim() || new Date().toISOString().slice(0, 10)

  const assets = []
  for (const asset of DTW_ASSET_NAMES) {
    const file = formData.get(`csv_${asset}`) as File | null
    const description = (formData.get(`desc_${asset}`) as string) || ''
    let data: ReturnType<typeof parseDtwCsvText> = []

    if (file && file.size > 0) {
      const text = await file.text()
      data = parseDtwCsvText(text)
    }

    assets.push({ name: asset, description, data })
  }

  const id = uuidv4()
  await addWeeklyShift({ id, uploadedAt: new Date().toISOString(), label, assets })

  revalidatePath('/')
  revalidatePath('/weekly-shift')
  return { success: true, error: undefined }
}
