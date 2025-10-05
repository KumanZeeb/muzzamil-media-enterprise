import { supabase } from './supabaseClient'

export async function loginAdmin(username: string, password: string) {
  const { data, error } = await supabase
    .from('admins')
    .select('*')
    .eq('username', username)
    .eq('password', password)
    .single()

  if (error || !data) throw new Error('Login gagal')
  return data
}
