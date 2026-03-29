/// <reference types="deno" />
// @ts-ignore
import { serve } from "https://deno.land/std@0.224.0/http/server.ts"
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const FRONTEND_URL = Deno.env.get("FRONTEND_URL") || "http://localhost:5173"

serve(async (req: Request): Promise<Response> => {
  const origin = req.headers.get("origin") ?? FRONTEND_URL
  const requestHeaders =
    req.headers.get("access-control-request-headers") ??
    "authorization, x-client-info, apikey, content-type, x-supabase-api-version"
  const corsHeaders = {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": requestHeaders,
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  }

  // ------------------------
  // 1. Håndter CORS preflight (OPTIONS)
  // ------------------------
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    })
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    })
  }

  const headers = {
    "Content-Type": "application/json",
    ...corsHeaders,
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")
    const secretKey = Deno.env.get("EDGE_SECRET_KEY")

    if (!supabaseUrl || !secretKey) {
      return new Response(
        JSON.stringify({ error: "Missing server environment variables: SUPABASE_URL / EDGE_SECRET_KEY" }),
        { status: 500, headers }
      )
    }

    const supabase = createClient(supabaseUrl, secretKey)

    const body = await req.json()
    const { first_name, last_name, email, message, created_by } = body

    // ------------------------
    // 2. Hent profil + store email
    // ------------------------
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, name, store_id, stores (email)")
      .eq("id", created_by)
      .single()

    if (profileError || !profile) {
      return new Response(JSON.stringify({ error: "Profile not found" }), { status: 404, headers })
    }

    const storeEmail = profile.stores?.email || Deno.env.get("SMTP_FROM")

    // ------------------------
    // 3. Opprett customer
    // ------------------------
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .insert({ first_name, last_name, email })
      .select()
      .single()

    if (customerError) {
      return new Response(JSON.stringify({ error: customerError.message }), { status: 500, headers })
    }

    // ------------------------
    // 4. Opprett case
    // ------------------------
    const { data: newCase, error: caseError } = await supabase
      .from("cases")
      .insert({
        store_id: profile.store_id,
        created_by: profile.id,
        customer_id: customer.id,
        description: null,
        status: "waiting_for_customer",
        token_expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      })
      .select()
      .single()

    if (caseError) {
      return new Response(JSON.stringify({ error: caseError.message }), { status: 500, headers })
    }

    // ------------------------
    // 5. Case event
    // ------------------------
    await supabase.from("case_events").insert({
      case_id: newCase.id,
      actor_name: profile.name,
      actor_role: "store",
      event_type: "case_created",
      description: "Sak opprettet av butikk",
    })

    const token = newCase.public_token

    // ------------------------
    // 6. Send mail
    // ------------------------
    const link = `${FRONTEND_URL}/s/${token}`
    const smtpHost = Deno.env.get("SMTP_HOST")
    const smtpPort = Deno.env.get("SMTP_PORT")
    const smtpUser = Deno.env.get("SMTP_USER")
    const smtpPass = Deno.env.get("SMTP_PASS")
    const smtpFrom = Deno.env.get("SMTP_FROM")

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !smtpFrom) {
      return new Response(
        JSON.stringify({
          success: true,
          mail_sent: false,
          warning: "Case created, but SMTP configuration is missing in function secrets",
        }),
        { headers }
      )
    }

    try {
      // Lazy-load so CORS/OPTIONS never depends on npm module startup.
      // @ts-ignore
      const { default: nodemailer } = await import("npm:nodemailer")
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort),
        secure: false,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      })

      await transporter.sendMail({
        from: `Service <${smtpFrom}>`,
        to: email,
        replyTo: storeEmail,
        subject: "Du har en ny sak",
        html: `
          <p>Hei ${first_name}</p>
          ${message ? `<p><strong>Melding fra butikk:</strong><br/>${message}</p>` : ""}
          <p>Klikk på linken for å fylle ut saken:</p>
          <a href="${link}">${link}</a>
        `,
      })

      return new Response(JSON.stringify({ success: true, mail_sent: true }), { headers })
    } catch (mailError: any) {
      console.error("Failed to send create-case email:", mailError?.message ?? mailError)
      return new Response(
        JSON.stringify({
          success: true,
          mail_sent: false,
          warning: `Case created, but email failed: ${mailError?.message ?? "Unknown SMTP error"}`,
        }),
        { headers }
      )
    }
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers })
  }
})