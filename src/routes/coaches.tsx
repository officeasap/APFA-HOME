
import {
  Award,
  BadgeCheck,
  Dumbbell,
  Goal,
  ShieldCheck,
} from "lucide-react";

import {
  CathedralCard,
  PageShell,
  SectionHeading,
} from "@/components/cathedral";

import esosaCourage from "@/assets/Esosa-courage.png";
import ezeAghimen from "@/assets/Eze-aghimen.png";
import ojoHarrison from "@/assets/ojoh.png";

const COACHING_ENQUIRY =
  "Hello Allen Premier Football Academy, I would like to enquire about the coaching staff and their areas of expertise. Please provide further information.";

const COACHES = [
  {
    name: "Mr. Aimiuwu Esosa Courage",
    role: "Head Coach",
    experience: "18+ Years Experience",
    license: "UEFA B License Holder",
    specialty: "Youth Development & Talent Identification",
    Icon: Award,
    image: esosaCourage,
    bio:
      "Former Technical Director of a Premier League club with extensive experience in youth development, talent identification and building disciplined football pathways for young players.",
  },
  {
    name: "Mr. Beauty Eze Aghimem",
    role: "Assistant Coach",
    experience: "12+ Years Experience",
    license: "CAF C License Holder",
    specialty: "Futsal Methodology & Small-Sided Games",
    Icon: ShieldCheck,
    image: ezeAghimen,
    bio:
      "An experienced youth football coach specialising in futsal methodology and small-sided games, helping players develop technical confidence, quick decision-making and intelligent movement.",
  },
  {
    name: "Mr. Enoghayinagbon Ojo Harrison",
    role: "Assistant Coach",
    experience: "10+ Years Experience",
    license: "Goalkeeper & Physical Conditioning Specialist",
    specialty: "Goalkeeper Training & Physical Development",
    Icon: Goal,
    image: ojoHarrison,
    bio:
      "Specialises in goalkeeper training and physical conditioning, helping young athletes develop athletic ability, positional confidence, discipline and the physical foundation required for competitive football.",
  },
];

function openCoachingChat() {
  window.dispatchEvent(
    new CustomEvent("open-apfa-chat", {
      detail: {
        enquiry: "COACHING STAFF",
        message: COACHING_ENQUIRY,
      },
    }),
  );
}

