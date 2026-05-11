'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function loginAction(formData: FormData) {
  const id = formData.get('id') as string
  const pw = formData.get('pw') as string

  if (id === 'root' && pw === '1234') {
    const cookieStore = await cookies()
    cookieStore.set('auth_session', 'authenticated', {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      path: '/',
      sameSite: 'lax',
    })
    redirect('/admin')
  }

  return { error: '아이디 또는 비밀번호가 올바르지 않습니다.' }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('auth_session')
  redirect('/login')
}
