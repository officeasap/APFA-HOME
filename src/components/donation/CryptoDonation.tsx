import { useEffect, useMemo, useState } from "react";

import {
  listCryptoDonationWallets,
  type DonationCryptoWallet,
} from "@/lib/api";

import tronQr from "@/assets/crypto/tron.jpg";
import solanaQr from "@/assets/crypto/solana.jpg";
import ethereumQr from "@/assets/crypto/etherum.jpg";
import bnbSmartChainQr from "@/assets/crypto/bnb-smart-chain.jpg";
import bitcoinQr from "@/assets/crypto/bitcoin.jpg";
import arbitrumQr from "@/assets/crypto/arbitrum.jpg";

type DisplayWallet = DonationCryptoWallet & {
  qrImage: string;
};

const PRESET_AMOUNTS = ["1", "5", "10"];

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/[\s_-]+/g, "");
}

function getWalletQrImage(wallet: DonationCryptoWallet): string {
  const candidates: string[] = [
    wallet.id,
    wallet.asset,
    wallet.network,
    wallet.standard,
  ];

  for (const candidate of candidates) {
    const normalized = normalize(candidate);

    if (normalized.includes("bitcoin") || normalized === "btc") {
      return bitcoinQr;
    }

    if (normalized.includes("solana") || normalized === "sol") {
      return solanaQr;
    }

    if (
      normalized.includes("tron") ||
      normalized === "trx" ||
      normalized.includes("trc20")
    ) {
      return tronQr;
    }

    if (
      normalized.includes("ethereum") ||
      normalized === "eth" ||
      normalized.includes("erc20")
    ) {
      return ethereumQr;
    }

    if (
      normalized.includes("bnb") ||
      normalized.includes("smartchain") ||
      normalized.includes("bep20")
    ) {
      return bnbSmartChainQr;
    }

    if (normalized.includes("arbitrum") || normalized === "arb") {
      return arbitrumQr;
    }
  }

  return bitcoinQr;
}

function getExplorerOrWalletUri(
  wallet: DonationCryptoWallet,
  donationAmount: string,
): string {
  const address = wallet.address.trim();
  const amountLabel = encodeURIComponent(
    `APFA donation ${donationAmount} USD`,
  );

  const normalizedAsset = normalize(wallet.asset);
  const normalizedNetwork = normalize(wallet.network);
  const normalizedStandard = normalize(wallet.standard);

  /*
   * Bitcoin URI.
   *
   * A BTC amount cannot safely be generated from USD without an exchange
   * rate. Therefore the address is authoritative and the USD amount is
   * carried in the label rather than being falsely converted to BTC.
   */
  if (
    normalizedAsset.includes("bitcoin") ||
    normalizedAsset === "btc" ||
    normalizedNetwork.includes("bitcoin")
  ) {
    return `bitcoin:${encodeURIComponent(address)}?label=${amountLabel}`;
  }

  /*
   * Solana wallet URI.
   *
   * As with Bitcoin, we do not invent a SOL/USD exchange rate.
   */
  if (
    normalizedAsset.includes("solana") ||
    normalizedAsset === "sol" ||
    normalizedNetwork.includes("solana")
  ) {
    return `solana:${encodeURIComponent(address)}?label=${amountLabel}`;
  }

  /*
   * TRON wallet URI.
   */
  if (
    normalizedAsset.includes("tron") ||
    normalizedAsset === "trx" ||
    normalizedNetwork.includes("tron") ||
    normalizedStandard.includes("trc")
  ) {
    return `tron:${encodeURIComponent(address)}?label=${amountLabel}`;
  }

  /*
   * EVM-compatible wallets.
   *
   * Do not place a USD value into the `value` parameter because EVM
   * `value` is denominated in the native token's smallest unit.
   *
   * The destination is therefore opened directly while the selected
   * donation amount remains explicitly identified in the label.
   */
  if (
    normalizedAsset.includes("ethereum") ||
    normalizedAsset === "eth" ||
    normalizedNetwork.includes("ethereum") ||
    normalizedStandard.includes("erc") ||
    normalizedAsset.includes("bnb") ||
    normalizedNetwork.includes("bnb") ||
    normalizedNetwork.includes("smartchain") ||
    normalizedStandard.includes("bep") ||
    normalizedAsset.includes("arbitrum") ||
    normalizedNetwork.includes("arbitrum")
  ) {
    return `ethereum:${encodeURIComponent(address)}?label=${amountLabel}`;
  }

  /*
   * Generic fallback for an API-configured asset/network.
   *
   * This still uses the verified API address and never fabricates one.
   */
  return `ethereum:${encodeURIComponent(address)}?label=${amountLabel}`;
}

