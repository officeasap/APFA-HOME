
import { useState } from "react";
import { Heart } from "lucide-react";

import { DonationMethodSelector } from "@/components/donation/DonationMethodSelector";
import { FiatDonation } from "@/components/donation/FiatDonation";
import { CryptoDonation } from "@/components/donation/CryptoDonation";
import { DonationTrustPanel } from "@/components/donation/DonationTrustPanel";
import type { DonationMethod } from "@/lib/donations";

export function Donate() {
  const [method, setMethod] = useState<DonationMethod>("fiat");

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-[500px]">
        <section className="mb-7 text-center">
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-[18px] border-[3px] border-[var(--primary-dark)] bg-[var(--card)] text-[var(--primary-dark)]"
            style={{
              boxShadow:
                "7px 8px 16px rgba(30,25,20,0.28), inset 2px 2px 5px rgba(30,25,20,0.10)",
            }}
          >
            <Heart size={29} fill="currentColor" />
          </div>

          <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.28em] text-primary">
            Support Allen Premier
          </p>

          <h1 className="display mt-2 text-4xl uppercase leading-[0.95] text-foreground sm:text-5xl">
            Help Build the Future
          </h1>

          <p className="mx-auto mt-4 max-w-[430px] text-sm leading-relaxed text-muted-foreground">
            Your voluntary support helps Allen Premier Football Academy create
            opportunities for young people through football, discipline and
            structured education.
          </p>
        </section>

        <section
          className="rounded-[24px] border-[3px] border-[var(--primary-dark)] bg-[var(--card)] p-4 sm:p-5"
          style={{
            boxShadow:
              "14px 14px 30px rgba(30,25,20,0.36), inset 3px 3px 8px rgba(30,25,20,0.08)",
          }}
        >
          <DonationMethodSelector
            method={method}
            onChange={setMethod}
          />

          <div className="mt-5 border-t border-[var(--primary-dark)]/10 pt-5">
            {method === "fiat" ? <FiatDonation /> : <CryptoDonation />}
          </div>

          <p className="mt-5 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Your donation makes a real difference
          </p>
        </section>

        <div className="mt-5">
          <DonationTrustPanel />
        </div>
      </div>
    </main>
  );
}

