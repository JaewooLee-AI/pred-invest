'use server'

import { v4 as uuidv4 } from 'uuid'
import { addNotice } from '@/lib/db'
import { uploadToStorage, cleanupOldStorageFiles } from '@/lib/storage'
import { extractRandomSnippet } from '@/lib/snippet'
import { revalidatePath } from 'next/cache'

const BUCKET = 'pred-invest-notices'

export async function uploadNoticeAction(formData: FormData) {
  const file = formData.get('pdfFile') as File | null
  const manualDesc = (formData.get('description') as string) || ''

  if (!file || file.size === 0) {
    return { error: 'PDF 파일을 선택해주세요.' }
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const safeFilename = `${Date.now()}_${file.name.replace(/[^a-z0-9._-]/gi, '_')}`

  let filePath: string
  try {
    filePath = await uploadToStorage(BUCKET, safeFilename, buffer, 'application/pdf')
  } catch (e) {
    return { error: `PDF 업로드 실패: ${e instanceof Error ? e.message : String(e)}` }
  }

  let description = manualDesc
  if (!description) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pdfMod: any = await import('pdf-parse')
      const parseFn = typeof pdfMod === 'function' ? pdfMod : pdfMod.default
      const parsed = await parseFn(buffer)
      description = extractRandomSnippet(parsed.text) || '내용을 추출할 수 없습니다.'
    } catch {
      description = '내용을 추출할 수 없습니다.'
    }
  }

  const id = uuidv4()
  await addNotice({ id, uploadedAt: new Date().toISOString(), filename: file.name, filePath, description })
  await cleanupOldStorageFiles(BUCKET)

  revalidatePath('/')
  revalidatePath('/notices')
  return { success: true }
}
