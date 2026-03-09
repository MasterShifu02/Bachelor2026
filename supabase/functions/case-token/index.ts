/// <reference types="deno" />
// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
)

serve(async (req: Request) => {
  const url = new URL(req.url)
  const token = url.searchParams.get("token")

  if (!token) {
    return new Response(JSON.stringify({ error: "Missing token" }), { status: 400 })
  }

  // Finn saken
  const { data: caseData, error } = await supabase
    .from("cases")
    .select("*")
    .eq("public_token", token)
    .single()

  if (error || !caseData) {
    return new Response(JSON.stringify({ error: "Invalid token" }), { status: 404 })
  }

  if (caseData.token_used) {
    return new Response(JSON.stringify({ error: "Token already used" }), { status: 403 })
  }

  if (caseData.token_expires_at && new Date(caseData.token_expires_at) < new Date()) {
    return new Response(JSON.stringify({ error: "Token expired" }), { status: 403 })
  }

  // -------------------
  // GET → hent saken
  // -------------------
  if (req.method === "GET") {

    return new Response(JSON.stringify(caseData), {
      headers: { "Content-Type": "application/json" }
    })

  }

  // -------------------
  // POST → oppdater saken
  // -------------------
  if (req.method === "POST") {

    const body = await req.json()

    const { data, error } = await supabase
      .from("cases")
      .update({
        ...body,
        status: "submitted_by_customer",
        token_used: true,
        updated_at: new Date().toISOString()
      })
      .eq("id", caseData.id)
      .select()
      .single()

    await supabase
      .from("case_events")
      .insert({
        case_id: caseData.id,
        actor_name: "Customer",
        actor_role: "customer",
        event_type: "submitted_form",
        description: "Customer submitted case form"
      })

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    })

  }

  return new Response("Method not allowed", { status: 405 })
})