const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
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

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "GET") {
    return json({ error: "Method not allowed" }, 405);
  }

  const apiKey = Deno.env.get("NOWPAYMENTS_API_KEY");

  if (!apiKey) {
    return json({ error: "Payment service is not configured" }, 500);
  }

  const url = new URL(request.url);
  const paymentId = url.searchParams.get("paymentId");

  if (!paymentId) {
    return json({ error: "paymentId is required" }, 400);
  }

  try {
    const response = await fetch(
      `https://api.nowpayments.io/v1/payment/${encodeURIComponent(paymentId)}`,
      {
        headers: {
          "x-api-key": apiKey,
        },
      },
    );

    const payload = await response.json();

    if (!response.ok) {
      return json(
        { error: "Unable to retrieve payment status" },
        response.status,
      );
    }

    return json({
      paymentId: payload.payment_id,
      status: payload.payment_status,
      payCurrency: payload.pay_currency,
      payAmount: payload.pay_amount,
      actuallyPaid: payload.actually_paid,
      actuallyPaidCurrency: payload.actually_paid_currency,
    });
  } catch (error) {
    console.error(error);

    return json(
      { error: "Unexpected payment status error" },
      500,
    );
  }
});