export function Coaches() {
  return (
    <PageShell
      title="Our Coaches"
      intro="Experienced, disciplined and committed to developing the next generation of footballers."
    >
      {/* INTRO AUTHORITY BLOCK */}
      <section className="mb-16">
        <SectionHeading
          kicker="The Technical Team"
          title="Coaching Authority"
        />

        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            Every Allen Premier player is guided by experienced coaches
            committed to technical development, tactical intelligence,
            discipline and long-term player growth.
          </p>
        </div>
      </section>

      {/* COACH AUTHORITY — SINGLE DESKTOP ROW */}
      <div className="grid w-full min-w-0 gap-8 md:grid-cols-3 lg:gap-10">
        {COACHES.map(
          ({
            name,
            role,
            experience,
            license,
            specialty,
            Icon,
            image,
            bio,
          }) => (
            <CathedralCard
              key={name}
              className="flex w-full min-w-0 flex-col"
            >
              {/* COACH IMAGE */}
              <div className="relative mb-6 flex h-72 w-full min-w-0 items-start justify-center overflow-hidden rounded-[20px_20px_4px_4px] bg-[#145522] shadow-[inset_6px_7px_14px_rgba(20,18,14,0.28),inset_-3px_-3px_7px_rgba(0,0,0,0.08)] sm:h-80">
                <div className="absolute left-4 top-4 z-20 rounded-[10px_10px_3px_3px] border border-white/15 bg-black/25 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white shadow-[3px_3px_7px_rgba(0,0,0,0.28)]">
                  {role}
                </div>

                <img
                  src={image}
                  alt={`${name} — ${role}`}
                  loading="lazy"
                  className="relative z-10 block h-auto max-h-full w-full max-w-full object-contain object-top px-3 pt-3 transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>

              {/* COACH IDENTITY */}
              <div className="mb-4 min-w-0">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  {role}
                </p>

                <h2 className="engraved-title break-words text-xl uppercase leading-tight">
                  {name}
                </h2>
              </div>

              <div className="mb-5 h-px w-full bg-border" />

              {/* COACH CREDENTIALS */}
              <div className="grid min-w-0 gap-4">
                <div className="flex min-w-0 items-start gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[9px_9px_3px_3px] border-2 border-[#008000] bg-[#292824]"
                    style={{
                      boxShadow:
                        "5px 6px 12px rgba(0,0,0,0.30), inset 2px 2px 4px rgba(255,255,255,0.04), inset -2px -2px 4px rgba(0,0,0,0.32)",
                    }}
                  >
                    <Award
                      size={18}
                      strokeWidth={2.4}
                      aria-hidden="true"
                      className="text-[#008000]"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Experience
                    </p>

                    <p className="mt-1 text-sm font-semibold leading-snug text-foreground">
                      {experience}
                    </p>
                  </div>
                </div>

                <div className="flex min-w-0 items-start gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[9px_9px_3px_3px] border-2 border-[#008000] bg-[#292824]"
                    style={{
                      boxShadow:
                        "5px 6px 12px rgba(0,0,0,0.30), inset 2px 2px 4px rgba(255,255,255,0.04), inset -2px -2px 4px rgba(0,0,0,0.32)",
                    }}
                  >
                    <BadgeCheck
                      size={18}
                      strokeWidth={2.4}
                      aria-hidden="true"
                      className="text-[#008000]"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Qualification
                    </p>

                    <p className="mt-1 text-sm font-semibold leading-snug text-foreground">
                      {license}
                    </p>
                  </div>
                </div>

                <div className="flex min-w-0 items-start gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[9px_9px_3px_3px] border-2 border-[#008000] bg-[#292824]"
                    style={{
                      boxShadow:
                        "5px 6px 12px rgba(0,0,0,0.30), inset 2px 2px 4px rgba(255,255,255,0.04), inset -2px -2px 4px rgba(0,0,0,0.32)",
                    }}
                  >
                    <Icon
                      size={18}
                      strokeWidth={2.4}
                      aria-hidden="true"
                      className="text-[#008000]"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Specialisation
                    </p>

                    <p className="mt-1 text-sm font-semibold leading-snug text-foreground">
                      {specialty}
                    </p>
                  </div>
                </div>
              </div>

              {/* COACH BIO */}
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                {bio}
              </p>

              {/* COACH ENQUIRY */}
              <div className="mt-auto pt-7">
                <div className="mb-5 h-px w-full bg-border" />

                <button
                  type="button"
                  onClick={openCoachingChat}
                  className="btn-firm w-full justify-center text-xs"
                  aria-label={`Ask about ${name} and the coaching staff`}
                >
                  Contact Academy
                </button>
              </div>
            </CathedralCard>
          ),
        )}
      </div>

      {/* DEVELOPMENT PHILOSOPHY */}
      <section className="mt-20">
        <CathedralCard className="text-center">
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-[12px_12px_4px_4px] border-2 border-[#008000] bg-[#292824]"
            style={{
              boxShadow:
                "7px 8px 15px rgba(0,0,0,0.30), inset 2px 2px 4px rgba(255,255,255,0.04), inset -2px -2px 4px rgba(0,0,0,0.32)",
            }}
          >
            <Dumbbell
              size={26}
              strokeWidth={2.4}
              aria-hidden="true"
              className="text-[#008000]"
            />
          </div>

          <h2 className="engraved-title mt-5 text-xl uppercase">
            More Than Training
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            At Allen Premier Football Academy, coaching goes beyond
            football drills. Our technical team develops discipline,
            confidence, intelligence, physical conditioning and the
            professional mentality required to succeed on and off the pitch.
          </p>
        </CathedralCard>
      </section>
    </PageShell>
  );
}

