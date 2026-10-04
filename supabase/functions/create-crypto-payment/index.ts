import { createClient } from "npm:@supabase/supabase-js@2";

const NOWPAYMENTS_URL = "https://api.nowpayments.io/v1/payment";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type DonationRequest = {
  amount: number;
  currency?: string;
  payCurrency: string;
  donorName?: string;
  donorEmail?: string;
  message?: string;
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function makeOrderId() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomUUID().slice(0, 8).toUpperCase();

  return `APFA-DONATION-${timestamp}-${random}`;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const apiKey = Deno.env.get("NOWPAYMENTS_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!apiKey || !supabaseUrl || !serviceRoleKey) {
      return json(
        { error: "Payment service is not configured" },
        500,
      );
    }

    const body = (await request.json()) as DonationRequest;

    const amount = Number(body.amount);
    const priceCurrency = (body.currency ?? "usd").toLowerCase();
    const payCurrency = body.payCurrency.trim().toLowerCase();

    if (!Number.isFinite(amount) || amount <= 0) {
      return json({ error: "Donation amount must be greater than zero" }, 400);
    }

    if (!payCurrency) {
      return json({ error: "Payment currency is required" }, 400);
    }

    const orderId = makeOrderId();

    const supabase = createClient(
      supabaseUrl,
      serviceRoleKey,
    );

    const { error: insertError } = await supabase
      .from("crypto_donations")
      .insert({
        order_id: orderId,
        donor_name: body.donorName?.trim() || null,
        donor_email: body.donorEmail?.trim() || null,
        donation_message: body.message?.trim() || null,
        price_amount: amount,
        price_currency: priceCurrency,
        pay_currency: payCurrency,
        payment_status: "creating",
      });

    if (insertError) {
      console.error(insertError);
      return json({ error: "Unable to create donation record" }, 500);
    }

    const origin =
      request.headers.get("origin") ??
      "https://apfa.tracesecureone.com";

    const callbackUrl =
      `${supabaseUrl}/functions/v1/nowpayments-ipn`;

    const providerResponse = await fetch(NOWPAYMENTS_URL, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price_amount: amount,
        price_currency: priceCurrency,
        pay_currency: payCurrency,
        ipn_callback_url: callbackUrl,
        order_id: orderId,
        order_description:
          "Allen Premier Football Academy community donation",
      }),
    });

    const providerPayload = await providerResponse.json();

    if (!providerResponse.ok) {
      await supabase
        .from("crypto_donations")
        .update({
          payment_status: "failed",
          provider_payload: providerPayload,
        })
        .eq("order_id", orderId);

      console.error("NOWPayments error:", providerPayload);

      return json(
        {
          error: "Payment provider rejected the donation request",
        },
        502,
      );
    }

    await supabase
      .from("crypto_donations")
      .update({
        provider_payment_id:
          providerPayload.payment_id?.toString() ?? null,
        pay_amount: providerPayload.pay_amount ?? null,
        pay_address: providerPayload.pay_address ?? null,
        pay_extra_id: providerPayload.payin_extra_id ?? null,
        payment_status: providerPayload.payment_status ?? "waiting",
        provider_payload: providerPayload,
      })
      .eq("order_id", orderId);

    return json({
      orderId,
      paymentId: providerPayload.payment_id,
      paymentStatus: providerPayload.payment_status,
      payCurrency: providerPayload.pay_currency,
      payAmount: providerPayload.pay_amount,
      payAddress: providerPayload.pay_address,
      payExtraId: providerPayload.payin_extra_id ?? null,
      origin,
    });
  } catch (error) {
    console.error(error);

    return json(
      { error: "Unexpected payment service error" },
      500,
    );
  }
});
