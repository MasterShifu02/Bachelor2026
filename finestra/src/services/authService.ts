import { supabase } from "../lib/supabase/client"


// ----------------------------
// LOGIN
// ----------------------------
export async function login(email: string, password: string) {

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) throw error

  return data.user
}


// ----------------------------
// LOGOUT
// ----------------------------
export async function logout() {

  const { error } = await supabase.auth.signOut()

  if (error) throw error

}


// ----------------------------
// HENT SESSION
// ----------------------------
export async function getSession() {

  const { data, error } = await supabase.auth.getSession()

  if (error) throw error

  return data.session
}


// ----------------------------
// HENT CURRENT USER
// ----------------------------
export async function getCurrentUser() {

  const { data, error } = await supabase.auth.getUser()

  if (error) throw error

  return data.user
}


// ----------------------------
// HENT PROFIL FRA DB
// ----------------------------
export async function getProfile() {

  const user = await getCurrentUser()

  if (!user) return null

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (error) throw error

  return data
}