export function CryptoDonation() {
  const [wallets, setWallets] = useState<DisplayWallet[]>([]);
  const [amount, setAmount] = useState("5");
  const [custom, setCustom] = useState(false);
  const [walletsLoading, setWalletsLoading] = useState(true);
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;

    setWalletsLoading(true);

    void listCryptoDonationWallets()
      .then((result) => {
        if (cancelled) {
          return;
        }

        const activeWallets = result.wallets
          .filter((wallet) => wallet.enabled && wallet.address.trim())
          .map((wallet) => ({
            ...wallet,
            qrImage: getWalletQrImage(wallet),
          }));

        setWallets(activeWallets);

        const firstWallet = activeWallets[0];

        if (firstWallet) {
          setSelectedWalletId(firstWallet.id);
        } else {
          setSelectedWalletId(null);
        }
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        setWallets([]);
        setSelectedWalletId(null);
      })
      .finally(() => {
        if (!cancelled) {
          setWalletsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const numericAmount = useMemo(() => {
    const normalized = amount.replace(/,/g, "").trim();

    if (!normalized) {
      return 0;
    }

    const parsed = Number(normalized);

    return Number.isFinite(parsed) ? parsed : 0;
  }, [amount]);

  const amountIsValid =
    numericAmount > 0 && Number.isFinite(numericAmount);

  const selectedWallet = useMemo(
    () =>
      wallets.find((wallet) => wallet.id === selectedWalletId) ?? null,
    [wallets, selectedWalletId],
  );

  const paymentLabel = amountIsValid
    ? `Pay $${numericAmount} USD with ${selectedWallet?.asset ?? "Crypto"}`
    : "Enter Donation Amount";

  function handlePaymentClick() {
    if (!amountIsValid || !selectedWallet) {
      return;
    }

    const paymentUri = getExplorerOrWalletUri(
      selectedWallet,
      numericAmount.toString(),
    );

    window.location.href = paymentUri;
  }

  return (
    <section aria-labelledby="crypto-donation-heading">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#dcede1]">
        Direct Digital Giving
      </p>

      <h2
        id="crypto-donation-heading"
        className="mt-1 text-2xl font-black uppercase tracking-[0.04em] text-[#efe9c7]"
      >
        Give with Crypto
      </h2>

      <p className="mt-2 text-sm leading-relaxed text-[#dcede1]">
        Choose a contribution, select a verified network, then open your
        compatible wallet using the configured destination.
      </p>

      <div className="mt-5">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#dcede1]">
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
                className={`min-h-12 rounded-[14px] border-[2px] text-sm font-black transition-all duration-200 active:translate-y-[2px] ${
                  selected
                    ? "border-[#9de2b4] bg-[#008000] text-[#efe9c7] shadow-[inset_5px_6px_11px_rgba(0,0,0,0.25)]"
                    : "border-[#8fd8a9] bg-[#073b1d] text-[#dcede1] shadow-[7px_8px_14px_rgba(0,0,0,0.34),inset_-2px_-2px_4px_rgba(0,0,0,0.28)] hover:-translate-y-0.5 hover:border-[#9de2b4] hover:text-[#efe9c7]"
                }`}
              >
                ${preset}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setCustom(true)}
            className={`min-h-12 rounded-[14px] border-[2px] text-[11px] font-black uppercase tracking-wider transition-all duration-200 active:translate-y-[2px] ${
              custom
                ? "border-[#9de2b4] bg-[#008000] text-[#efe9c7] shadow-[inset_5px_6px_11px_rgba(0,0,0,0.25)]"
                : "border-[#8fd8a9] bg-[#073b1d] text-[#dcede1] shadow-[7px_8px_14px_rgba(0,0,0,0.34),inset_-2px_-2px_4px_rgba(0,0,0,0.28)] hover:-translate-y-0.5 hover:border-[#9de2b4] hover:text-[#efe9c7]"
            }`}
          >
            Custom
          </button>
        </div>
      </div>

      {custom && (
        <div className="mt-3">
          <label
            htmlFor="crypto-custom-amount"
            className="mb-1.5 block text-[9px] font-black uppercase tracking-[0.18em] text-[#dcede1]"
          >
            Custom donation amount
          </label>

          <div className="flex items-center overflow-hidden rounded-[15px] border-[2px] border-[#8fd8a9] bg-[#eaf7ee]">
            <span className="px-4 text-lg font-black text-[#006b2b]">
              $
            </span>

            <input
              id="crypto-custom-amount"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              inputMode="decimal"
              placeholder="Above $10"
              aria-label="Custom cryptocurrency donation amount"
              className="min-h-12 min-w-0 flex-1 bg-transparent px-2 pr-4 text-sm font-black text-[#12351f] outline-none placeholder:text-[#527561]"
            />
          </div>
        </div>
      )}

      <div className="mt-6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#efe9c7]">
              Crypto wallets
            </p>

            <p className="mt-1 text-xs leading-relaxed text-[#dcede1]">
              Select the network that matches the asset you are sending.
            </p>
          </div>

          {walletsLoading ? (
            <span className="shrink-0 rounded-full border border-[#8fd8a9] bg-[#073b1d] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.12em] text-[#9de2b4]">
              Checking
            </span>
          ) : wallets.length > 0 ? (
            <span className="shrink-0 rounded-full border border-[#9de2b4] bg-[#008000] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.12em] text-white">
              Verified
            </span>
          ) : (
            <span className="shrink-0 rounded-full border border-[#d6a85f] bg-[#4a3517] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.12em] text-[#ffe8b0]">
              Offline
            </span>
          )}
        </div>

        <div className="mt-3 grid gap-3">
          {wallets.length > 0 ? (
            wallets.map((wallet) => {
              const selected = wallet.id === selectedWalletId;

              return (
                <article
                  key={wallet.id}
                  className={`rounded-[20px] border-[3px] p-4 transition-all duration-200 ${
                    selected
                      ? "border-[#9de2b4] bg-[#073b1d]"
                      : "border-[#006b2b] bg-[#073b1d]"
                  }`}
                  style={{
                    boxShadow: selected
                      ? "11px 12px 24px rgba(0,0,0,0.46), inset 2px 2px 5px rgba(255,255,255,0.06)"
                      : "9px 10px 20px rgba(0,0,0,0.40), inset 2px 2px 5px rgba(255,255,255,0.04)",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedWalletId(wallet.id)}
                    className="w-full text-left"
                    aria-pressed={selected}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="flex h-[92px] w-[92px] shrink-0 items-center justify-center rounded-[15px] border-[3px] border-[#dcede1] bg-white p-2"
                        style={{
                          boxShadow:
                            "6px 7px 14px rgba(0,0,0,0.42), inset 1px 1px 3px rgba(0,0,0,0.12)",
                        }}
                      >
                        <img
                          src={wallet.qrImage}
                          alt={`QR code for ${wallet.asset} on ${wallet.network}`}
                          className="h-full w-full rounded-[8px] bg-white object-contain"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#9de2b4]">
                            {wallet.asset}
                          </p>

                          {selected && (
                            <span className="rounded-full border border-[#9de2b4] bg-[#008000] px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.12em] text-white">
                              Selected
                            </span>
                          )}
                        </div>

                        <h3 className="mt-1 text-sm font-black uppercase tracking-[0.08em] text-[#efe9c7]">
                          {wallet.network}
                        </h3>

                        <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#dcede1]">
                          {wallet.standard}
                        </p>

                        <p className="mt-2 break-all text-[10px] leading-relaxed text-[#dcede1]">
                          {wallet.address}
                        </p>
                      </div>
                    </div>
                  </button>
                </article>
              );
            })
          ) : (
            <div
              className="rounded-[20px] border-[3px] border-[#006b2b] bg-[#073b1d] p-4"
              style={{
                boxShadow:
                  "10px 11px 22px rgba(0,0,0,0.42), inset 2px 2px 5px rgba(255,255,255,0.05)",
              }}
            >
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  ["Bitcoin", bitcoinQr],
                  ["Ethereum", ethereumQr],
                  ["Solana", solanaQr],
                  ["TRON", tronQr],
                  ["BNB Smart Chain", bnbSmartChainQr],
                  ["Arbitrum", arbitrumQr],
                ].map(([label, image]) => (
                  <div
                    key={label}
                    className="rounded-[14px] border-[2px] border-[#006b2b] bg-[#0a4623] p-2"
                  >
                    <img
                      src={image}
                      alt={`${label} cryptocurrency donation QR asset`}
                      className="aspect-square w-full rounded-[9px] bg-white object-contain"
                    />

                    <p className="mt-2 text-center text-[8px] font-black uppercase tracking-[0.08em] text-[#efe9c7]">
                      {label}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-center text-[10px] font-black uppercase tracking-[0.14em] text-[#ffe8b0]">
                Live wallet verification is unavailable
              </p>

              <p className="mt-1 text-center text-xs leading-relaxed text-[#fff1c9]">
                QR presentation assets remain available, but no active API
                destination was returned. Do not send funds until a verified
                destination appears.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5">
        <button
          type="button"
          onClick={handlePaymentClick}
          disabled={!amountIsValid || !selectedWallet}
          className={`flex min-h-14 w-full items-center justify-center rounded-[16px] border-[3px] px-5 py-3 text-sm font-black uppercase tracking-[0.12em] transition-all duration-200 ${
            amountIsValid && selectedWallet
              ? "border-[#9de2b4] bg-[#008000] text-white shadow-[9px_10px_19px_rgba(0,0,0,0.40),inset_2px_2px_5px_rgba(255,255,255,0.12)] hover:-translate-y-0.5 hover:bg-[#006b2b] hover:shadow-[11px_13px_23px_rgba(0,0,0,0.46)] active:translate-y-[2px]"
              : "cursor-not-allowed border-[#527561] bg-[#244b35] text-[#8cae9b] opacity-80"
          }`}
        >
          {paymentLabel}
        </button>

        <p className="mt-2 text-center text-[9px] font-bold uppercase tracking-[0.14em] text-[#dcede1]/80">
          Your wallet opens with the verified API destination. The USD amount
          is shown explicitly and is not falsely converted into crypto units.
        </p>
      </div>
    </section>
  );
}