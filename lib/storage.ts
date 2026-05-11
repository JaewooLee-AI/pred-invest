import { supabase } from './supabase'

export async function uploadToStorage(
  bucket: string,
  filePath: string,
  buffer: Buffer,
  contentType: string,
): Promise<string> {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, buffer, { contentType, upsert: true })
  if (error) throw error

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
  return data.publicUrl
}

export async function cleanupOldStorageFiles(
  bucket: string,
  limit = 50,
): Promise<void> {
  const { data } = await supabase.storage
    .from(bucket)
    .list('', { limit: 200, sortBy: { column: 'created_at', order: 'asc' } })
  if (!data || data.length <= limit) return
  const toDelete = data.slice(0, data.length - limit).map(f => f.name)
  if (toDelete.length > 0) {
    await supabase.storage.from(bucket).remove(toDelete)
  }
}
