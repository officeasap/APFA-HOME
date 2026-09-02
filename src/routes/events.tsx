import { createFileRoute } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { CathedralCard, FootballMark, PageShell } from "@/components/cathedral";
import grassStrip from "@/assets/grass-strip.jpg";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Video Events — Allen Premier Football Academy" },
      { name: "description", content: "Tournament highlights, screening footage and academy event videos from Allen Premier Football Academy." },
      { property: "og:title", content: "Video Events — Allen Premier Football Academy" },
      { property: "og:description", content: "Tournament highlights, screening footage and academy events." },
    ],
  }),
  component: Events,
});

const EVENTS = [
  { title: "Screening Competition Highlights", date: "September 2026", body: "Best moments from the Under 15–17 trials at NIPOST, Egor." },
  { title: "Inter-Academy Tournament", date: "July 2026", body: "APFA colts against the strongest academies in Edo State." },
  { title: "Graduation & Awards Night", date: "December 2025", body: "Celebrating our scholars, captains and player of the season." },
  { title: "Community Football Clinic", date: "October 2025", body: "Free coaching clinic for 300 children across Egor local government." },
  { title: "Parents' Open Day", date: "August 2025", body: "Families on the pitch, meeting the staff and touring the facilities." },
  { title: "Talent Showcase Friendly", date: "June 2025", body: "Scout-attended friendly featuring our Elite Squad graduates." },
];

function Events() {
  return (
    <PageShell title="Video Events" intro="Every tournament, trial and celebration — captured on the grass.">
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
            <h2 className="engraved-title mt-1 text-lg uppercase">{e.title}</h2>
            <p className="mt-2 mb-6 text-sm">{e.body}</p>
            <div className="mt-auto flex items-end justify-between">
              <FootballMark className="h-10 w-10" />
              <button type="button" className="btn-firm text-xs">
                Watch Event →
              </button>
            </div>
          </CathedralCard>
        ))}
      </div>
    </PageShell>
  );
}
