import { Link } from "react-router-dom";

import {
  CathedralCard,
  FootballMark,
} from "@/components/cathedral";



export function ResetPassword() {
  return (
    <main className="mx-auto flex w-full max-w-md px-4 py-16">
      <CathedralCard className="w-full">
        <div className="mb-6 flex items-center gap-4">
          <FootballMark className="h-12 w-12 shrink-0" />

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Account Security
            </p>

            <h1 className="engraved-title text-2xl uppercase">
              Reset Password
            </h1>
          </div>
        </div>

        <div className="mb-6 h-px w-full bg-border" />

        <p className="text-sm leading-7 text-muted-foreground">
          Password reset is not yet activated in the canonical APFA
          authentication system.
        </p>

        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          The secure reset flow will be introduced together with the
          sovereign account-security and Cathedral mail
          infrastructure. No third-party authentication or email
          provider will be used.
        </p>

        <div className="mt-8 grid gap-3">
          <Link
            to="/forgot-password"
            className="btn-firm block w-full text-center text-xs"
          >
            Password Recovery
          </Link>

          <Link
            to="/auth"
            className="btn-quiet block w-full text-center text-xs"
          >
            Return to Sign In
          </Link>
        </div>
      </CathedralCard>
    </main>
  );
}