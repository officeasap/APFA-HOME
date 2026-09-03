import { createFileRoute, Link } from "@tanstack/react-router";
import { CathedralCard, FootballMark, PageShell } from "@/components/cathedral";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Join the Academy — Allen Premier Football Academy" },
      { name: "description", content: "How to join Allen Premier Football Academy in Benin City: register, attend screening, and begin your development pathway." },
      { property: "og:title", content: "Join the Academy — Allen Premier Football Academy" },
      { property: "og:description", content: "Register, attend screening and begin your development pathway." },
    ],
  }),
  component: Join,
});

const STEPS = [
  { title: "1. Create Your Account", body: "Register for a free member account to unlock the Education Hub and your personal dashboard." },
  { title: "2. Register for Screening", body: "Sign up for the free September 2026 screening competition — Under 15, 16 or 17." },
  { title: "3. Attend the Trials", body: "Come to NIPOST, Egor, Benin City between the 10th and 15th of September, 8 a.m. to 12 noon." },
  { title: "4. Earn Your Place", body: "Selected players join an age-group squad and begin the full development pathway." },
];

function Join() {
  return (
    <PageShell title="Join Academy" intro="Four steps between you and the pitch. Catch them young — build them strong.">
      <div className="grid gap-10 md:grid-cols-2">
        {STEPS.map((s) => (
          <CathedralCard key={s.title} className="flex flex-col">
            <h2 className="engraved-title text-lg uppercase">{s.title}</h2>
            <div className="my-3 h-px w-full bg-border" />
            <p className="mb-8 text-sm">{s.body}</p>
            <div className="mt-auto flex items-end justify-between">
              <FootballMark className="h-10 w-10" />
              {s.title.startsWith("1") ? (
                <Link to="/auth" className="btn-firm text-xs">Register →</Link>
              ) : (
                <Link to="/screening" className="btn-firm text-xs">Screening →</Link>
              )}
            </div>
          </CathedralCard>
        ))}
      </div>
    </PageShell>
  );
}
