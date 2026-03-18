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
      headers: { "Content-Type": "application/json" },
    })
  }

  // -------------------
  // POST → oppdater skjema
  // -------------------
  if (req.method === "POST" && url.pathname === "/submit") {
    const body = await req.json()

    const { data, error } = await supabase
      .from("cases")
      .update({
        ...body,
        status: "submitted_by_customer",
        token_used: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", caseData.id)
      .select()
      .single()

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })

    await supabase.from("case_events").insert({
      case_id: caseData.id,
      actor_name: "Customer",
      actor_role: "customer",
      event_type: "submitted_form",
      description: "Customer submitted case form",
    })

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    })
  }

  // -------------------
  // POST /upload → last opp vedlegg
  // -------------------
  if (req.method === "POST" && url.pathname === "/upload") {
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) return new Response(JSON.stringify({ error: "No file provided" }), { status: 400 })

    const filePath = `${caseData.id}/${file.name}`

    const { error: uploadError } = await supabase.storage
      .from("attachments")
      .upload(filePath, file.stream(), {
        cacheControl: "3600",
        upsert: false,
      })

    if (uploadError) {
      return new Response(JSON.stringify({ error: uploadError.message }), { status: 500 })
    }

    // Lag attachment record i DB
    const { error: dbError } = await supabase
      .from("attachments")
      .insert({
        case_id: caseData.id,
        file_url: filePath,
        uploaded_by: null, // anonym kunde
      })

    if (dbError) {
      return new Response(JSON.stringify({ error: dbError.message }), { status: 500 })
    }

    return new Response(JSON.stringify({ message: "File uploaded successfully" }))
  }

  return new Response("Method not allowed", { status: 405 })
})