'use server'

import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { addWeeklyShift } from '@/lib/db'
import { cleanupOldFiles } from '@/lib/storage'
import { revalidatePath } from 'next/cache'
import { ASSET_NAMES } from '@/lib/csv-parser'

export async function uploadWeeklyShiftAction(formData: FormData) {
  const label = (formData.get('label') as string) || new Date().toISOString().slice(0, 10)
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'trajectories')
  await fs.mkdir(uploadDir, { recursive: true })

  const assets = []
  for (const asset of ASSET_NAMES) {
    const file = formData.get(`image_${asset}`) as File | null
    const description = (formData.get(`desc_${asset}`) as string) || ''
    let imagePath = ''

    if (file && file.size > 0) {
      const ext = file.name.split('.').pop() || 'png'
      const filename = `${Date.now()}_${asset.replace(/[^a-z0-9]/gi, '_')}.${ext}`
      const dest = path.join(uploadDir, filename)
      const buffer = Buffer.from(await file.arrayBuffer())
      await fs.writeFile(dest, buffer)
      imagePath = `/uploads/trajectories/${filename}`
    }

    assets.push({ name: asset, imagePath, description })
  }

  const id = uuidv4()
  await addWeeklyShift({
    id,
    uploadedAt: new Date().toISOString(),
    label,
    assets,
  })

  await cleanupOldFiles(uploadDir)
  revalidatePath('/')
  revalidatePath('/weekly-shift')
  return { success: true, error: undefined }
}
