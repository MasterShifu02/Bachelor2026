import { supabase } from "../lib/supabase/client"
import type { Database } from "../types/database.types"

// Typene vi trenger
export type Customer = Database["public"]["Tables"]["customers"]["Row"]
export type Product = Database["public"]["Tables"]["products"]["Row"]
export type Store = Database["public"]["Tables"]["stores"]["Row"]
export type CaseRow = Database["public"]["Tables"]["cases"]["Row"]
export type CaseEvent = Database["public"]["Tables"]["case_events"]["Row"]

export type CaseListItem = CaseRow & {
  customers: Customer
  products: Product
  stores: Store
}

export type CreateCaseResult = {
  success: boolean
  mail_sent?: boolean
  warning?: string
}

// ------------------------------
// HENT ALLE SAKER
// ------------------------------
export async function getCases(): Promise<CaseListItem[]> {
  const { data, error } = await supabase
    .from("cases")
    .select(`
      *,
      customers (first_name,last_name),
      products (product_name,model),
      stores (name)
    `)
    .order("created_at", { ascending: false })

  if (error) throw error

  return data as CaseListItem[]
}

// ------------------------------
// HENT EN SAK
// ------------------------------
export async function getCase(caseId: string): Promise<CaseListItem> {
  const { data, error } = await supabase
    .from("cases")
    .select(`
      *,
      customers (first_name,last_name),
      products (product_name,model),
      stores (name)
    `)
    .eq("id", caseId)
    .single()

  if (error) throw error
  return data as CaseListItem
}

// ------------------------------
// HENT EVENT LOG
// ------------------------------
export async function getCaseEvents(caseId: string): Promise<CaseEvent[]> {
  const { data, error } = await supabase
    .from("case_events")
    .select("*")
    .eq("case_id", caseId)
    .order("created_at")

  if (error) throw error

  return data as CaseEvent[]
}

// ------------------------------
// OPPDATER STATUS
// ------------------------------
export async function updateCaseStatus(caseId: string, status: CaseRow["status"]): Promise<CaseRow> {
  const { data, error } = await supabase
    .from("cases")
    .update({ status })
    .eq("id", caseId)
    .select()
    .single()

  if (error) throw error
  return data as CaseRow
}

export async function createCase(payload: {
  first_name: string
  last_name: string
  email: string
  message?: string
  created_by: string
  }): Promise<CreateCaseResult> {
  let {
    data: { session },
  } = await supabase.auth.getSession()

  // If token is missing/expired, try refresh before invoking Edge Function.
  if (!session || (session.expires_at ?? 0) * 1000 <= Date.now()) {
    const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession()
    if (refreshError) throw refreshError
    session = refreshed.session
  }

  if (!session?.access_token) {
    throw new Error("Du må være innlogget for å opprette sak")
  }

  const { data, error } = await supabase.functions.invoke("create-case", {
    body: payload,
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
  })

  if (error) {
    const details = (error as { context?: { json?: () => Promise<{ message?: string }> } }).context
    if (details?.json) {
      try {
        const body = await details.json()
        throw new Error(body?.message || error.message || "Failed to create case")
      } catch {
        // Fall back to the standard error message when context cannot be parsed.
      }
    }
    throw new Error(error.message || "Failed to create case")
  }

  return (data ?? { success: false }) as CreateCaseResult
}