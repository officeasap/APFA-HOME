import { useNavigate } from "react-router-dom";
import { Check, ShieldCheck } from "lucide-react";

import { CathedralCard, PageShell } from "@/components/cathedral";
import { useAuth } from "@/hooks/useAuth";

const ACCESS_PERKS = [
  "Full Education Hub access",
  "All available APFA subjects",
  "All available APFA courses",
  "All available APFA lessons",
  "Access remains free",
  "No recurring payment required",
];

export function Subscription() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <PageShell
        title="Education Access"
        intro="Sign in to view your Allen Premier Football Academy education entitlement."
      >
        <CathedralCard className="mx-auto max-w-2xl">
          <div className="grid gap-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full cathedral-press">
              <ShieldCheck
                size={32}
                className="text-primary"
              />
            </div>

            <div>
              <h2 className="engraved-title text-xl uppercase">
                Member Access
              </h2>

              <p className="mt-3 text-sm text-muted-foreground">
                Your Education Hub access is tied to your APFA
                membership. Sign in to continue.
              </p>
            </div>

            <button
              type="button"
              className="btn-firm w-full"
              onClick={() => navigate("/auth")}
            >
              Sign In
            </button>
          </div>
        </CathedralCard>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Education Access"
      intro="Your Allen Premier Football Academy Education Hub access is active."
    >
      <div className="mx-auto grid max-w-4xl gap-8">
        <CathedralCard>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full cathedral-press">
                <ShieldCheck
                  size={28}
                  className="text-primary"
                />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-accent">
                  Education entitlement
                </p>

                <h2 className="engraved-title mt-1 text-2xl uppercase">
                  Active
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  {user.fullName
                    ? `${user.fullName}, your`
                    : "Your"}{" "}
                  APFA Education Hub access is active.
                </p>
              </div>
            </div>

            <div className="display text-3xl text-primary">
              FREE
            </div>
          </div>
        </CathedralCard>

        <CathedralCard>
          <div className="grid gap-6">
            <div>
              <h2 className="engraved-title text-xl uppercase">
                Your Access
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Every valid APFA registration receives full
                educational access without a subscription fee.
              </p>
            </div>

            <ul className="grid gap-3">
              {ACCESS_PERKS.map((perk) => (
                <li
                  key={perk}
                  className="flex items-center gap-3 text-sm"
                >
                  <Check
                    size={18}
                    className="shrink-0 text-primary"
                  />

                  <span>{perk}</span>
                </li>
              ))}
            </ul>
          </div>
        </CathedralCard>

        <CathedralCard>
          <div className="grid gap-4">
            <h2 className="engraved-title text-xl uppercase">
              Cathedral Entitlement Law
            </h2>

            <p className="text-sm leading-6 text-muted-foreground">
              Your subscription record exists to establish
              educational entitlement. It is not a payment,
              purchase, or premium-tier system.
            </p>

            <p className="text-sm leading-6 text-muted-foreground">
              QR confirmation is used for verification and
              confirmation. It does not replace authentication
              and does not independently grant access.
            </p>

            <p className="text-sm leading-6 text-muted-foreground">
              Your authenticated APFA account remains the
              identity authority for your educational access.
            </p>
          </div>
        </CathedralCard>
      </div>
    </PageShell>
  );
}