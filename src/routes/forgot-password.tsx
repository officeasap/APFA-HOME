import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { CathedralCard } from "@/components/cathedral";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot Password — Allen Premier Football Academy" },
      { name: "description", content: "Reset your Allen Premier Football Academy account password." },
    ],
  }),
  component: ForgotPassword,
});

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = z.string().trim().email("Invalid email address").max(255).safeParse(email);
    if (!parsed.success) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSent(true);
  }

  return (
    <main className="mx-auto flex w-full max-w-md px-4 py-16">
      <CathedralCard className="w-full">
        <h1 className="engraved-title mb-6 text-2xl uppercase">Forgot Password</h1>
        {sent ? (
          <p className="text-sm text-muted-foreground">
            If an account exists for <strong>{email}</strong>, a reset link is on its way. Check your
            inbox and follow the link.
          </p>
        ) : (
          <form onSubmit={submit} className="grid gap-4">
            <label className="grid gap-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Email
              <input type="email" className="neu-input" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={255} />
            </label>
            <button type="submit" className="btn-firm w-full" disabled={busy}>
              {busy ? "Sending…" : "Send Reset Link"}
            </button>
          </form>
        )}
      </CathedralCard>
    </main>
  );
}
