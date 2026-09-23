import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { CathedralCard } from "@/components/cathedral";
import { useAuth } from "@/hooks/useAuth";
import { ApiError, login, register } from "@/lib/api";

const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address").max(255),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(72),
});

const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Name is required")
      .max(100),

    email: z.string().trim().email("Invalid email address").max(255),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(72),

    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    if (error.code === "P2002") {
      return "An account with this email already exists.";
    }

    if (error.status === 401) {
      return "Email or password is incorrect.";
    }

    if (error.status === 429) {
      return "Too many requests. Please try again later.";
    }

    return error.message;
  }

  return fallback;
}

export function Auth() {
  const { user, loading, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [busy, setBusy] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [regForm, setRegForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirm: "",
  });

  useEffect(() => {
    if (!loading && user) {
      void navigate("/dashboard", { replace: true });
    }
  }, [loading, user, navigate]);

  async function doLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = loginSchema.safeParse(loginForm);

    if (!parsed.success) {
      toast.error(
        parsed.error.issues[0]?.message ?? "Invalid input",
      );
      return;
    }

    setBusy(true);

    try {
      await login(parsed.data);
      await refreshUser();

      toast.success("Welcome back!");

      await navigate("/dashboard");
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Sign in failed. Please try again.",
        ),
      );
    } finally {
      setBusy(false);
    }
  }

  async function doRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = registerSchema.safeParse(regForm);

    if (!parsed.success) {
      toast.error(
        parsed.error.issues[0]?.message ?? "Invalid input",
      );
      return;
    }

    setBusy(true);

    try {
      await register({
        email: parsed.data.email,
        password: parsed.data.password,
        fullName: parsed.data.fullName,
      });

      await refreshUser();

      toast.success(
        "Account created. Welcome to Allen Premier.",
      );

      await navigate("/dashboard");
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Account creation failed. Please try again.",
        ),
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex w-full min-w-0 justify-center px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex w-full min-w-0 max-w-lg flex-col items-center">
        {/* OFFICIAL APFA LOGO */}
        <Link
          to="/"
          aria-label="Allen Premier Football Academy home"
          className="mb-8 flex h-28 w-28 shrink-0 items-center justify-center"
        >
          <img
            src="/Allen-Premier-Football-Academy-Logo.png"
            alt="Allen Premier Football Academy official logo"
            className="h-full w-full object-contain drop-shadow"
            width={512}
            height={512}
          />
        </Link>

        {/* AUTH SURFACE */}
        <CathedralCard className="w-full min-w-0">
          <div className="mb-6 grid w-full grid-cols-2 gap-2">
            {(["login", "register"] as const).map((entryMode) => (
              <button
                key={entryMode}
                type="button"
                onClick={() => setMode(entryMode)}
                className={`min-w-0 rounded-[12px_12px_4px_4px] px-3 py-3 text-xs font-bold uppercase tracking-widest ${
                  mode === entryMode ? "btn-firm" : "btn-quiet"
                }`}
              >
                {entryMode === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          {mode === "login" ? (
            <form
              onSubmit={doLogin}
              className="grid w-full min-w-0 gap-5"
            >
              <label className="grid min-w-0 gap-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Email

                <input
                  type="email"
                  className="neu-input w-full min-w-0"
                  value={loginForm.email}
                  onChange={(event) =>
                    setLoginForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  required
                  maxLength={255}
                  autoComplete="email"
                />
              </label>

              <label className="grid min-w-0 gap-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Password

                <input
                  type="password"
                  className="neu-input w-full min-w-0"
                  value={loginForm.password}
                  onChange={(event) =>
                    setLoginForm((current) => ({
                      ...current,
                      password: event.target.value,
                    }))
                  }
                  required
                  maxLength={72}
                  autoComplete="current-password"
                />
              </label>

              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-xs font-bold text-primary transition-colors hover:text-accent"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="btn-firm w-full"
                disabled={busy}
              >
                {busy ? "Signing in…" : "Sign In"}
              </button>
            </form>
          ) : (
            <form
              onSubmit={doRegister}
              className="grid w-full min-w-0 gap-5"
            >
              <label className="grid min-w-0 gap-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Full name

                <input
                  className="neu-input w-full min-w-0"
                  value={regForm.fullName}
                  onChange={(event) =>
                    setRegForm((current) => ({
                      ...current,
                      fullName: event.target.value,
                    }))
                  }
                  required
                  maxLength={100}
                  autoComplete="name"
                />
              </label>

              <label className="grid min-w-0 gap-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Email

                <input
                  type="email"
                  className="neu-input w-full min-w-0"
                  value={regForm.email}
                  onChange={(event) =>
                    setRegForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  required
                  maxLength={255}
                  autoComplete="email"
                />
              </label>

              <label className="grid min-w-0 gap-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Password

                <input
                  type="password"
                  className="neu-input w-full min-w-0"
                  value={regForm.password}
                  onChange={(event) =>
                    setRegForm((current) => ({
                      ...current,
                      password: event.target.value,
                    }))
                  }
                  required
                  maxLength={72}
                  autoComplete="new-password"
                />
              </label>

              <label className="grid min-w-0 gap-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Confirm password

                <input
                  type="password"
                  className="neu-input w-full min-w-0"
                  value={regForm.confirm}
                  onChange={(event) =>
                    setRegForm((current) => ({
                      ...current,
                      confirm: event.target.value,
                    }))
                  }
                  required
                  maxLength={72}
                  autoComplete="new-password"
                />
              </label>

              <button
                type="submit"
                className="btn-firm w-full"
                disabled={busy}
              >
                {busy ? "Creating…" : "Create Account"}
              </button>
            </form>
          )}

          <div className="mt-6 flex w-full min-w-0 items-center gap-3">
            <div className="h-px min-w-0 flex-1 bg-border" />

            <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Secure Member Access
            </span>

            <div className="h-px min-w-0 flex-1 bg-border" />
          </div>
        </CathedralCard>
      </div>
    </main>
  );
}