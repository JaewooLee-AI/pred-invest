'use server'

import { v4 as uuidv4 } from 'uuid'
import { addWeeklyShift } from '@/lib/db'
import { uploadToStorage, cleanupOldStorageFiles } from '@/lib/storage'
import { revalidatePath } from 'next/cache'
import { ASSET_NAMES } from '@/lib/csv-parser'

const BUCKET = 'pred-invest-trajectories'

export async function uploadWeeklyShiftAction(formData: FormData) {
  const label = (formData.get('label') as string)?.trim() || new Date().toISOString().slice(0, 10)

  const assets = []
  for (const asset of ASSET_NAMES) {
    const file = formData.get(`image_${asset}`) as File | null
    const description = (formData.get(`desc_${asset}`) as string) || ''
    let imagePath = ''

    if (file && file.size > 0) {
      const ext = file.name.split('.').pop() || 'png'
      const storagePath = `${Date.now()}_${asset.replace(/[^a-z0-9]/gi, '_')}.${ext}`
      const buffer = Buffer.from(await file.arrayBuffer())
      try {
        imagePath = await uploadToStorage(BUCKET, storagePath, buffer, file.type || 'image/png')
      } catch (e) {
        return { error: `이미지 업로드 실패 (${asset}): ${e instanceof Error ? e.message : String(e)}` }
      }
    }

    assets.push({ name: asset, imagePath, description })
  }

  const id = uuidv4()
  await addWeeklyShift({ id, uploadedAt: new Date().toISOString(), label, assets })
  await cleanupOldStorageFiles(BUCKET)

  revalidatePath('/')
  revalidatePath('/weekly-shift')
  return { success: true, error: undefined }
}
