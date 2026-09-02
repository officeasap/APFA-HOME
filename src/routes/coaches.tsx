import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/cathedral";
import coachOne from "@/assets/coach-one.png";
import coachTwo from "@/assets/coach-two.png";

export const Route = createFileRoute("/coaches")({
  head: () => ({
    meta: [
      { title: "Coaches — Allen Premier Football Academy" },
      { name: "description", content: "Meet the UEFA-licensed coaching staff guiding every Allen Premier Football Academy player." },
      { property: "og:title", content: "Coaches — Allen Premier Football Academy" },
      { property: "og:description", content: "Meet the UEFA-licensed coaching staff behind the academy." },
    ],
  }),
  component: Coaches,
});

const COACHES = [
  {
    name: "James Smith",
    role: "Head Coach",
    badge: "UEFA Elite Youth A Coach",
    img: coachOne,
    bio: "Twelve years developing youth internationals, specialising in possession structures and player mentality.",
  },
  {
    name: "Henry Sutton",
    role: "Technical Director",
    badge: "UEFA Pro License Holder",
    img: coachTwo,
    bio: "Oversees the academy curriculum, scouting network and the pathway to European trials.",
  },
];

function Coaches() {
  return (
    <PageShell title="Coaches" intro="Licensed, experienced and accountable for every player's progress.">
      <div className="grid gap-16 sm:grid-cols-2">
        {COACHES.map((c) => (
          <div key={c.name} className="relative pt-14">
            <div
              className="grass-shadow relative flex min-h-64 items-stretch p-5"
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
                className="pointer-events-none absolute -top-12 left-0 h-[21rem] w-auto object-contain"
              />
              <div className="ml-auto w-3/5 text-right">
                <h2 className="display text-2xl uppercase text-white">{c.name}</h2>
                <p className="text-sm text-white/80">{c.role}</p>
                <div className="my-3 h-px w-full bg-white/25" />
                <p className="text-sm font-semibold text-white/90">{c.badge}</p>
                <p className="mt-3 text-xs text-white/80">{c.bio}</p>
                <Link to="/contact" className="btn-firm mt-5 text-xs">
                  Contact Staff
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
