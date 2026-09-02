import { createFileRoute, Link } from "@tanstack/react-router";
import { CathedralCard, FootballMark, PageShell } from "@/components/cathedral";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Programs — Allen Premier Football Academy" },
      { name: "description", content: "Age-group programs, elite development squads and goalkeeper school at Allen Premier Football Academy." },
      { property: "og:title", content: "Programs — Allen Premier Football Academy" },
      { property: "og:description", content: "Age-group programs, elite development squads and goalkeeper school." },
    ],
  }),
  component: Programs,
});

const PROGRAMS = [
  { title: "Foundation (U9 – U12)", body: "Ball mastery, coordination and love for the game through structured play." },
  { title: "Development (U13 – U15)", body: "Position-specific work, game intelligence and competitive fixtures." },
  { title: "Elite Squad (U16 – U17)", body: "Pro-level conditioning, video analysis and scouting exposure." },
  { title: "Goalkeeper School", body: "Handling, footwork, distribution and shot-stopping under specialist coaches." },
  { title: "Strength & Conditioning", body: "Injury prevention, speed development and athlete nutrition." },
  { title: "Scholar Athletes", body: "Free Education Hub access alongside daily training for every subscribed youth." },
];

function Programs() {
  return (
    <PageShell title="Programs" intro="Structured pathways from first touch to professional trial.">
      <div className="grid gap-10 md:grid-cols-3">
        {PROGRAMS.map((p) => (
          <CathedralCard key={p.title} className="flex flex-col">
            <h2 className="engraved-title text-lg uppercase">{p.title}</h2>
            <div className="my-3 h-px w-full bg-border" />
            <p className="mb-8 text-sm">{p.body}</p>
            <div className="mt-auto flex items-end justify-between">
              <FootballMark className="h-10 w-10" />
              <Link to="/join" className="btn-firm text-xs">
                Learn More →
              </Link>
            </div>
          </CathedralCard>
        ))}
      </div>
    </PageShell>
  );
}
