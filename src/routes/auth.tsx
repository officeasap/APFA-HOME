import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { CathedralCard } from "@/components/cathedral";
import logo from "@/assets/apfa-logo.png.asset.json";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — Allen Premier Football Academy" },
      { name: "description", content: "Sign in or create your free Allen Premier Football Academy member account." },
    ],
  }),
  component: Auth,
});

const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, "Name is required").max(100),
    email: z.string().trim().email("Invalid email address").max(255),
    phone: z.string().trim().max(20).optional(),
    password: z.string().min(6, "Password must be at least 6 characters").max(72),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, { message: "Passwords do not match" });

function Auth() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [busy, setBusy] = useState(false);
  const [confirmSent, setConfirmSent] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState({ fullName: "", email: "", phone: "", password: "", confirm: "" });

  useEffect(() => {
    if (!loading && user) navigate({ to: "/dashboard", replace: true });
  }, [loading, user, navigate]);

  async function doLogin(e: React.FormEvent) {
    e.preventDefault();
    const parsed = loginSchema.safeParse(loginForm);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setBusy(false);
    if (error) {
      toast.error(error.message === "Invalid login credentials" ? "Email or password is incorrect." : error.message);
      return;
    }
    toast.success("Welcome back!");
    navigate({ to: "/dashboard" });
  }

  async function doRegister(e: React.FormEvent) {
    e.preventDefault();
    const parsed = registerSchema.safeParse(regForm);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: parsed.data.fullName, phone: parsed.data.phone ?? "" },
      },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setConfirmSent(true);
  }

  async function doGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) toast.error("Google sign-in failed. Please try email sign-in.");
  }


  return (
    <main className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-16">
      <span className="neu-circle mb-8 flex h-24 w-24 items-center justify-center p-3">
        <img src={logo.url} alt="Allen Premier Football Academy crest" className="h-full w-full object-contain" />
      </span>

      {confirmSent ? (
        <CathedralCard className="w-full text-center">
          <h1 className="engraved-title text-2xl uppercase">Check Your Email</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            We sent a confirmation link to <strong>{regForm.email}</strong>. Confirm your address,
            then sign in.
          </p>
          <button type="button" className="btn-firm mt-6 text-xs" onClick={() => { setConfirmSent(false); setMode("login"); }}>
            Go to Sign In
          </button>
        </CathedralCard>
      ) : (
        <CathedralCard className="w-full">
          <div className="mb-6 grid grid-cols-2 gap-2">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`rounded-[12px_12px_4px_4px] py-2 text-xs font-bold uppercase tracking-widest ${mode === m ? "btn-firm" : "btn-quiet"}`}
              >
                {m === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          {mode === "login" ? (
            <form onSubmit={doLogin} className="grid gap-4">
              <label className="grid gap-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Email
                <input type="email" className="neu-input" value={loginForm.email} onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))} required maxLength={255} />
              </label>
              <label className="grid gap-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Password
                <input type="password" className="neu-input" value={loginForm.password} onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))} required maxLength={72} />
              </label>
              <Link to="/forgot-password" className="text-xs font-bold text-primary">
                Forgot password?
              </Link>
              <button type="submit" className="btn-firm w-full" disabled={busy}>
                {busy ? "Signing in…" : "Sign In"}
              </button>
            </form>
          ) : (
            <form onSubmit={doRegister} className="grid gap-4">
              <label className="grid gap-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Full name
                <input className="neu-input" value={regForm.fullName} onChange={(e) => setRegForm((f) => ({ ...f, fullName: e.target.value }))} required maxLength={100} />
              </label>
              <label className="grid gap-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Email
                <input type="email" className="neu-input" value={regForm.email} onChange={(e) => setRegForm((f) => ({ ...f, email: e.target.value }))} required maxLength={255} />
              </label>
              <label className="grid gap-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Phone (optional)
                <input className="neu-input" value={regForm.phone} onChange={(e) => setRegForm((f) => ({ ...f, phone: e.target.value }))} maxLength={20} />
              </label>
              <label className="grid gap-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Password
                <input type="password" className="neu-input" value={regForm.password} onChange={(e) => setRegForm((f) => ({ ...f, password: e.target.value }))} required maxLength={72} />
              </label>
              <label className="grid gap-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Confirm password
                <input type="password" className="neu-input" value={regForm.confirm} onChange={(e) => setRegForm((f) => ({ ...f, confirm: e.target.value }))} required maxLength={72} />
              </label>
              <button type="submit" className="btn-firm w-full" disabled={busy}>
                {busy ? "Creating…" : "Create Account"}
              </button>
            </form>
          )}

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <button type="button" onClick={doGoogle} className="btn-quiet w-full text-xs" disabled={busy}>
            Continue with Google
          </button>
        </CathedralCard>
      )}
    </main>
  );
}
