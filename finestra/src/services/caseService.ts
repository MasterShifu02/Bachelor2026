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