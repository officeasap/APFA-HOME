import { createClient } from "npm:@supabase/supabase-js@2";

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;

  let result = 0;

  for (let index = 0; index < a.length; index++) {
    result |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }

  return result === 0;
}

Deno.serve(async (request) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const ipnSecret = Deno.env.get("NOWPAYMENTS_IPN_SECRET");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!ipnSecret || !supabaseUrl || !serviceRoleKey) {
      return new Response("IPN service is not configured", {
        status: 500,
      });
    }

    const rawBody = await request.text();

    const receivedSignature =
      request.headers.get("x-nowpayments-sig") ?? "";

    const payload = JSON.parse(rawBody);

    const sortedPayload = JSON.stringify(
      Object.keys(payload)
        .sort()
        .reduce<Record<string, unknown>>((result, key) => {
          result[key] = payload[key];
          return result;
        }, {}),
    );

    const encoder = new TextEncoder();

    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(ipnSecret),
      { name: "HMAC", hash: "SHA-512" },
      false,
      ["sign"],
    );

    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(sortedPayload),
    );

    const signature = Array.from(
      new Uint8Array(signatureBuffer),
    )
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    if (!timingSafeEqual(signature, receivedSignature)) {
      return new Response("Invalid signature", { status: 401 });
    }

    const supabase = createClient(
      supabaseUrl,
      serviceRoleKey,
    );

    const orderId = payload.order_id;

    if (!orderId) {
      return new Response("Missing order_id", { status: 400 });
    }

    const status = payload.payment_status ?? "unknown";

    const updates: Record<string, unknown> = {
      provider_payment_id:
        payload.payment_id?.toString() ?? null,
      payment_status: status,
      actually_paid: payload.actually_paid ?? null,
      actually_paid_currency:
        payload.actually_paid_currency ?? null,
      provider_payload: payload,
      ipn_received_at: new Date().toISOString(),
    };

    if (status === "finished") {
      updates.completed_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("crypto_donations")
      .update(updates)
      .eq("order_id", orderId);

    if (error) {
      console.error(error);
      return new Response("Database update failed", {
        status: 500,
      });
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error(error);

    return new Response("Invalid IPN", {
      status: 400,
    });
  }
});
