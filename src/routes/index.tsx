
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Shield,
  Eye,
  Globe,
  Play,
  CalendarDays,
  Clock,
  MapPin,
} from "lucide-react";

import {
  CathedralCard,
  FootballMark,
  SectionHeading,
} from "@/components/cathedral";

import esosaCourage from "@/assets/Esosa-courage.png";
import ezeAghimen from "@/assets/Eze-aghimen.png";
import ojoHarrison from "@/assets/ojoh.png";

import screeningFlyer from "@/assets/Allen-Premier-Football-Academy-screening-competition-flyer.png";

const FEATURES = [
  {
    Icon: Shield,
    title: "Discipline",
    body:
      "Forge a professional mentality through dedication, responsibility and focus.",
  },

  {
    Icon: Eye,
    title: "Tactical Awareness",
    body:
      "Master game intelligence, decision-making and strategic understanding.",
  },

  {
    Icon: Globe,
    title: "International Exposure",
    body:
      "Gain opportunities to showcase your talent and prepare for the global game.",
  },
];

const COACHES = [
  {
    name: "Mr. AIMIUWU ESOSA COURAGE",
    role: "Head Coach",
    image: esosaCourage,
    credentials: [
      "18+ years of coaching experience",
      "UEFA B License holder",
      "Former technical director of a Premier League club",
      "Expert in youth development and talent identification",
    ],
  },

  {
    name: "Mr. BEAUTY EZE AGHIMEM",
    role: "Assistant Coach",
    image: ezeAghimen,
    credentials: [
      "12+ years of coaching experience",
      "CAF C License holder",
      "Specialist in futsal methodology",
      "Specialist in small-sided games",
    ],
  },

  {
    name: "Mr. ENOGHAYINAGBON OJO HARRISON",
    role: "Assistant Coach",
    image: ojoHarrison,
    credentials: [
      "10+ years of coaching experience",
      "Specializes in goalkeeper training",
      "Specializes in physical conditioning",
    ],
  },
];

const EVENTS = [
  {
    title: "Screening Competition Highlights",
    date: "September 2026",
    body:
      "Best moments from the Under 15–17 trials at NIPOST, Egor.",
  },

  {
    title: "Inter-Academy Tournament",
    date: "July 2026",
    body:
      "APFA colts against the strongest academies in Edo State.",
  },

  {
    title: "Graduation & Awards Night",
    date: "December 2025",
    body:
      "Celebrating our scholars, captains and player of the season.",
  },
];

