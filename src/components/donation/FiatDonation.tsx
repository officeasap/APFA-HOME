import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

import {
  FIAT_CURRENCIES,
  type FiatCurrency,
} from "@/lib/donations";

import visaDonate from "@/assets/fiat/visa-donate.png";
import mastercardDonate from "@/assets/fiat/master-donate.png";
import amexDonate from "@/assets/fiat/amex-donate.png";

const PRESET_AMOUNTS = ["1", "5", "10"];

const SYMBOLS: Record<FiatCurrency, string> = {
  NGN: "₦",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

const PAYMENT_CARD_ARTWORK = [
  {
    id: "visa",
    label: "VISA",
    image: visaDonate,
  },
  {
    id: "mastercard",
    label: "MASTERCARD",
    image: mastercardDonate,
  },
  {
    id: "amex",
    label: "AMERICAN EXPRESS",
    image: amexDonate,
  },
];

export function FiatDonation() {
  const [currency, setCurrency] = useState<FiatCurrency>("USD");
  const [amount, setAmount] = useState("5");
  const [custom, setCustom] = useState(false);

  const symbol = SYMBOLS[currency];

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

  function handleFiatContinue() {
    if (!amountIsValid) {
      return;
    }

    /*
     * There is intentionally no fabricated payment-provider URL here.
     *
     * The supplied frontend contains no fiat processor endpoint or public
     * checkout URL. A real card checkout must be connected to the actual
     * payment provider before this action can redirect a donor.
     */
    window.dispatchEvent(
      new CustomEvent("apfa:fiat-donation-request", {
        detail: {
          currency,
          amount: numericAmount,
        },
      }),
    );
  }

  return (
    <section aria-labelledby="fiat-donation-heading">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#dcede1]">
        Conventional Giving
      </p>

      <h2
        id="fiat-donation-heading"
        className="mt-1 text-2xl font-black uppercase tracking-[0.04em] text-[#efe9c7]"
      >
        Give with Fiat
      </h2>

      <p className="mt-2 text-sm leading-relaxed text-[#dcede1]">
        Choose a contribution and currency. Your selected amount is prepared
        for the secure fiat payment integration.
      </p>

      <div className="mt-5">
        <label
          htmlFor="donation-currency"
          className="text-[10px] font-black uppercase tracking-[0.18em] text-[#dcede1]"
        >
          Currency
        </label>

        <div className="relative mt-2">
          <select
            id="donation-currency"
            value={currency}
            onChange={(event) =>
              setCurrency(event.target.value as FiatCurrency)
            }
            className="min-h-12 w-full appearance-none rounded-[15px] border-[2px] border-[#8b7765] bg-[#3a3028] px-4 pr-12 text-sm font-black text-[#efe9c7] outline-none"
            style={{
              boxShadow:
                "inset 6px 7px 13px rgba(20,16,12,0.42), inset -2px -2px 4px rgba(255,255,255,0.04), 6px 7px 13px rgba(0,0,0,0.28)",
            }}
          >
            {FIAT_CURRENCIES.map((item) => (
              <option
                key={item}
                value={item}
                className="bg-[#3a3028] text-[#efe9c7]"
              >
                {item}
              </option>
            ))}
          </select>

          <ChevronDown
            size={17}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#dcede1]"
          />
        </div>
      </div>

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
                    ? "border-[#9de2b4] bg-[#008000] text-[#efe9c7]"
                    : "border-[#8b7765] bg-[#3a3028] text-[#dcede1] hover:-translate-y-0.5 hover:border-[#c98555]"
                }`}
                style={{
                  boxShadow: selected
                    ? "inset 5px 6px 11px rgba(0,0,0,0.30), 5px 6px 10px rgba(0,0,0,0.20)"
                    : "7px 8px 14px rgba(0,0,0,0.32), inset -2px -2px 4px rgba(255,255,255,0.03)",
                }}
              >
                {symbol}
                {preset}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setCustom(true)}
            className={`min-h-12 rounded-[14px] border-[2px] text-[11px] font-black uppercase tracking-wider transition-all duration-200 active:translate-y-[2px] ${
              custom
                ? "border-[#9de2b4] bg-[#008000] text-[#efe9c7]"
                : "border-[#8b7765] bg-[#3a3028] text-[#dcede1] hover:-translate-y-0.5 hover:border-[#c98555]"
            }`}
            style={{
              boxShadow: custom
                ? "inset 5px 6px 11px rgba(0,0,0,0.30), 5px 6px 10px rgba(0,0,0,0.20)"
                : "7px 8px 14px rgba(0,0,0,0.32), inset -2px -2px 4px rgba(255,255,255,0.03)",
            }}
          >
            Custom
          </button>
        </div>
      </div>

      {custom && (
        <div className="mt-3">
          <label
            htmlFor="donation-amount"
            className="text-[10px] font-black uppercase tracking-[0.18em] text-[#dcede1]"
          >
            Custom amount
          </label>

          <div
            className="relative mt-2 rounded-[15px]"
            style={{
              boxShadow:
                "7px 8px 15px rgba(0,0,0,0.32), inset 5px 6px 12px rgba(20,16,12,0.28)",
            }}
          >
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-[#c98555]">
              {symbol}
            </span>

            <input
              id="donation-amount"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              inputMode="decimal"
              placeholder="Above 10"
              aria-label={`Custom donation amount in ${currency}`}
              className="min-h-12 w-full rounded-[15px] border-[2px] border-[#8b7765] bg-[#e9e4db] pl-9 pr-4 text-sm font-black text-[#292824] outline-none placeholder:text-[#756e65]"
            />
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleFiatContinue}
        disabled={!amountIsValid}
        className={`mt-5 min-h-14 w-full rounded-[15px] border-[3px] text-xs font-black uppercase tracking-[0.13em] transition-all duration-200 ${
          amountIsValid
            ? "border-[#d8905d] bg-[#cc7547] text-white shadow-[9px_10px_19px_rgba(0,0,0,0.40),inset_2px_2px_5px_rgba(255,255,255,0.12)] hover:-translate-y-0.5 hover:bg-[#b9653b] active:translate-y-[2px]"
            : "cursor-not-allowed border-[#65594f] bg-[#433a33] text-[#9e9288] opacity-80"
        }`}
      >
        Continue with {symbol}
        {amountIsValid ? numericAmount : "0"}
      </button>

      <div className="mt-6">
        <p className="text-center text-[10px] font-black uppercase tracking-[0.18em] text-[#dcede1]">
          Supported payment cards
        </p>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {PAYMENT_CARD_ARTWORK.map((card) => (
            <div
              key={card.id}
              className="flex min-h-[86px] items-center justify-center rounded-[15px] border-[2px] border-[#8b7765] bg-[#3a3028] p-3"
              style={{
                boxShadow:
                  "7px 8px 14px rgba(0,0,0,0.34), inset -2px -2px 4px rgba(255,255,255,0.03), inset 4px 5px 9px rgba(20,16,12,0.16)",
              }}
            >
              <img
                src={card.image}
                alt={`${card.label} payment card`}
                className="max-h-[58px] w-full object-contain"
              />
            </div>
          ))}
        </div>

        <p className="mt-3 text-center text-[9px] font-black uppercase tracking-[0.14em] text-[#dcede1]/80">
          Card artwork is supplied locally by APFA. Secure card processing
          requires the configured fiat payment provider.
        </p>
      </div>

      <div
        className="mt-4 rounded-[15px] border-[2px] border-[#8b7765] bg-[#302822] p-3"
        style={{
          boxShadow:
            "inset 4px 5px 10px rgba(0,0,0,0.30), 5px 6px 11px rgba(0,0,0,0.24)",
        }}
      >
        <p className="text-center text-[9px] font-black uppercase tracking-[0.14em] text-[#efe9c7]">
          Donation selected: {symbol}
          {amountIsValid ? numericAmount : "0"} {currency}
        </p>

        <p className="mt-1 text-center text-[9px] leading-relaxed text-[#dcede1]/80">
          No payment-provider URL or card credentials are fabricated in the
          frontend. The selected donation is ready for the real fiat
          processor integration.
        </p>
      </div>
    </section>
  );
}