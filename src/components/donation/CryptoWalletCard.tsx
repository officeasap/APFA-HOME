import { Copy, ExternalLink } from "lucide-react";
import { useState } from "react";

import type { DonationCryptoWallet } from "@/lib/api";

type CryptoWalletCardProps = {
  wallet: DonationCryptoWallet & { qrImage: string };
};

export function CryptoWalletCard({
  wallet,
}: CryptoWalletCardProps) {
  const [copied, setCopied] = useState(false);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(wallet.address);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <article
      className="rounded-[17px] border-2 border-[var(--primary-dark)]/15 bg-[var(--card)] p-3"
      style={{
        boxShadow:
          "6px 7px 14px rgba(30,25,20,0.23), inset -2px -2px 4px rgba(0,0,0,0.35)",
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[var(--primary-dark)]/10 bg-[var(--card)] text-primary"
          style={{
            boxShadow:
              "inset 4px 5px 9px rgba(30,25,20,0.16), 2px 3px 7px rgba(30,25,20,0.12)",
          }}
        >
          <span className="text-lg font-black">
            {wallet.asset === "BTC"
              ? "₿"
              : wallet.asset === "ETH"
                ? "Ξ"
                : wallet.asset === "SOL"
                  ? "S"
                  : wallet.network === "TRON"
                    ? "₮"
                    : wallet.asset.slice(0, 1)}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
            {wallet.network}
          </p>

          <h3 className="engraved-title mt-0.5 truncate text-base uppercase">
            {wallet.asset}
          </h3>

          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {wallet.standard}
          </p>
        </div>

        <img
          src={wallet.qrImage}
          alt={`${wallet.network} donation wallet QR code`}
          className="h-[64px] w-[64px] shrink-0 rounded-[10px] border-2 border-[var(--primary-dark)]/15 bg-white object-contain p-1"
        />

        <ExternalLink
          size={17}
          className="shrink-0 text-primary"
          aria-hidden="true"
        />
      </div>

      <div
        className="mt-3 rounded-[13px] border border-[var(--primary-dark)]/10 p-3"
        style={{
          boxShadow:
            "inset 4px 5px 10px rgba(30,25,20,0.17), inset -2px -2px 4px rgba(0,0,0,0.30)",
        }}
      >
        <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          Wallet address
        </p>

        <p className="break-all font-mono text-[10px] leading-relaxed text-foreground">
          {wallet.address}
        </p>
      </div>

      <button
        type="button"
        onClick={copyAddress}
        className="mt-3 flex min-h-10 w-full items-center justify-center gap-2 rounded-[13px] border-2 border-[var(--primary-dark)] bg-[#00551f] text-[10px] font-bold uppercase tracking-wider text-white active:translate-y-[2px]"
        style={{
          boxShadow:
            "5px 6px 12px rgba(30,25,20,0.25), inset 2px 2px 4px rgba(0,0,0,0.10)",
        }}
      >
        <Copy size={14} />
        {copied ? "Address Copied" : "Copy Wallet Address"}
      </button>
    </article>
  );
}