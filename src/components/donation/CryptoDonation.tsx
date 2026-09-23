import { useEffect, useState } from "react";

import { CryptoWalletCard } from "./CryptoWalletCard";
import {
  listCryptoDonationWallets,
  type DonationCryptoWallet,
} from "@/lib/api";
import { CRYPTO_WALLETS } from "@/lib/donations";

type DisplayWallet = DonationCryptoWallet & {
  qrImage: string;
};

const PRESET_AMOUNTS = ["1", "5", "10"];

export function CryptoDonation() {
  const [wallets, setWallets] = useState<DisplayWallet[]>([]);
  const [amount, setAmount] = useState("5");
  const [custom, setCustom] = useState(false);

  useEffect(() => {
    void listCryptoDonationWallets()
      .then((result) => {
        const presentationById = new Map(
          CRYPTO_WALLETS.map((wallet) => [wallet.id, wallet]),
        );

        setWallets(
          result.wallets.flatMap((wallet) => {
            const presentation = presentationById.get(wallet.id);

            return presentation
              ? [{ ...wallet, qrImage: presentation.qrImage }]
              : [];
          }),
        );
      })
      .catch(() => {
        setWallets([]);
      });
  }, []);

  return (
    <section aria-labelledby="crypto-donation-heading">
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
        Direct Digital Giving
      </p>

      <h2
        id="crypto-donation-heading"
        className="engraved-title mt-1 text-2xl uppercase"
      >
        Give with Crypto
      </h2>

      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Choose a suggested contribution, then select the correct network and
        verify the destination before sending.
      </p>

      <div className="mt-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
          Suggested contribution
        </p>

        <div className="mt-2 grid grid-cols-4 gap-2">
          {PRESET_AMOUNTS.map((preset) => {
            const selected = !custom && amount === preset;

            return (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setCustom(false);
                  setAmount(preset);
                }}
                className={`min-h-12 rounded-[14px] border-2 text-sm font-bold ${
                  selected
                    ? "border-[var(--primary-dark)] bg-[#00551f] text-white"
                    : "border-[var(--primary-dark)]/15 bg-[var(--card)] text-[var(--cathedral-grass-dark)]"
                }`}
                style={{
                  boxShadow: selected
                    ? "inset 5px 6px 11px rgba(0,0,0,0.25)"
                    : "5px 6px 11px rgba(30,25,20,0.22), inset -2px -2px 4px rgba(0,0,0,0.35)",
                }}
              >
                ${preset}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setCustom(true)}
            className={`min-h-12 rounded-[14px] border-2 text-[11px] font-bold uppercase tracking-wider ${
              custom
                ? "border-[var(--primary-dark)] bg-[#00551f] text-white"
                : "border-[var(--primary-dark)]/15 bg-[var(--card)] text-[var(--cathedral-grass-dark)]"
            }`}
            style={{
              boxShadow: custom
                ? "inset 5px 6px 11px rgba(0,0,0,0.25)"
                : "5px 6px 11px rgba(30,25,20,0.22), inset -2px -2px 4px rgba(0,0,0,0.35)",
            }}
          >
            Custom
          </button>
        </div>
      </div>

      {custom && (
        <input
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          inputMode="decimal"
          placeholder="Above $10"
          aria-label="Custom suggested contribution"
          className="mt-3 min-h-12 w-full rounded-[15px] border-2 border-[var(--primary-dark)]/15 bg-[var(--card)] px-4 text-sm font-semibold outline-none"
          style={{
            boxShadow:
              "inset 5px 6px 12px rgba(30,25,20,0.22), inset -2px -2px 4px rgba(0,0,0,0.35)",
          }}
        />
      )}

      <div className="mt-5 grid gap-3">
        {wallets.length > 0 ? (
          wallets.map((wallet) => (
            <CryptoWalletCard
              key={wallet.id}
              wallet={wallet}
            />
          ))
        ) : (
          <div
            className="rounded-[17px] border-2 border-[var(--primary-dark)]/10 p-5 text-center"
            style={{
              boxShadow:
                "inset 5px 6px 12px rgba(30,25,20,0.16), inset -2px -2px 4px rgba(0,0,0,0.35)",
            }}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
              Crypto wallets
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Verified donation wallets are currently unavailable.
            </p>
          </div>
        )}
      </div>

      {wallets.length > 0 && (
        <button
          type="button"
          disabled={!amount.trim()}
          className="mt-4 min-h-12 w-full rounded-[15px] border-2 border-[var(--primary-dark)] bg-[#00551f] text-xs font-bold uppercase tracking-[0.13em] text-white disabled:opacity-50"
          style={{
            boxShadow:
              "7px 8px 15px rgba(30,25,20,0.30), inset 2px 2px 5px rgba(0,0,0,0.12)",
          }}
        >
          Continue with ${amount}
        </button>
      )}
    </section>
  );
}