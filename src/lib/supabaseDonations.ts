import { supabase } from "@/lib/supabase";

export type DonationAsset = {
  id: string;
  symbol: string;
  name: string;
  network: string;
  decimals: number | null;
  enabled: boolean;
  display_order: number;
};

export type DonationWallet = {
  id: string;
  asset_id: string;
  wallet_address: string;
  label: string | null;
  active: boolean;
  asset: DonationAsset;
};

export async function listActiveDonationWallets(): Promise<DonationWallet[]> {
  const { data, error } = await supabase
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
    .eq("active", true)
    .eq("donation_assets.enabled", true)
    .order("display_order", {
      referencedTable: "donation_assets",
      ascending: true,
    });

  if (error) {
    throw new Error(
      `Unable to load donation wallets: ${error.message}`,
    );
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    asset_id: row.asset_id,
    wallet_address: row.wallet_address,
    label: row.label,
    active: row.active,
    asset: row.donation_assets,
  })) as DonationWallet[];
}
