import { useState } from "react";
import { ChevronDown } from "lucide-react";

import {
  FIAT_CURRENCIES,
  type FiatCurrency,
} from "@/lib/donations";

const PRESET_AMOUNTS = ["1", "5", "10"];

const SYMBOLS: Record<FiatCurrency, string> = {
  NGN: "₦",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

export function FiatDonation() {
  const [currency, setCurrency] = useState<FiatCurrency>("USD");
  const [amount, setAmount] = useState("5");
  const [custom, setCustom] = useState(false);

  const symbol = SYMBOLS[currency];

  return (
    <section aria-labelledby="fiat-donation-heading">
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
        Conventional Giving
      </p>

      <h2
        id="fiat-donation-heading"
        className="engraved-title mt-1 text-2xl uppercase"
      >
        Give with Fiat
      </h2>

      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Choose a contribution and currency. The secure fiat payment facility
        will be connected here.
      </p>

      <div className="mt-5">
        <label
          htmlFor="donation-currency"
          className="text-[10px] font-bold uppercase tracking-[0.18em]"
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
            className="min-h-12 w-full appearance-none rounded-[15px] border-2 border-[var(--primary-dark)]/15 bg-[var(--card)] px-4 text-sm font-semibold outline-none"
            style={{
              boxShadow:
                "inset 5px 6px 12px rgba(30,25,20,0.22), inset -2px -2px 4px rgba(0,0,0,0.35)",
            }}
          >
            {FIAT_CURRENCIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <ChevronDown
            size={17}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-primary"
          />
        </div>
      </div>

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
                className={`min-h-12 rounded-[14px] border-2 text-sm font-bold transition-transform active:translate-y-[2px] ${
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
                {symbol}
                {preset}
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
        <div className="mt-3">
          <label
            htmlFor="donation-amount"
            className="text-[10px] font-bold uppercase tracking-[0.18em]"
          >
            Custom amount
          </label>

          <div className="relative mt-2">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-primary">
              {symbol}
            </span>

            <input
              id="donation-amount"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              inputMode="decimal"
              placeholder="Above 10"
              className="min-h-12 w-full rounded-[15px] border-2 border-[var(--primary-dark)]/15 bg-[var(--card)] pl-9 pr-4 text-sm font-semibold outline-none"
              style={{
                boxShadow:
                  "inset 5px 6px 12px rgba(30,25,20,0.22), inset -2px -2px 4px rgba(0,0,0,0.35)",
              }}
            />
          </div>
        </div>
      )}

      <button
        type="button"
        disabled={!amount.trim()}
        className="mt-5 min-h-12 w-full rounded-[15px] border-2 border-[var(--primary-dark)] bg-[#00551f] text-xs font-bold uppercase tracking-[0.13em] text-white disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          boxShadow:
            "7px 8px 15px rgba(30,25,20,0.30), inset 2px 2px 5px rgba(0,0,0,0.12)",
        }}
      >
        Continue with {symbol}
        {amount || "0"}
      </button>

      <p className="mt-3 text-center text-[10px] uppercase tracking-wider text-muted-foreground">
        Secure fiat processing will be connected during the fiat integration phase.
      </p>
    </section>
  );
}