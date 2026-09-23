import { ShieldCheck } from "lucide-react";

export function DonationTrustPanel() {
  return (
    <aside
      className="rounded-[17px] border-2 border-[var(--primary-dark)]/35 bg-[var(--card)] p-4"
      style={{
        boxShadow:
          "7px 8px 15px rgba(30,25,20,0.22), inset 4px 5px 10px rgba(30,25,20,0.12)",
      }}
    >
      <div className="flex items-center gap-3">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[13px] text-primary"
          style={{
            boxShadow:
              "inset 4px 5px 9px rgba(30,25,20,0.18), inset -2px -2px 4px rgba(255,255,255,0.5)",
          }}
        >
          <ShieldCheck size={23} />
        </span>

        <div>
          <h2 className="engraved-title text-base uppercase">
            Your Support Matters
          </h2>

          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Donations support APFA and remain separate from educational access,
            subscriptions and account status.
          </p>
        </div>
      </div>
    </aside>
  );
}