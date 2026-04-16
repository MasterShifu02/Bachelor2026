/// <reference types="deno" />
// @ts-ignore
import { serve } from "https://deno.land/std@0.224.0/http/server.ts"
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const FRONTEND_URL = Deno.env.get("FRONTEND_URL") || "http://localhost:5173"

serve(async (req: Request) => {
  const origin = req.headers.get("origin") ?? FRONTEND_URL
  const requestHeaders =
    req.headers.get("access-control-request-headers") ??
    "authorization, x-client-info, apikey, content-type"

  const corsHeaders = {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": requestHeaders,
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  }

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  const headers = {
    "Content-Type": "application/json",
    ...corsHeaders,
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("EDGE_SECRET_KEY")!
    )

    const url = new URL(req.url)
    const token = url.searchParams.get("token")
    const action = url.searchParams.get("action")

    if (!token) {
      return new Response(JSON.stringify({ error: "Missing token" }), { status: 400, headers })
    }

    // -------------------
    // HENT ALT RELATERT DATA
    // -------------------
    const { data: caseData, error } = await supabase
      .from("cases")
      .select(`
        *,
        attachments (
          id,
          file_url
        ),
        customers (
          id,
          first_name,
          last_name,
          email,
          phone
        ),
        products (
          id,
          product_name,
          spacer_number,
          serial_number,
          order_number,
          purchase_date
        )
      `)
      .eq("public_token", token)
      .single()

    if (error || !caseData) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 404,
        headers,
      })
    }

    // -------------------
    // Token checks
    // -------------------
    if (caseData.token_used) {
      return new Response(JSON.stringify({ error: "Token already used" }), {
        status: 403,
        headers,
      })
    }

    if (
      caseData.token_expires_at &&
      new Date(caseData.token_expires_at) < new Date()
    ) {
      return new Response(JSON.stringify({ error: "Token expired" }), {
        status: 403,
        headers,
      })
    }

    // For å få signed URLs for alle vedlegg
    const attachmentsWithUrls = await Promise.all(
      (caseData.attachments ?? []).map(async (file: { file_url: any; id: any }) => {
        const { data } = await supabase.storage
          .from("attachments")
          .createSignedUrl(file.file_url, 60 * 60); // 1 time

        return {
          id: file.id,
          file_url: file.file_url,
          signedUrl: data?.signedUrl || null,
        };
      })
    );

    // -------------------
    // GET → PREFILL DATA
    // -------------------
    if (req.method === "GET") {
      return new Response(
        JSON.stringify({
          // CUSTOMER
          firstName: caseData.customers?.first_name || "",
          lastName: caseData.customers?.last_name || "",
          email: caseData.customers?.email || "",
          phone: caseData.customers?.phone || "",

          // PRODUCT
          productNameModel: caseData.products?.product_name || "",
          productSpacerNumber: caseData.products?.spacer_number || "",
          productSerialNumber: caseData.products?.serial_number || "",
          productReceitNumber: caseData.products?.order_number || "",
          productPurchaseDate: caseData.products?.purchase_date || "",

          // CASE
          problemType: caseData.damage_type || "",
          problemDescription: caseData.description || "",
          problemDate: caseData.problem_date || "",

          // ATTACHMENTS
          attachments: attachmentsWithUrls,

        }),
        { status: 200, headers }
      )
    }

    // -------------------
    // POST → SUBMIT
    // -------------------
    if (req.method === "POST" && action === "submit") {
      const body = await req.json()

      const {
        firstName,
        lastName,
        phone,
        email,
        productNameModel,
        productSpacerNumber,
        productSerialNumber,
        productReceitNumber,
        productPurchaseDate,
        problemType,
        problemDescription,
        problemDate,
      } = body

      // -------------------
      // 1. UPDATE CUSTOMER
      // -------------------
      const { error: customerError } = await supabase
        .from("customers")
        .update({
          first_name: firstName,
          last_name: lastName,
          email,
          phone: phone || null,
        })
        .eq("id", caseData.customer_id)

      if (customerError) {
        return new Response(JSON.stringify({ error: customerError.message }), {
          status: 500,
          headers,
        })
      }

      // -------------------
      // 2. UPSERT PRODUCT (unngå duplikater)
      // -------------------
      let productId = caseData.product_id

      if (productId) {
        // update eksisterende
        const { error: updateProductError } = await supabase
          .from("products")
          .update({
            product_name: productNameModel,
            spacer_number: productSpacerNumber,
            serial_number: productSerialNumber || null,
            order_number: productReceitNumber,
            purchase_date: productPurchaseDate || null,
          })
          .eq("id", productId)

        if (updateProductError) {
          return new Response(JSON.stringify({ error: updateProductError.message }), {
            status: 500,
            headers,
          })
        }
      } else {
        // opprett ny
        const { data: product, error: productError } = await supabase
          .from("products")
          .insert({
            product_name: productNameModel,
            spacer_number: productSpacerNumber,
            serial_number: productSerialNumber || null,
            order_number: productReceitNumber,
            purchase_date: productPurchaseDate || null,
          })
          .select()
          .single()

        if (productError || !product) {
          return new Response(JSON.stringify({ error: productError?.message }), {
            status: 500,
            headers,
          })
        }

        productId = product.id
      }

      // -------------------
      // 3. UPDATE CASE
      // -------------------
      const { data: updatedCase, error: updateError } = await supabase
        .from("cases")
        .update({
          product_id: productId,
          damage_type: problemType,
          description: problemDescription,
          problem_date: problemDate || null,
          status: "submitted_by_customer",
          token_used: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", caseData.id)
        .select()
        .single()

      if (updateError) {
        return new Response(JSON.stringify({ error: updateError.message }), {
          status: 500,
          headers,
        })
      }

      // -------------------
      // 4. EVENT LOG
      // -------------------
      await supabase.from("case_events").insert({
        case_id: caseData.id,
        actor_name: `${firstName} ${lastName}`,
        actor_role: "customer",
        event_type: "submitted_form",
        description: "Customer submitted case form",
      })

      return new Response(JSON.stringify(updatedCase), {
        status: 200,
        headers,
      })
    }

    // -------------------
    // FILE UPLOAD
    // -------------------
    if (req.method === "POST" && action === "upload") {
      const formData = await req.formData()
      const file = formData.get("file") as File | null

      if (!file) {
        return new Response(JSON.stringify({ error: "No file provided" }), {
          status: 400,
          headers,
        })
      }

      const filePath = `${caseData.id}/${crypto.randomUUID()}-${file.name}`

      // bruk stream + metadata
      const { error: uploadError } = await supabase.storage
        .from("attachments")
        .upload(filePath, file, {
          contentType: file.type,
          upsert: false,
        })

      if (uploadError) {
        console.error("UPLOAD ERROR:", uploadError)

        return new Response(JSON.stringify({ error: uploadError.message }), {
          status: 500,
          headers,
        })
      }

      const { error: dbError } = await supabase.from("attachments").insert({
        case_id: caseData.id,
        file_url: filePath,
        uploaded_by: null,
      })

      if (dbError) {
        console.error("DB INSERT ERROR:", dbError)
      }

      return new Response(JSON.stringify({ message: "File uploaded" }), {
        status: 200,
        headers,
      })
    }

    // -------------------
    // DELETE FILE
    // -------------------
    if (req.method === "POST" && action === "delete-file") {
      const fileId = url.searchParams.get("id");

      if (!fileId) {
        return new Response(JSON.stringify({ error: "Missing file id" }), {
          status: 400,
          headers,
        });
      }

      // 1. Hent fil fra DB
      const { data: fileData, error: fileError } = await supabase
        .from("attachments")
        .select("id, file_url, case_id")
        .eq("id", fileId)
        .single();

      if (fileError || !fileData) {
        return new Response(JSON.stringify({ error: "File not found" }), {
          status: 404,
          headers,
        });
      }

      // sørg for at fil tilhører riktig case
      if (fileData.case_id !== caseData.id) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 403,
          headers,
        });
      }

      // 2. Slett fra storage
      const { error: storageError } = await supabase.storage
        .from("attachments")
        .remove([fileData.file_url]);

      if (storageError) {
        console.error("STORAGE DELETE ERROR:", storageError);

        return new Response(JSON.stringify({ error: storageError.message }), {
          status: 500,
          headers,
        });
      }

      // 3. Slett fra DB
      const { error: dbError } = await supabase
        .from("attachments")
        .delete()
        .eq("id", fileId);

      if (dbError) {
        console.error("DB DELETE ERROR:", dbError);

        return new Response(JSON.stringify({ error: dbError.message }), {
          status: 500,
          headers,
        });
      }

      return new Response(JSON.stringify({ message: "File deleted" }), {
        status: 200,
        headers,
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers,
    })
    } catch (err: any) {
      console.error("ERROR:", err)
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers,
      })
    }
})