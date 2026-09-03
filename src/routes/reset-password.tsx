import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CathedralCard } from "@/components/cathedral";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset Password — Allen Premier Football Academy" },
      { name: "description", content: "Set a new password for your Allen Premier Football Academy account." },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) setReady(true);
    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated. You are signed in.");
    navigate({ to: "/dashboard" });
  }

  return (
    <main className="mx-auto flex w-full max-w-md px-4 py-16">
      <CathedralCard className="w-full">
        <h1 className="engraved-title mb-6 text-2xl uppercase">Reset Password</h1>
        {ready ? (
          <form onSubmit={submit} className="grid gap-4">
            <label className="grid gap-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              New password
              <input type="password" className="neu-input" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} maxLength={72} />
            </label>
            <label className="grid gap-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Confirm new password
              <input type="password" className="neu-input" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={6} maxLength={72} />
            </label>
            <button type="submit" className="btn-firm w-full" disabled={busy}>
              {busy ? "Updating…" : "Reset Password"}
            </button>
          </form>
        ) : (
          <p className="text-sm text-muted-foreground">
            This page must be opened from the reset link in your email. Request a new link from the
            forgot password page.
          </p>
        )}
      </CathedralCard>
    </main>
  );
}
