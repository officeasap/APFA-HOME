import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Clock, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { CathedralCard, FootballMark, PageShell } from "@/components/cathedral";

export const Route = createFileRoute("/lessons/$lessonId")({
  head: () => ({
    meta: [
      { title: "Lesson — Allen Premier Football Academy Education Hub" },
      { name: "description", content: "Lesson content and quizzes in the Allen Premier Football Academy Education Hub." },
    ],
  }),
  component: LessonPage,
});

function LessonPage() {
  const { lessonId } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: lesson } = useSuspenseQuery({
    queryKey: ["lesson", lessonId],
    queryFn: async () => {
      const { data, error } = await supabase.from("lessons").select("*, courses(id, title)").eq("id", lessonId).single();
      if (error) throw error;
      return data;
    },
  });

  const { data: quizzes } = useSuspenseQuery({
    queryKey: ["lesson-quizzes", lessonId],
    queryFn: async () => {
      const { data } = await supabase.from("quizzes").select("*").eq("lesson_id", lessonId);
      return data ?? [];
    },
  });

  const { data: progress } = useQuery({
    queryKey: ["lesson-progress", user?.id, lessonId],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("progress")
        .select("*")
        .eq("lesson_id", lessonId)
        .maybeSingle();
      return data;
    },
  });

  async function markComplete() {
    if (!user) {
      navigate({ to: "/auth" });
      return;
    }
    const { error } = await supabase.from("progress").upsert(
      {
        user_id: user.id,
        lesson_id: lessonId,
        completed: true,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,lesson_id" },
    );
    if (error) {
      toast.error("Could not save your progress. Please try again.");
      return;
    }
    toast.success("Lesson marked complete!");
    queryClient.invalidateQueries({ queryKey: ["lesson-progress", user.id, lessonId] });
    queryClient.invalidateQueries({ queryKey: ["progress"] });
  }

  const course = lesson.courses as { id: string; title: string } | null;

  return (
    <PageShell title={lesson.title} intro={course ? `Part of ${course.title}` : ""}>
      <div className="grid gap-10 lg:grid-cols-3">
        <CathedralCard className="lg:col-span-2">
          <div className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <Clock size={16} className="text-primary" />
            {lesson.duration ?? 0} minutes
          </div>
          {lesson.video_url ? (
            <div className="cathedral-press mb-6 flex aspect-video items-center justify-center rounded-[16px_16px_4px_4px]">
              <a
                href={lesson.video_url}
                target="_blank"
                rel="noreferrer"
                className="neu-circle flex h-16 w-16 items-center justify-center text-accent"
                aria-label="Watch lesson video"
              >
                <Play size={26} />
              </a>
            </div>
          ) : null}
          <div className="whitespace-pre-line text-sm leading-7">{lesson.content}</div>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {progress?.completed ? (
              <span className="btn-quiet text-xs">Completed ✓</span>
            ) : (
              <button type="button" className="btn-firm text-xs" onClick={markComplete}>
                Mark Complete
              </button>
            )}
            {course ? (
              <Link to="/courses/$courseId" params={{ courseId: course.id }} className="btn-quiet text-xs">
                Back to Course
              </Link>
            ) : null}
          </div>
        </CathedralCard>

        <div className="grid content-start gap-6">
          {quizzes.map((q) => (
            <CathedralCard key={q.id} className="flex flex-col">
              <h2 className="engraved-title text-lg uppercase">{q.title}</h2>
              <div className="my-3 h-px w-full bg-border" />
              <p className="mb-6 text-sm">{q.description ?? `Passing score: ${q.passing_score}%`}</p>
              <div className="mt-auto flex items-end justify-between">
                <FootballMark className="h-10 w-10" />
                <Link to="/quizzes/$quizId" params={{ quizId: q.id }} className="btn-firm text-xs">
                  Take Quiz →
                </Link>
              </div>
            </CathedralCard>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
