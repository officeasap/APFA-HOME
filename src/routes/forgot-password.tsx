import { Link } from "react-router-dom";
import { CathedralCard, FootballMark } from "@/components/cathedral";



export function ForgotPassword() {
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
              Forgot Password
            </h1>
          </div>
        </div>

        <div className="mb-6 h-px w-full bg-border" />

        <p className="text-sm leading-7 text-muted-foreground">
          Password recovery will be activated as part of the
          sovereign APFA account-security and Cathedral mail
          infrastructure.
        </p>

        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          Your account authentication remains protected by the
          canonical APFA server-side session system.
        </p>

        <div className="mt-8">
          <Link
            to="/auth"
            className="btn-firm block w-full text-center text-xs"
          >
            Return to Sign In
          </Link>
        </div>
      </CathedralCard>
    </main>
  );
}