import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shield, Eye, Globe, Play, CalendarDays, Clock, MapPin } from "lucide-react";
import { CathedralCard, FootballMark, SectionHeading } from "@/components/cathedral";
import grassStrip from "@/assets/grass-strip.jpg";
import coachOne from "@/assets/coach-one.png";
import coachTwo from "@/assets/coach-two.png";
import advert from "@/assets/apfa-advert.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Allen Premier Football Academy — Train Like a Pro, Become a Legend" },
      {
        name: "description",
        content:
          "Allen Premier Football Academy in Benin City develops disciplined young footballers with elite coaching, free education and international exposure.",
      },
      { property: "og:title", content: "Allen Premier Football Academy" },
      {
        property: "og:description",
        content: "Elite youth football training, free education hub and free screening trials in Benin City.",
      },
    ],
  }),
  component: Home,
});

const FEATURES = [
  { Icon: Shield, title: "Discipline", body: "Forge a pro mentality with dedication and focus." },
  { Icon: Eye, title: "Tactical Awareness", body: "Master the art of game intelligence and strategic play." },
  { Icon: Globe, title: "International Exposure", body: "Gain global opportunities and showcase your talent." },
];

const COACHES = [
  { name: "James Smith", role: "Head Coach", badge: "UEFA Elite Youth A Coach", img: coachOne },
  { name: "Henry Sutton", role: "Technical Director", badge: "UEFA Pro License Holder", img: coachTwo },
];

const EVENTS = [
  { title: "Screening Competition Highlights", date: "September 2026", body: "Best moments from the Under 15–17 trials at NIPOST, Egor." },
  { title: "Inter-Academy Tournament", date: "July 2026", body: "APFA colts against the strongest academies in Edo State." },
  { title: "Graduation & Awards Night", date: "December 2025", body: "Celebrating our scholars, captains and player of the season." },
];