function Countdown() {
  const target = new Date(
    "2026-09-10T08:00:00+01:00",
  ).getTime();

  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => {
      setLeft(target - Date.now());
    };

    tick();

    const id = setInterval(
      tick,
      1000,
    );

    return () => {
      clearInterval(id);
    };
  }, [target]);

  if (left === null) {
    return null;
  }

  const clamped = Math.max(
    left,
    0,
  );

  const units = [
    {
      label: "Days",
      value: Math.floor(
        clamped / 86400000,
      ),
    },

    {
      label: "Hours",
      value:
        Math.floor(
          clamped / 3600000,
        ) % 24,
    },

    {
      label: "Minutes",
      value:
        Math.floor(
          clamped / 60000,
        ) % 60,
    },

    {
      label: "Seconds",
      value:
        Math.floor(
          clamped / 1000,
        ) % 60,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {units.map((unit) => (
        <div
          key={unit.label}
          className="cathedral-press rounded-[16px_16px_4px_4px] px-2 py-3 text-center"
        >
          <div className="display text-2xl text-accent">
            {String(
              unit.value,
            ).padStart(2, "0")}
          </div>

          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {unit.label}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Home() {
  return (
    <main>

      {/* =====================================================
          HERO
      ====================================================== */}

      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage: 'url("/apfahero.png")',
          backgroundPosition: "center center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >

        <div
          className="absolute inset-0"
          style={{
            background: "rgba(8, 36, 8, 0.48)",
          }}
        />

        <div className="relative mx-auto w-full max-w-6xl px-4 py-24 text-center">

          <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#f8f1e4]">
            Allen Premier Football Academy
          </p>

          <h1 className="display text-4xl uppercase leading-tight text-[#f8f1e4] sm:text-6xl">

            Catch Them Young.

            <br />

            <span className="text-primary">
              Build Them Strong.
            </span>

          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base text-[#f8f1e4]/90">

            Empowering the next generation of footballers
            with world-class training, discipline and
            free structured education.

          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">

            <Link
              to="/join"
              className="btn-firm"
            >
              Start Your Journey
            </Link>

            <Link
              to="/donate"
              className="btn-quiet"
            >
              Support APFA
            </Link>

            <Link
              to="/events"
              className="btn-quiet"
            >
              <Play size={16} />

              Watch Preview
            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          THREE PILLARS
      ====================================================== */}

      <section className="mx-auto w-full max-w-6xl px-4 py-20">

        <SectionHeading
          kicker="This is Allen Premier"
          title="Built on Three Pillars"
        />

        <div className="grid gap-10 md:grid-cols-3">

          {FEATURES.map(
            ({
              Icon,
              title,
              body,
            }) => (

              <CathedralCard
                key={title}
                className="flex flex-col transition-transform hover:-translate-y-2"
              >

                <div className="mb-4 flex items-center gap-3">

                  <span className="neu-circle flex h-12 w-12 items-center justify-center text-accent">

                    <Icon size={22} />

                  </span>

                  <h3 className="engraved-title text-xl uppercase">

                    {title}

                  </h3>

                </div>

                <div className="mb-4 h-px w-full bg-border" />

                <p className="mb-8 text-sm text-foreground">

                  {body}

                </p>

                <div className="mt-auto flex items-end justify-between">

                  <FootballMark className="h-12 w-12" />

                  <Link
                    to="/programs"
                    className="btn-firm text-xs"
                  >
                    Learn More →
                  </Link>

                </div>

              </CathedralCard>

            ),
          )}

        </div>

      </section>


      {/* =====================================================
          COACHING AUTHORITY
      ====================================================== */}

      <section className="mx-auto w-full max-w-6xl px-4 py-20">

        <SectionHeading
          kicker="Our Staff"
          title="Coaching Authority"
        />

        <div className="grid gap-10 md:grid-cols-3">

          {COACHES.map(
            (coach) => (

              <CathedralCard
                key={coach.name}
                className="coach-authority-card flex flex-col"
              >

                <div className="coach-image-stage">

                  <img
                    src={coach.image}
                    alt={`${coach.name}, ${coach.role}`}
                    loading="lazy"
                    className="coach-authority-image"
                  />

                </div>


                <div className="mt-5">

                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">

                    {coach.role}

                  </p>

                  <h3 className="engraved-title mt-2 text-xl uppercase">

                    {coach.name}

                  </h3>

                </div>


                <div className="my-4 h-px w-full bg-border" />


                <ul className="coach-credentials-list">

                  {coach.credentials.map(
                    (
                      credential,
                      index,
                    ) => (

                      <li
                        key={`${coach.name}-${index}`}
                      >

                        {credential}

                      </li>

                    ),
                  )}

                </ul>


                <div className="mt-auto flex items-end justify-between pt-6">

                  <FootballMark className="h-10 w-10" />

                  <Link
                    to="/coaches"
                    className="btn-firm text-xs"
                  >
                    Learn More →
                  </Link>

                </div>

              </CathedralCard>

            ),
          )}

        </div>

      </section>


      {/* =====================================================
          SCREENING COMPETITION
      ====================================================== */}

      <section className="mx-auto w-full max-w-6xl px-4 py-20">

        <SectionHeading
          kicker="Showcase your talents. Earn your opportunity!"
          title="Screening Competition"
        />

        <div className="grid gap-10 lg:grid-cols-2">

          <CathedralCard>

            <div className="grid gap-4">

              <div className="flex items-start gap-3">

                <CalendarDays
                  className="mt-0.5 text-primary"
                  size={20}
                />

                <p className="text-sm">

                  <span className="block font-bold uppercase tracking-wide text-accent">

                    Date

                  </span>

                  10th to 15th September, 2026

                </p>

              </div>


              <div className="flex items-start gap-3">

                <Clock
                  className="mt-0.5 text-primary"
                  size={20}
                />

                <p className="text-sm">

                  <span className="block font-bold uppercase tracking-wide text-accent">

                    Time

                  </span>

                  8:00 a.m. to 12 noon daily

                </p>

              </div>


              <div className="flex items-start gap-3">

                <MapPin
                  className="mt-0.5 text-primary"
                  size={20}
                />

                <p className="text-sm">

                  <span className="block font-bold uppercase tracking-wide text-accent">

                    Venue

                  </span>

                  Nigerian Postal Institute (NIPOST),
                  Egor, Benin City

                </p>

              </div>

            </div>


            <div className="mt-6 grid grid-cols-3 gap-3">

              {[
                "Under 15",
                "Under 16",
                "Under 17",
              ].map(
                (group) => (

                  <div
                    key={group}
                    className="cathedral-press rounded-[16px_16px_4px_4px] px-2 py-3 text-center"
                  >

                    <span className="display text-sm uppercase text-accent">

                      {group}

                    </span>

                  </div>

                ),
              )}

            </div>


            <p className="display mt-6 text-2xl uppercase text-primary">

              Registration: Free!

            </p>

            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">

              Limited slots available

            </p>


            <div className="mt-6">

              <Link
                to="/screening"
                className="btn-firm"
              >
                Register Now
              </Link>

            </div>


            <div className="mt-8">

              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">

                Trials begin in

              </p>

              <Countdown />

            </div>

          </CathedralCard>


          {/* OFFICIAL SCREENING FLYER */}

          <CathedralCard className="flex items-center justify-center">

            <img
              src={screeningFlyer}
              alt="Allen Premier Football Academy screening competition flyer"
              loading="lazy"
              className="w-full object-contain rounded-[16px_16px_4px_4px]"
            />

          </CathedralCard>

        </div>

      </section>


      {/* =====================================================
          EDUCATION HUB
      ====================================================== */}

      <section className="mx-auto w-full max-w-6xl px-4 py-20">

        <SectionHeading
          kicker="Completely free for subscribed youths"
          title="Education Hub"
        />

        <CathedralCard className="text-center">

          <p className="mx-auto max-w-2xl text-sm text-foreground">

            Mathematics, Science, English, Languages
            and Computer Studies — structured lessons,
            quizzes and progress tracking so every player
            builds a mind as strong as their game.

          </p>

          <div className="mt-6">

            <Link
              to="/education"
              className="btn-firm"
            >
              Enter the Education Hub →
            </Link>

          </div>

        </CathedralCard>

      </section>


      {/* =====================================================
          VIDEO EVENTS
      ====================================================== */}

      <section className="mx-auto w-full max-w-6xl px-4 py-20">

        <SectionHeading
          kicker="From the Academy"
          title="Video Events"
        />

        <div className="grid gap-10 md:grid-cols-3">

          {EVENTS.map(
            (event) => (

              <CathedralCard
                key={event.title}
                className="flex flex-col"
              >

                <div
                  className="mb-4 flex h-40 items-center justify-center rounded-[16px_16px_4px_4px]"
                  style={{
                    background: "var(--apfa-card-deep)",
                    boxShadow: "var(--apfa-inset-deep)",
                  }}
                >

                  <span className="neu-circle flex h-14 w-14 items-center justify-center text-accent">

                    <Play size={22} />

                  </span>

                </div>


                <p className="text-xs font-bold uppercase tracking-widest text-primary">

                  {event.date}

                </p>


                <h3 className="engraved-title mt-1 text-lg uppercase">

                  {event.title}

                </h3>


                <p className="mt-2 mb-6 text-sm text-foreground">

                  {event.body}

                </p>


                <div className="mt-auto flex items-end justify-between">

                  <FootballMark className="h-10 w-10" />

                  <Link
                    to="/events"
                    className="btn-firm text-xs"
                  >
                    Watch Event →
                  </Link>

                </div>

              </CathedralCard>

            ),
          )}

        </div>

      </section>

    </main>
  );
}

