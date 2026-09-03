import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { CathedralCard, PageShell } from "@/components/cathedral";
import advert from "@/assets/apfa-advert.png.asset.json";

export const Route = createFileRoute("/screening")({
  head: () => ({
    meta: [
      { title: "Screening Competition — Allen Premier Football Academy" },
      { name: "description", content: "Free screening trials for Under 15, Under 16 and Under 17 players, 10th–15th September 2026 at NIPOST, Egor, Benin City." },
      { property: "og:title", content: "Screening Competition — Allen Premier Football Academy" },
      { property: "og:description", content: "Free trials, 10th–15th September 2026, NIPOST, Egor, Benin City." },
    ],
  }),
  component: Screening,
});

const schema = z.object({
  full_name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255).or(z.literal("")),
  phone: z.string().trim().min(7).max(20),
  age_group: z.enum(["UNDER 15", "UNDER 16", "UNDER 17"]),
  date_of_birth: z.string().optional(),
  position: z.string().trim().max(50).optional(),
  guardian_name: z.string().trim().max(100).optional(),
});

function Screening() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    age_group: "UNDER 15" as const,
    date_of_birth: "",
    position: "",
    guardian_name: "",
  });
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error("Please check the form — some fields are missing or invalid.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("screening_registrations").insert({
      ...parsed.data,
      email: parsed.data.email || null,
      date_of_birth: parsed.data.date_of_birth || null,
      position: parsed.data.position || null,
      guardian_name: parsed.data.guardian_name || null,
    });
    setBusy(false);
    if (error) {
      toast.error("Could not submit your registration. Please try again.");
      return;
    }
    toast.success("Registration received! We will contact you before the trials.");
    setForm({ full_name: "", email: "", phone: "", age_group: "UNDER 15", date_of_birth: "", position: "", guardian_name: "" });
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <PageShell
      title="Screening Competition"
      intro="Showcase your talents. Earn your opportunity. Registration is completely free — limited slots available."
    >
      <div className="grid gap-10 lg:grid-cols-5">
        <CathedralCard className="lg:col-span-2">
          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <CalendarDays className="mt-0.5 text-primary" size={20} />
              <p className="text-sm">
                <span className="block font-bold uppercase tracking-wide text-accent">Date</span>
                10th to 15th September, 2026
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 text-primary" size={20} />
              <p className="text-sm">
                <span className="block font-bold uppercase tracking-wide text-accent">Time</span>
                8:00 a.m. to 12 noon daily
              </p>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 text-primary" size={20} />
              <p className="text-sm">
                <span className="block font-bold uppercase tracking-wide text-accent">Venue</span>
                Nigerian Postal Institute (NIPOST), Egor, Benin City
              </p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {["Under 15", "Under 16", "Under 17"].map((g) => (
              <div key={g} className="cathedral-press rounded-[16px_16px_4px_4px] px-2 py-3 text-center">
                <span className="display text-sm uppercase text-accent">{g}</span>
              </div>
            ))}
          </div>
          <img
            src={advert.url}
            alt="Screening competition flyer"
            loading="lazy"
            className="mt-6 w-full rounded-[16px_16px_4px_4px]"
          />
        </CathedralCard>

        <CathedralCard className="lg:col-span-3">
          <h2 className="engraved-title mb-6 text-xl uppercase">Register Now — It's Free</h2>
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Player full name
              <input className="neu-input" value={form.full_name} onChange={set("full_name")} required maxLength={100} />
            </label>
            <label className="grid gap-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Phone
              <input className="neu-input" value={form.phone} onChange={set("phone")} required maxLength={20} />
            </label>
            <label className="grid gap-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Email (optional)
              <input type="email" className="neu-input" value={form.email} onChange={set("email")} maxLength={255} />
            </label>
            <label className="grid gap-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Age group
              <select className="neu-input" value={form.age_group} onChange={set("age_group")}>
                <option value="UNDER 15">Under 15</option>
                <option value="UNDER 16">Under 16</option>
                <option value="UNDER 17">Under 17</option>
              </select>
            </label>
            <label className="grid gap-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Date of birth
              <input type="date" className="neu-input" value={form.date_of_birth} onChange={set("date_of_birth")} />
            </label>
            <label className="grid gap-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Preferred position
              <input className="neu-input" value={form.position} onChange={set("position")} maxLength={50} />
            </label>
            <label className="grid gap-1 text-xs font-bold uppercase tracking-widest text-muted-foreground sm:col-span-2">
              Parent / guardian name
              <input className="neu-input" value={form.guardian_name} onChange={set("guardian_name")} maxLength={100} />
            </label>
            <div className="sm:col-span-2">
              <button type="submit" className="btn-firm w-full" disabled={busy}>
                {busy ? "Submitting…" : "Register Now"}
              </button>
            </div>
          </form>
        </CathedralCard>
      </div>
    </PageShell>
  );
}
