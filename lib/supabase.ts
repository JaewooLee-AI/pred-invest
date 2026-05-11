import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !key) {
  throw new Error('SUPABASE_URL 과 SUPABASE_ANON_KEY 환경변수를 설정해 주세요.')
}

export const supabase = createClient(url, key, {
  auth: { persistSession: false },
})
