import { Link } from "react-router-dom";
import { CathedralCard, FootballMark, PageShell } from "@/components/cathedral";



const SCHEDULE = [
  { day: "Monday", body: "Technical circuit — ball mastery and first touch" },
  { day: "Tuesday", body: "Tactical session — shape, pressing triggers, transitions" },
  { day: "Wednesday", body: "Strength & conditioning + recovery" },
  { day: "Thursday", body: "Position-specific units and finishing" },
  { day: "Friday", body: "Small-sided games and decision speed" },
  { day: "Saturday", body: "Match day — competitive fixtures and analysis" },
];

export function Training() {
  return (
    <PageShell title="Training" intro="Six days a week, 8:00 a.m. to 12 noon — disciplined training, never guesswork.">
      <div className="grid gap-10 md:grid-cols-3">
        {SCHEDULE.map((s) => (
          <CathedralCard key={s.day} className="flex flex-col">
            <h2 className="engraved-title text-lg uppercase">{s.day}</h2>
            <div className="my-3 h-px w-full bg-border" />
            <p className="mb-8 text-sm">{s.body}</p>
            <div className="mt-auto flex items-end justify-between">
              <FootballMark className="h-10 w-10" />
              <Link to="/join" className="btn-firm text-xs">
                Join Session →
              </Link>
            </div>
          </CathedralCard>
        ))}
      </div>
    </PageShell>
  );
}
