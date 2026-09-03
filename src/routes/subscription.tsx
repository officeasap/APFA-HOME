import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { CathedralCard, PageShell } from "@/components/cathedral";

export const Route = createFileRoute("/subscription")({
  head: () => ({
    meta: [
      { title: "Membership Plans — Allen Premier Football Academy" },
      { name: "description", content: "Free, Premium and Elite membership plans for the Allen Premier Football Academy Education Hub." },
      { property: "og:title", content: "Membership Plans — Allen Premier Football Academy" },
      { property: "og:description", content: "Free, Premium and Elite membership plans for the Education Hub." },
    ],
  }),
  component: Subscription,
});

const PLANS = [
  { id: "FREE", name: "Free", price: "₦0", perks: ["Basic access to the Education Hub", "5 core subjects", "Screening registration"] },
  { id: "PREMIUM", name: "Premium", price: "₦5,000/mo", perks: ["Full course library", "AI tutor support", "Quiz certificates", "Priority trial feedback"] },
  { id: "ELITE", name: "Elite", price: "₦15,000/mo", perks: ["Everything in Premium", "1-on-1 coaching reviews", "European trial pathway", "Personal development plan"] },
];

function Subscription() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState<string | null>(null);

  const { data: current } = useQuery({
    queryKey: ["subscription", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("subscriptions").select("*").eq("user_id", user!.id).maybeSingle();
      return data;
    },
  });

  async function choose(plan: string) {
    if (!user) {
      toast.info("Sign in first to choose a plan.");
      navigate({ to: "/auth" });
      return;
    }
    setBusy(plan);
    const { error } = await supabase.from("subscriptions").upsert(
      { user_id: user.id, plan, status: "ACTIVE", start_date: new Date().toISOString() },
      { onConflict: "user_id" },
    );
    setBusy(null);
    if (error) {
      toast.error("Could not update your plan. Please try again.");
      return;
    }
    toast.success(`Plan updated to ${plan}.`);
    queryClient.invalidateQueries({ queryKey: ["subscription", user.id] });
  }

  return (
    <PageShell title="Membership Plans" intro="Every plan includes the Education Hub. Upgrade to unlock the full academy experience.">
      <div className="grid gap-10 md:grid-cols-3">
        {PLANS.map((p) => {
          const active = current?.plan === p.id;
          return (
            <CathedralCard key={p.id} className="flex flex-col">
              <h2 className="engraved-title text-xl uppercase">{p.name}</h2>
              <p className="display mt-2 text-3xl text-primary">{p.price}</p>
              <div className="my-4 h-px w-full bg-border" />
              <ul className="mb-8 grid gap-2">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-2 text-sm">
                    <Check size={16} className="shrink-0 text-primary" />
                    {perk}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <button
                  type="button"
                  className="btn-firm w-full text-xs"
                  disabled={busy !== null || active}
                  onClick={() => choose(p.id)}
                >
                  {active ? "Current Plan" : busy === p.id ? "Updating…" : "Subscribe Now"}
                </button>
              </div>
            </CathedralCard>
          );
        })}
      </div>
    </PageShell>
  );
}
