import { Banknote, Bitcoin } from "lucide-react";

import type { DonationMethod } from "@/lib/donations";

type DonationMethodSelectorProps = {
  method: DonationMethod;
  onChange: (method: DonationMethod) => void;
};

export function DonationMethodSelector({
  method,
  onChange,
}: DonationMethodSelectorProps) {
  return (
    <div
      className="grid grid-cols-2 gap-3"
      role="tablist"
      aria-label="Donation method"
    >
      <button
        type="button"
        role="tab"
        aria-selected={method === "fiat"}
        onClick={() => onChange("fiat")}
        className={`min-h-[68px] rounded-[17px] border-2 px-3 py-3 text-left transition-transform active:translate-y-[2px] ${
          method === "fiat"
            ? "border-[var(--primary-dark)] bg-[var(--card)]"
            : "border-[var(--primary-dark)]/20 bg-[var(--card)]"
        }`}
        style={{
          boxShadow:
            method === "fiat"
              ? "inset 5px 6px 12px rgba(30,25,20,0.24), inset -2px -2px 4px rgba(30,25,20,0.08)"
              : "6px 7px 14px rgba(30,25,20,0.25), inset -2px -2px 4px rgba(0,0,0,0.35)",
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] text-primary"
            style={{
              boxShadow:
                "inset 4px 5px 9px rgba(30,25,20,0.18), inset -2px -2px 4px rgba(255,255,255,0.5)",
            }}
          >
            <Banknote size={23} />
          </span>

          <span>
            <span className="display block text-base uppercase text-accent">
              Fiat
            </span>
            <span className="block text-[11px] text-muted-foreground">
              Card / currency
            </span>
          </span>
        </div>
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={method === "crypto"}
        onClick={() => onChange("crypto")}
        className={`min-h-[68px] rounded-[17px] border-2 px-3 py-3 text-left transition-transform active:translate-y-[2px] ${
          method === "crypto"
            ? "border-[var(--primary-dark)] bg-[#00551f] text-white"
            : "border-[var(--primary-dark)]/20 bg-[var(--card)]"
        }`}
        style={{
          boxShadow:
            method === "crypto"
              ? "7px 8px 15px rgba(30,25,20,0.30), inset 2px 2px 5px rgba(0,0,0,0.12)"
              : "6px 7px 14px rgba(30,25,20,0.25), inset -2px -2px 4px rgba(0,0,0,0.35)",
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] ${
              method === "crypto" ? "text-white" : "text-primary"
            }`}
            style={{
              boxShadow:
                "inset 4px 5px 9px rgba(30,25,20,0.18), inset -2px -2px 4px rgba(0,0,0,0.16)",
            }}
          >
            <Bitcoin size={24} />
          </span>

          <span>
            <span className="display block text-base uppercase">
              Crypto
            </span>
            <span
              className={`block text-[11px] ${
                method === "crypto"
                  ? "text-white/80"
                  : "text-muted-foreground"
              }`}
            >
              Direct wallet giving
            </span>
          </span>
        </div>
      </button>
    </div>
  );
}