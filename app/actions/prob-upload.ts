'use server'

import { v4 as uuidv4 } from 'uuid'
import { addProbUpload } from '@/lib/db'
import { parseProbIndexCsv } from '@/lib/prob-index-parser'
import { revalidatePath } from 'next/cache'

export async function uploadProbAction(formData: FormData) {
  const file = formData.get('probFile') as File | null
  const referenceDate = formData.get('referenceDate') as string

  if (!file || !referenceDate) {
    return { error: 'CSV 파일과 기준일을 모두 입력해주세요.' }
  }

  const text = await file.text()
  const probData = parseProbIndexCsv(text)

  if (Object.keys(probData).length === 0) {
    return { error: 'CSV 파싱에 실패했습니다. 파일 형식을 확인해주세요. (컬럼명: Date, 자산_Prob, 자산_Index)' }
  }

  const id = uuidv4()
  await addProbUpload({ id, uploadedAt: new Date().toISOString(), referenceDate, probData })

  revalidatePath('/')
  return { success: true }
}
