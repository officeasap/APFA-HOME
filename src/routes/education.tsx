import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Calculator, FlaskConical, BookOpen, Languages, Monitor, type LucideIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { CathedralCard, FootballMark, PageShell } from "@/components/cathedral";

export const Route = createFileRoute("/education")({
  head: () => ({
    meta: [
      { title: "Education Hub — Allen Premier Football Academy" },
      { name: "description", content: "Free structured education for subscribed youths: Mathematics, Science, English, Languages and Computer Studies, with lessons, quizzes and progress tracking." },
      { property: "og:title", content: "Education Hub — Allen Premier Football Academy" },
      { property: "og:description", content: "Free structured education for subscribed youths — lessons, quizzes and progress tracking." },
    ],
  }),
  component: Education,
});

const SUBJECT_ICONS: Record<string, LucideIcon> = {
  MATHEMATICS: Calculator,
  SCIENCE: FlaskConical,
  ENGLISH: BookOpen,
  LANGUAGES: Languages,
  COMPUTER_STUDIES: Monitor,
};

function Education() {
  const { user } = useAuth();

  const { data: courses } = useSuspenseQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("*").eq("is_active", true);
      if (error) throw error;
      return data;
    },
  });

  const { data: enrollments } = useQuery({
    queryKey: ["enrollments", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("enrollments").select("course_id, progress");
      return data ?? [];
    },
  });

  return (
    <PageShell
      title="Education Hub"
      intro="Completely free structured education for every subscribed youth — lessons, quizzes and progress tracking across five subjects."
    >
      <div className="grid gap-10 md:grid-cols-3">
        {(courses ?? []).map((c) => {
          const Icon = SUBJECT_ICONS[c.subject] ?? BookOpen;
          const enrolled = (enrollments ?? []).find((e) => e.course_id === c.id);
          return (
            <CathedralCard key={c.id} className="flex flex-col">
              <div className="mb-4 flex items-center gap-3">
                <span className="neu-circle flex h-12 w-12 items-center justify-center text-accent">
                  <Icon size={22} />
                </span>
                <h2 className="engraved-title text-lg uppercase leading-tight">{c.title}</h2>
              </div>
              <div className="mb-4 h-px w-full bg-border" />
              <p className="mb-4 text-sm">{c.description}</p>
              {enrolled ? (
                <div className="mb-4">
                  <div className="cathedral-press h-3 w-full rounded-full">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${Math.round(enrolled.progress)}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    {Math.round(enrolled.progress)}% complete
                  </p>
                </div>
              ) : null}
              <div className="mt-auto flex items-end justify-between">
                <FootballMark className="h-10 w-10" />
                <Link to="/courses/$courseId" params={{ courseId: c.id }} className="btn-firm text-xs">
                  Start Learning →
                </Link>
              </div>
            </CathedralCard>
          );
        })}
      </div>
    </PageShell>
  );
}
