import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { CathedralCard, PageShell } from "@/components/cathedral";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Allen Premier Football Academy" },
      { name: "description", content: "Reach Allen Premier Football Academy in Benin City by phone, email or the contact form." },
      { property: "og:title", content: "Contact — Allen Premier Football Academy" },
      { property: "og:description", content: "Reach the academy by phone, email or the contact form." },
    ],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(20).optional(),
  subject: z.string().trim().min(2).max(120),
  message: z.string().trim().min(10).max(2000),
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error("Please check the form — some fields are missing or invalid.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("contact_messages").insert({
      ...parsed.data,
      phone: parsed.data.phone || null,
    });
    setBusy(false);
    if (error) {
      toast.error("Message could not be sent. Please try again.");
      return;
    }
    toast.success("Message sent. We will get back to you shortly.");
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  }

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <PageShell title="Contact" intro="Questions about programs, screening or partnerships — talk to us.">
      <div className="grid gap-10 lg:grid-cols-5">
        <CathedralCard className="lg:col-span-2">
          <ul className="grid gap-5 text-sm">
            <li className="flex gap-3">
              <MapPin size={20} className="mt-0.5 shrink-0 text-primary" />
              Benin City, Edo State, Nigeria
            </li>
            <li className="flex gap-3">
              <Phone size={20} className="mt-0.5 shrink-0 text-primary" />
              <span>
                +234 905 028 3400
                <br />
                +234 803 345 9962
                <br />
                +234 810 387 9566
              </span>
            </li>
            <li className="flex gap-3">
              <Mail size={20} className="mt-0.5 shrink-0 text-primary" />
              <span>
                admin@ap-fa.com
                <br />
                allenpremierapfa2025@gmail.com
              </span>
            </li>
          </ul>
        </CathedralCard>

        <CathedralCard className="lg:col-span-3">
          <h2 className="engraved-title mb-6 text-xl uppercase">Send a Message</h2>
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Name
              <input className="neu-input" value={form.name} onChange={set("name")} required maxLength={100} />
            </label>
            <label className="grid gap-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Email
              <input type="email" className="neu-input" value={form.email} onChange={set("email")} required maxLength={255} />
            </label>
            <label className="grid gap-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Phone (optional)
              <input className="neu-input" value={form.phone} onChange={set("phone")} maxLength={20} />
            </label>
            <label className="grid gap-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Subject
              <input className="neu-input" value={form.subject} onChange={set("subject")} required maxLength={120} />
            </label>
            <label className="grid gap-1 text-xs font-bold uppercase tracking-widest text-muted-foreground sm:col-span-2">
              Message
              <textarea className="neu-input min-h-32" value={form.message} onChange={set("message")} required maxLength={2000} />
            </label>
            <div className="sm:col-span-2">
              <button type="submit" className="btn-firm w-full" disabled={busy}>
                {busy ? "Sending…" : "Send Message"}
              </button>
            </div>
          </form>
        </CathedralCard>
      </div>
    </PageShell>
  );
}
