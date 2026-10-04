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
      className="overflow-hidden rounded-[20px] border-[3px] border-[#006b2b] bg-[#073b1d] p-4"
      style={{
        boxShadow:
          "10px 11px 22px rgba(0,0,0,0.42), inset 2px 2px 5px rgba(255,255,255,0.05), inset -3px -3px 7px rgba(0,0,0,0.24)",
      }}
    >
      <div className="flex items-start gap-3">
        {/* =====================================================
            WALLET ASSET MARK
        ===================================================== */}

        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[2px] border-[#8fd8a9] bg-[#eaf7ee] text-[#006b2b]"
          style={{
            boxShadow:
              "4px 5px 10px rgba(0,0,0,0.30), inset 2px 2px 4px rgba(255,255,255,0.85)",
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

        {/* =====================================================
            WALLET INFORMATION
        ===================================================== */}

        <div className="min-w-0 flex-1 pt-0.5">
          <p className="truncate text-[10px] font-black uppercase tracking-[0.16em] text-[#9de2b4]">
            {wallet.network}
          </p>

          <h3 className="mt-0.5 truncate text-lg font-black uppercase tracking-[0.08em] text-[#efe9c7]">
            {wallet.asset}
          </h3>

          <p className="mt-0.5 truncate text-[10px] font-bold uppercase tracking-[0.12em] text-[#dcede1]">
            {wallet.standard}
          </p>
        </div>

        {/* =====================================================
            QR IMAGE / PLACEHOLDER
            HIGH-CONTRAST IMAGE BAY
        ===================================================== */}

        <div
          className="flex h-[82px] w-[82px] shrink-0 items-center justify-center rounded-[14px] border-[3px] border-[#dcede1] bg-[#ffffff] p-1.5"
          style={{
            boxShadow:
              "5px 6px 12px rgba(0,0,0,0.38), inset 1px 1px 3px rgba(0,0,0,0.12)",
          }}
        >
          <img
            src={wallet.qrImage}
            alt={`${wallet.network} ${wallet.asset} donation wallet QR code`}
            className="h-full w-full rounded-[7px] bg-white object-contain"
          />
        </div>

        <ExternalLink
          size={17}
          strokeWidth={2.5}
          className="mt-1 shrink-0 text-[#9de2b4]"
          aria-hidden="true"
        />
      </div>

      {/* =====================================================
          WALLET ADDRESS
      ===================================================== */}

      <div
        className="mt-4 rounded-[15px] border-[2px] border-[#8fd8a9] bg-[#eaf7ee] p-3.5"
        style={{
          boxShadow:
            "inset 2px 3px 7px rgba(0,0,0,0.18), 3px 4px 8px rgba(0,0,0,0.20)",
        }}
      >
        <p className="mb-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-[#006b2b]">
          Wallet address
        </p>

        <p className="break-all font-mono text-[11px] font-bold leading-relaxed text-[#12351f]">
          {wallet.address}
        </p>
      </div>

      {/* =====================================================
          COPY WALLET ADDRESS
      ===================================================== */}

      <button
        type="button"
        onClick={copyAddress}
        className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-[14px] border-[2px] border-[#9de2b4] bg-[#008000] px-4 py-3 text-[10px] font-black uppercase tracking-[0.14em] text-[#ffffff] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#006b2b] active:translate-y-0"
        style={{
          boxShadow:
            "6px 7px 14px rgba(0,0,0,0.34), inset 2px 2px 4px rgba(255,255,255,0.10)",
        }}
      >
        <Copy size={14} strokeWidth={2.5} />
        {copied ? "Address Copied" : "Copy Wallet Address"}
      </button>
    </article>
  );
}