import { Link } from "react-router-dom";
import { ClipboardCheck } from "lucide-react";

import {
  CathedralCard,
  FootballMark,
  PageShell,
} from "@/components/cathedral";



export function QuizPage() {
  return (
    <PageShell
      title="Assessment"
      intro="Assessment capabilities are part of the future APFA Education Hub roadmap."
    >
      <div className="mx-auto max-w-2xl">
        <CathedralCard className="text-center">
          <span className="neu-circle mx-auto mb-6 flex h-16 w-16 items-center justify-center text-accent">
            <ClipboardCheck size={28} />
          </span>

          <h2 className="engraved-title text-xl uppercase">
            Assessment System
          </h2>

          <div className="my-5 h-px w-full bg-border" />

          <p className="text-sm leading-7 text-muted-foreground">
            The APFA Education Hub is currently focused on delivering
            its core educational catalogue. Structured assessments,
            quiz attempts, scoring and certificates will be introduced
            as dedicated education capabilities in a future phase.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <FootballMark className="h-10 w-10" />

            <Link
              to="/education"
              className="btn-firm text-xs"
            >
              Return to Education →
            </Link>
          </div>
        </CathedralCard>
      </div>
    </PageShell>
  );
}