function Countdown() {
  const target = new Date("2026-09-10T08:00:00+01:00").getTime();
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setLeft(target - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  if (left === null) return null;
  const clamped = Math.max(left, 0);
  const units = [
    { label: "Days", value: Math.floor(clamped / 86400000) },
    { label: "Hours", value: Math.floor(clamped / 3600000) % 24 },
    { label: "Minutes", value: Math.floor(clamped / 60000) % 60 },
    { label: "Seconds", value: Math.floor(clamped / 1000) % 60 },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {units.map((u) => (
        <div key={u.label} className="cathedral-press rounded-[16px_16px_4px_4px] px-2 py-3 text-center">
          <div className="display text-2xl text-accent">{String(u.value).padStart(2, "0")}</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{u.label}</div>
        </div>
      ))}
    </div>
  );
}

function Home() {
  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: `url(${grassStrip})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="absolute inset-0" style={{ background: "rgba(0, 34, 0, 0.72)" }} />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-24 text-center">
          <h1 className="display text-4xl uppercase leading-tight text-white sm:text-6xl">
            Train Like a Pro,
            <br />
            Become a <span style={{ color: "#FFD700" }}>Legend</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-white/90">
            Empowering the next generation of footballers with world-class training and discipline.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link to="/join" className="btn-firm">
              Start Your Journey
            </Link>
            <Link to="/events" className="btn-quiet">
              <Play size={16} /> Watch Preview
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20">
        <SectionHeading kicker="This is Allen Premier" title="Built on Three Pillars" />
        <div className="grid gap-10 md:grid-cols-3">
          {FEATURES.map(({ Icon, title, body }) => (
            <CathedralCard key={title} className="flex flex-col transition-transform hover:-translate-y-2">
              <div className="mb-4 flex items-center gap-3">
                <span className="neu-circle flex h-12 w-12 items-center justify-center text-accent">
                  <Icon size={22} />
                </span>
                <h3 className="engraved-title text-xl uppercase">{title}</h3>
              </div>
              <div className="mb-4 h-px w-full bg-border" />
              <p className="mb-8 text-sm text-foreground">{body}</p>
              <div className="mt-auto flex items-end justify-between">
                <FootballMark className="h-12 w-12 drop-shadow" />
                <Link to="/programs" className="btn-firm text-xs">
                  Learn More →
                </Link>
              </div>
            </CathedralCard>
          ))}
        </div>
      </section>

      {/* COACHES */}
      <section className="mx-auto w-full max-w-5xl px-4 py-20">
        <SectionHeading kicker="Our Staff" title="Coaching Authority" />
        <div className="grid gap-16 sm:grid-cols-2">
          {COACHES.map((c) => (
            <div key={c.name} className="relative pt-14">
              <div
                className="grass-shadow relative flex min-h-56 items-stretch overflow-visible p-5"
                style={{
                  background: "#0d4a1e",
                  borderRadius: "24px 24px 4px 4px",
                  boxShadow: "8px 8px 16px rgba(0,0,0,0.35), -6px -6px 14px rgba(255,255,255,0.35)",
                }}
              >
                <img
                  src={c.img}
                  alt={`${c.name}, ${c.role}`}
                  loading="lazy"
                  width={768}
                  height={1024}
                  className="pointer-events-none absolute -top-12 left-0 h-[19rem] w-auto object-contain"
                />
                <div className="ml-auto w-3/5 text-right">
                  <h3 className="display text-2xl uppercase text-white">{c.name}</h3>
                  <p className="text-sm text-white/80">{c.role}</p>
                  <div className="my-3 h-px w-full bg-white/25" />
                  <p className="text-sm font-semibold text-white/90">{c.badge}</p>
                  <Link to="/coaches" className="btn-firm mt-5 text-xs">
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SCREENING */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20">
        <SectionHeading kicker="Showcase your talents. Earn your opportunity!" title="Screening Competition" />
        <div className="grid gap-10 lg:grid-cols-2">
          <CathedralCard>
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
            <p className="display mt-6 text-2xl uppercase text-primary">Registration: Free!</p>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Limited slots available</p>
            <div className="mt-6">
              <Link to="/screening" className="btn-firm">
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
          <CathedralCard className="flex items-center justify-center">
            <img
              src={advert.url}
              alt="Allen Premier Football Academy screening competition flyer"
              loading="lazy"
              className="w-full rounded-[16px_16px_4px_4px]"
            />
          </CathedralCard>
        </div>
      </section>

      {/* EDUCATION TEASER */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20">
        <SectionHeading kicker="Completely free for subscribed youths" title="Education Hub" />
        <CathedralCard className="text-center">
          <p className="mx-auto max-w-2xl text-sm text-foreground">
            Mathematics, Science, English, Languages and Computer Studies — structured lessons,
            quizzes and progress tracking so every player builds a mind as strong as their game.
          </p>
          <div className="mt-6">
            <Link to="/education" className="btn-firm">
              Enter the Education Hub →
            </Link>
          </div>
        </CathedralCard>
      </section>

      {/* VIDEO EVENTS */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20">
        <SectionHeading kicker="From the Academy" title="Video Events" />
        <div className="grid gap-10 md:grid-cols-3">
          {EVENTS.map((e) => (
            <CathedralCard key={e.title} className="flex flex-col">
              <div
                className="mb-4 flex h-40 items-center justify-center rounded-[16px_16px_4px_4px]"
                style={{ backgroundImage: `url(${grassStrip})`, backgroundSize: "cover" }}
              >
                <span className="neu-circle flex h-14 w-14 items-center justify-center text-accent">
                  <Play size={22} />
                </span>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary">{e.date}</p>
              <h3 className="engraved-title mt-1 text-lg uppercase">{e.title}</h3>
              <p className="mt-2 mb-6 text-sm text-foreground">{e.body}</p>
              <div className="mt-auto flex items-end justify-between">
                <FootballMark className="h-10 w-10" />
                <Link to="/events" className="btn-firm text-xs">
                  Watch Event →
                </Link>
              </div>
            </CathedralCard>
          ))}
        </div>
      </section>
    </main>
  );
}
