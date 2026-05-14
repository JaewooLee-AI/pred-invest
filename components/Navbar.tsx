import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NavbarClient } from './NavbarClient'

export async function Navbar() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const navUser = user
    ? {
        email: user.email ?? '',
        name: (user.user_metadata?.full_name as string | undefined)
          ?? (user.user_metadata?.name as string | undefined)
          ?? null,
      }
    : null

  return <NavbarClient user={navUser} />
}
