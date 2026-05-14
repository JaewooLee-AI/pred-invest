'use server'

import { createSupabaseServerClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

const ADMIN_EMAIL = 'jaewoolee.ai@gmail.com'

async function assertAdmin() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) {
    throw new Error('관리자 권한이 필요합니다.')
  }
  return supabase
}

export async function approveUserAction(formData: FormData): Promise<void> {
  const email = formData.get('email') as string | null
  if (!email) return

  const supabase = await assertAdmin()
  const { data: { user } } = await supabase.auth.getUser()

  await supabase
    .from('pred_invest_users')
    .update({
      approved: true,
      approved_at: new Date().toISOString(),
      approved_by: user!.email,
    })
    .eq('email', email)

  revalidatePath('/admin/users')
}

export async function revokeUserAction(formData: FormData): Promise<void> {
  const email = formData.get('email') as string | null
  if (!email || email === ADMIN_EMAIL) return

  const supabase = await assertAdmin()

  await supabase
    .from('pred_invest_users')
    .update({ approved: false, approved_at: null, approved_by: null })
    .eq('email', email)

  revalidatePath('/admin/users')
}
