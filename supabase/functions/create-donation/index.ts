import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

type DonationRequest = {
  wallet_id?: unknown;
  asset_id?: unknown;
  amount_requested?: unknown;
  amount_currency?: unknown;
  donor_name?: unknown;
  donor_email?: unknown;
  donation_message?: unknown;
};

function jsonResponse(
  body: Record<string, unknown>,
  status = 200,
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders,
  });
}

function cleanOptionalString(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: corsHeaders,
    });
  }

  if (request.method !== "POST") {
    return jsonResponse(
      {
        error: "Method not allowed",
      },
      405,
    );
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Missing Supabase server configuration.");

      return jsonResponse(
        {
          error: "Donation service is not configured.",
        },
        500,
      );
    }

    const body = (await request.json()) as DonationRequest;

    const walletId =
      typeof body.wallet_id === "string"
        ? body.wallet_id.trim()
        : "";

    const assetId =
      typeof body.asset_id === "string"
        ? body.asset_id.trim()
        : "";

    const amountCurrency =
      typeof body.amount_currency === "string"
        ? body.amount_currency.trim().toUpperCase()
        : "";

    const amountRequested =
      typeof body.amount_requested === "number"
        ? body.amount_requested
        : typeof body.amount_requested === "string"
          ? Number(body.amount_requested)
          : NaN;

    if (!walletId || !assetId) {
      return jsonResponse(
        {
          error: "wallet_id and asset_id are required.",
        },
        400,
      );
    }

    if (
      !Number.isFinite(amountRequested) ||
      amountRequested <= 0
    ) {
      return jsonResponse(
        {
          error: "amount_requested must be greater than zero.",
        },
        400,
      );
    }

    if (amountCurrency !== "USD") {
      return jsonResponse(
        {
          error: "Only USD donation amounts are currently supported.",
        },
        400,
      );
    }

    const supabaseAdmin = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    const { data: wallet, error: walletError } =
      await supabaseAdmin
        .from("donation_wallets")
        .select(`
          id,
          asset_id,
          wallet_address,
          label,
          active,
          donation_assets!inner (
            id,
            symbol,
            name,
            network,
            decimals,
            enabled,
            display_order
          )
        `)
        .eq("id", walletId)
        .maybeSingle();

    if (walletError) {
      console.error("Wallet lookup failed:", walletError);

      return jsonResponse(
        {
          error: "Unable to validate donation destination.",
        },
        500,
      );
    }

    if (!wallet) {
      return jsonResponse(
        {
          error: "Donation wallet was not found.",
        },
        400,
      );
    }

    if (!wallet.active) {
      return jsonResponse(
        {
          error: "Donation wallet is not active.",
        },
        400,
      );
    }

    if (wallet.asset_id !== assetId) {
      return jsonResponse(
        {
          error: "Donation wallet does not belong to the selected asset.",
        },
        400,
      );
    }

    const asset = Array.isArray(wallet.donation_assets)
      ? wallet.donation_assets[0]
      : wallet.donation_assets;

    if (!asset || !asset.enabled) {
      return jsonResponse(
        {
          error: "Selected donation asset is not enabled.",
        },
        400,
      );
    }

    const donorName = cleanOptionalString(body.donor_name);
    const donorEmail = cleanOptionalString(body.donor_email);
    const donationMessage = cleanOptionalString(
      body.donation_message,
    );

    if (donorName && donorName.length > 200) {
      return jsonResponse(
        {
          error: "donor_name is too long.",
        },
        400,
      );
    }

    if (donorEmail && donorEmail.length > 320) {
      return jsonResponse(
        {
          error: "donor_email is too long.",
        },
        400,
      );
    }

    if (donationMessage && donationMessage.length > 2000) {
      return jsonResponse(
        {
          error: "donation_message is too long.",
        },
        400,
      );
    }

    const { data: referenceData, error: referenceError } =
      await supabaseAdmin.rpc("create_donation_reference");

    if (referenceError || !referenceData) {
      console.error(
        "Donation reference generation failed:",
        referenceError,
      );

      return jsonResponse(
        {
          error: "Unable to create donation reference.",
        },
        500,
      );
    }

    const { data: donation, error: donationError } =
      await supabaseAdmin
        .from("donations")
        .insert({
          reference: referenceData,
          wallet_id: wallet.id,
          asset_id: wallet.asset_id,
          donor_name: donorName,
          donor_email: donorEmail,
          donation_message: donationMessage,
          amount_requested: amountRequested,
          amount_currency: "USD",
          status: "PENDING",
          metadata: {
            source: "apfa-direct-crypto",
          },
        })
        .select(`
          id,
          reference,
          wallet_id,
          asset_id,
          amount_requested,
          amount_currency,
          status,
          created_at
        `)
        .single();

    if (donationError) {
      console.error("Donation insert failed:", donationError);

      return jsonResponse(
        {
          error: "Unable to create donation.",
        },
        500,
      );
    }

    const { error: eventError } = await supabaseAdmin
      .from("donation_events")
      .insert({
        donation_id: donation.id,
        event_type: "DONATION_CREATED",
        payload: {
          source: "apfa-direct-crypto",
          asset_id: asset.id,
          wallet_id: wallet.id,
        },
      });

    if (eventError) {
      console.error(
        "Donation event insert failed:",
        eventError,
      );

      return jsonResponse(
        {
          error: "Donation was created but audit logging failed.",
          donation_id: donation.id,
          reference: donation.reference,
        },
        500,
      );
    }

    return jsonResponse({
      success: true,
      donation: {
        id: donation.id,
        reference: donation.reference,
        wallet_id: donation.wallet_id,
        asset_id: donation.asset_id,
        amount_requested: donation.amount_requested,
        amount_currency: donation.amount_currency,
        status: donation.status,
        created_at: donation.created_at,
      },
      destination: {
        wallet_id: wallet.id,
        wallet_address: wallet.wallet_address,
        label: wallet.label,
        asset: {
          id: asset.id,
          symbol: asset.symbol,
          name: asset.name,
          network: asset.network,
          decimals: asset.decimals,
        },
      },
    });
  } catch (error) {
    console.error("Unexpected create-donation error:", error);

    return jsonResponse(
      {
        error: "Unable to process donation request.",
      },
      500,
    );
  }
});
