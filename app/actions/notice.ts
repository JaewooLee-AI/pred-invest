'use server'

import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { addNotice } from '@/lib/db'
import { cleanupOldFiles } from '@/lib/storage'
import { extractRandomSnippet } from '@/lib/snippet'
import { revalidatePath } from 'next/cache'

export async function uploadNoticeAction(formData: FormData) {
  const file = formData.get('pdfFile') as File | null
  const manualDesc = (formData.get('description') as string) || ''

  if (!file || file.size === 0) {
    return { error: 'PDF 파일을 선택해주세요.' }
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'pdf')
  await fs.mkdir(uploadDir, { recursive: true })

  const filename = `${Date.now()}_${file.name.replace(/[^a-z0-9._-]/gi, '_')}`
  const dest = path.join(uploadDir, filename)
  const buffer = Buffer.from(await file.arrayBuffer())
  await fs.writeFile(dest, buffer)

  let description = manualDesc

  if (!description) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pdfMod: any = await import('pdf-parse')
      const parseFn = typeof pdfMod === 'function' ? pdfMod : pdfMod.default
      const parsed = await parseFn(buffer)
      const snippet = extractRandomSnippet(parsed.text)
      description = snippet || '내용을 추출할 수 없습니다.'
    } catch {
      description = '내용을 추출할 수 없습니다.'
    }
  }

  const id = uuidv4()
  await addNotice({
    id,
    uploadedAt: new Date().toISOString(),
    filename: file.name,
    filePath: `/uploads/pdf/${filename}`,
    description,
  })

  await cleanupOldFiles(uploadDir)
  revalidatePath('/')
  revalidatePath('/notices')
  return { success: true }
}
