
import { useState, type ChangeEvent, type FormEvent } from "react";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { CathedralCard, PageShell } from "@/components/cathedral";
import { createScreeningRegistration } from "@/lib/api";
import advert from "@/assets/Allen-Premier-Football-Academy-screening-competition-flyer.png";



const schema = z.object({
  full_name: z.string().trim().min(2).max(100),

  email: z
    .string()
    .trim()
    .email()
    .max(255)
    .or(z.literal("")),

  phone: z.string().trim().min(7).max(20),

  age_group: z.enum([
    "UNDER 15",
    "UNDER 16",
    "UNDER 17",
  ]),

  date_of_birth: z.string().optional(),

  position: z.string().trim().max(50).optional(),

  guardian_name: z.string().trim().max(100).optional(),
});

type ScreeningForm = {
  full_name: string;
  email: string;
  phone: string;
  age_group: "UNDER 15" | "UNDER 16" | "UNDER 17";
  date_of_birth: string;
  position: string;
  guardian_name: string;
};

const EMPTY_FORM: ScreeningForm = {
  full_name: "",
  email: "",
  phone: "",
  age_group: "UNDER 15",
  date_of_birth: "",
  position: "",
  guardian_name: "",
};

export function Screening() {
  const [form, setForm] = useState<ScreeningForm>(EMPTY_FORM);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = schema.safeParse(form);

    if (!parsed.success) {
      toast.error(
        "Please check the form — some fields are missing or invalid.",
      );

      return;
    }

    setBusy(true);

    try {
      await createScreeningRegistration({
        fullName: parsed.data.full_name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        ageGroup: parsed.data.age_group,

        ...(parsed.data.date_of_birth
          ? {
              dateOfBirth: parsed.data.date_of_birth,
            }
          : {}),

        ...(parsed.data.position
          ? {
              position: parsed.data.position,
            }
          : {}),

        ...(parsed.data.guardian_name
          ? {
              guardianName: parsed.data.guardian_name,
            }
          : {}),
      });

      toast.success(
        "Registration received! We will contact you before the trials.",
      );

      setForm(EMPTY_FORM);
    } catch {
      toast.error(
        "Could not submit your registration. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  const set =
    (key: keyof ScreeningForm) =>
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLSelectElement
      >,
    ) => {
      setForm((current) => ({
        ...current,
        [key]: event.target.value,
      }));
    };

  return (
    <PageShell
      title="Screening Competition"
      intro="Showcase your talents. Earn your opportunity. Registration is completely free — limited slots available."
    >
      <div
        className="grid w-full min-w-0 gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.5fr)] lg:gap-10"
      >
        {/* =======================================================
            SCREENING INFORMATION
            ======================================================= */}
        <CathedralCard className="w-full min-w-0">
          <div className="grid min-w-0 gap-5">
            <div className="flex min-w-0 items-start gap-3">
              <CalendarDays
                className="mt-0.5 shrink-0 text-primary"
                size={20}
                aria-hidden="true"
              />

              <p className="min-w-0 text-sm leading-relaxed">
                <span className="mb-1 block font-bold uppercase tracking-wide text-accent">
                  Date
                </span>

                10th to 15th September, 2026
              </p>
            </div>

            <div className="flex min-w-0 items-start gap-3">
              <Clock
                className="mt-0.5 shrink-0 text-primary"
                size={20}
                aria-hidden="true"
              />

              <p className="min-w-0 text-sm leading-relaxed">
                <span className="mb-1 block font-bold uppercase tracking-wide text-accent">
                  Time
                </span>

                8:00 a.m. to 12 noon daily
              </p>
            </div>

            <div className="flex min-w-0 items-start gap-3">
              <MapPin
                className="mt-0.5 shrink-0 text-primary"
                size={20}
                aria-hidden="true"
              />

              <p className="min-w-0 text-sm leading-relaxed">
                <span className="mb-1 block font-bold uppercase tracking-wide text-accent">
                  Venue
                </span>

                Nigerian Postal Institute (NIPOST), Egor,
                Benin City
              </p>
            </div>
          </div>

          {/* AGE GROUPS */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            {["Under 15", "Under 16", "Under 17"].map(
              (group) => (
                <div
                  key={group}
                  className="cathedral-press min-w-0 rounded-[16px_16px_4px_4px] px-2 py-4 text-center"
                >
                  <span className="display text-xs uppercase text-accent sm:text-sm">
                    {group}
                  </span>
                </div>
              ),
            )}
          </div>

          {/* OFFICIAL SCREENING FLYER */}
          <div className="mt-8 w-full min-w-0 overflow-hidden rounded-[20px_20px_4px_4px]">
            <img
              src={advert}
              alt="Allen Premier Football Academy screening competition flyer"
              loading="lazy"
              className="block h-auto w-full max-w-full object-contain"
              width={1080}
              height={1350}
            />
          </div>
        </CathedralCard>

        {/* =======================================================
            REGISTRATION FORM
            ======================================================= */}
        <CathedralCard className="w-full min-w-0">
          <div className="mb-8 min-w-0">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Allen Premier Football Academy
            </p>

            <h2 className="engraved-title text-xl uppercase sm:text-2xl">
              Register Now — It's Free
            </h2>

            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Complete the form below to register for the APFA
              screening competition.
            </p>
          </div>

          <form
            onSubmit={submit}
            className="grid w-full min-w-0 gap-5 md:grid-cols-2"
            noValidate
          >
            <label className="grid min-w-0 gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Player full name

              <input
                type="text"
                className="neu-input w-full min-w-0"
                value={form.full_name}
                onChange={set("full_name")}
                required
                maxLength={100}
                autoComplete="name"
              />
            </label>

            <label className="grid min-w-0 gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Phone

              <input
                type="tel"
                className="neu-input w-full min-w-0"
                value={form.phone}
                onChange={set("phone")}
                required
                maxLength={20}
                autoComplete="tel"
              />
            </label>

            <label className="grid min-w-0 gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Email (optional)

              <input
                type="email"
                className="neu-input w-full min-w-0"
                value={form.email}
                onChange={set("email")}
                maxLength={255}
                autoComplete="email"
              />
            </label>

            <label className="grid min-w-0 gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Age group

              <select
                className="neu-input w-full min-w-0"
                value={form.age_group}
                onChange={set("age_group")}
              >
                <option value="UNDER 15">
                  Under 15
                </option>

                <option value="UNDER 16">
                  Under 16
                </option>

                <option value="UNDER 17">
                  Under 17
                </option>
              </select>
            </label>

            <label className="grid min-w-0 gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Date of birth

              <input
                type="date"
                className="neu-input w-full min-w-0"
                value={form.date_of_birth}
                onChange={set("date_of_birth")}
                autoComplete="bday"
              />
            </label>

            <label className="grid min-w-0 gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Preferred position

              <input
                type="text"
                className="neu-input w-full min-w-0"
                value={form.position}
                onChange={set("position")}
                maxLength={50}
              />
            </label>

            <label className="grid min-w-0 gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground md:col-span-2">
              Parent / guardian name

              <input
                type="text"
                className="neu-input w-full min-w-0"
                value={form.guardian_name}
                onChange={set("guardian_name")}
                maxLength={100}
                autoComplete="name"
              />
            </label>

            <div className="mt-2 min-w-0 md:col-span-2">
              <button
                type="submit"
                className="btn-firm w-full"
                disabled={busy}
              >
                {busy
                  ? "Submitting…"
                  : "Register for Free"}
              </button>
            </div>
          </form>
        </CathedralCard>
      </div>
    </PageShell>
  );
}