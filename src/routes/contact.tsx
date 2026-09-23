
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import {
  CathedralCard,
  PageShell,
} from "@/components/cathedral";



const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(20).optional(),
  subject: z.string().trim().min(2).max(120),
  message: z.string().trim().min(10).max(2000),
});

type ContactForm = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const EMPTY_FORM: ContactForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export function Contact() {
  const [form, setForm] = useState<ContactForm>(EMPTY_FORM);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = schema.safeParse({
      ...form,
      phone: form.phone.trim() || undefined,
    });

    if (!parsed.success) {
      toast.error(
        "Please check the form — some fields are missing or invalid.",
      );

      return;
    }

    setBusy(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: parsed.data.name,
          email: parsed.data.email,
          phone: parsed.data.phone ?? "",
          subject: parsed.data.subject,
          message: parsed.data.message,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Contact request failed with status ${response.status}`,
        );
      }

      toast.success(
        "Message received. The Allen Premier team will get back to you.",
      );

      setForm(EMPTY_FORM);
    } catch {
      toast.error(
        "Your message could not be delivered. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  const set =
    (key: keyof ContactForm) =>
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement
      >,
    ) => {
      setForm((current) => ({
        ...current,
        [key]: event.target.value,
      }));
    };

  return (
    <PageShell
      title="Contact"
      intro="Questions about programs, screening or partnerships — talk to us."
    >
      <div
        className="grid w-full min-w-0 gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.5fr)] lg:gap-10"
      >
        {/* =======================================================
            CONTACT INFORMATION
            ======================================================= */}
        <CathedralCard className="w-full min-w-0">
          <p className="mb-8 text-xs font-bold uppercase tracking-[0.2em] text-accent">
            Academy Information
          </p>

          <ul className="grid min-w-0 gap-7 text-sm">
            <li className="flex min-w-0 items-start gap-4">
              <span className="neu-circle flex h-11 w-11 shrink-0 items-center justify-center text-primary">
                <MapPin
                  size={19}
                  aria-hidden="true"
                />
              </span>

              <div className="min-w-0">
                <p className="mb-1 font-bold uppercase tracking-wide text-accent">
                  Location
                </p>

                <p className="leading-relaxed text-foreground">
                  Benin City, Edo State, Nigeria
                </p>
              </div>
            </li>

            <li className="flex min-w-0 items-start gap-4">
              <span className="neu-circle flex h-11 w-11 shrink-0 items-center justify-center text-primary">
                <Phone
                  size={19}
                  aria-hidden="true"
                />
              </span>

              <div className="min-w-0">
                <p className="mb-1 font-bold uppercase tracking-wide text-accent">
                  Phone
                </p>

                <p className="leading-relaxed text-foreground">
                  +234 905 028 3400
                  <br />
                  +234 803 345 9962
                  <br />
                  +234 810 387 9566
                </p>
              </div>
            </li>

            <li className="flex min-w-0 items-start gap-4">
              <span className="neu-circle flex h-11 w-11 shrink-0 items-center justify-center text-primary">
                <Mail
                  size={19}
                  aria-hidden="true"
                />
              </span>

              <div className="min-w-0">
                <p className="mb-1 font-bold uppercase tracking-wide text-accent">
                  Email
                </p>

                <p className="break-words leading-relaxed text-foreground">
                  admin@ap-fa.com
                  <br />
                  allenpremierapfa2025@gmail.com
                </p>
              </div>
            </li>
          </ul>
        </CathedralCard>

        {/* =======================================================
            CONTACT FORM
            ======================================================= */}
        <CathedralCard className="w-full min-w-0">
          <div className="mb-8 min-w-0">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Send Us a Message
            </p>

            <h2 className="engraved-title text-xl uppercase sm:text-2xl">
              Let's Talk Football
            </h2>

            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Send your enquiry and the Allen Premier team
              will get back to you.
            </p>
          </div>

          <form
            onSubmit={submit}
            className="grid w-full min-w-0 gap-5 md:grid-cols-2"
            noValidate
          >
            <label className="grid min-w-0 gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Name

              <input
                type="text"
                className="neu-input w-full min-w-0"
                value={form.name}
                onChange={set("name")}
                required
                maxLength={100}
                autoComplete="name"
              />
            </label>

            <label className="grid min-w-0 gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Email

              <input
                type="email"
                className="neu-input w-full min-w-0"
                value={form.email}
                onChange={set("email")}
                required
                maxLength={255}
                autoComplete="email"
              />
            </label>

            <label className="grid min-w-0 gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Phone (optional)

              <input
                type="tel"
                className="neu-input w-full min-w-0"
                value={form.phone}
                onChange={set("phone")}
                maxLength={20}
                autoComplete="tel"
              />
            </label>

            <label className="grid min-w-0 gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Subject

              <input
                type="text"
                className="neu-input w-full min-w-0"
                value={form.subject}
                onChange={set("subject")}
                required
                maxLength={120}
              />
            </label>

            <label className="grid min-w-0 gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground md:col-span-2">
              Message

              <textarea
                className="neu-input min-h-40 w-full min-w-0 resize-y"
                value={form.message}
                onChange={set("message")}
                required
                maxLength={2000}
              />
            </label>

            <div className="mt-2 min-w-0 md:col-span-2">
              <button
                type="submit"
                className="btn-firm w-full"
                disabled={busy}
              >
                {busy ? "Sending…" : "Send Message"}
              </button>
            </div>
          </form>
        </CathedralCard>
      </div>
    </PageShell>
  );
}