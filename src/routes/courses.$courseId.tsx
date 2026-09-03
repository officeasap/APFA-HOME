import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle2, Circle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { CathedralCard, FootballMark, PageShell } from "@/components/cathedral";

export const Route = createFileRoute("/courses/$courseId")({
  head: () => ({
    meta: [
      { title: "Course — Allen Premier Football Academy Education Hub" },
      { name: "description", content: "Course lessons, quizzes and progress tracking in the Allen Premier Football Academy Education Hub." },
    ],
  }),
  component: CourseDetail,
});

function CourseDetail() {
  const { courseId } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: course } = useSuspenseQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("*").eq("id", courseId).single();
      if (error) throw error;
      return data;
    },
  });

  const { data: lessons } = useSuspenseQuery({
    queryKey: ["lessons", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("course_id", courseId)
        .order("order_index");
      if (error) throw error;
      return data;
    },
  });

  const { data: enrollment } = useQuery({
    queryKey: ["enrollment", user?.id, courseId],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("enrollments")
        .select("*")
        .eq("course_id", courseId)
        .maybeSingle();
      return data;
    },
  });

  const { data: progress } = useQuery({
    queryKey: ["progress", user?.id, courseId],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("progress")
        .select("lesson_id, completed")
        .in("lesson_id", (lessons ?? []).map((l) => l.id));
      return data ?? [];
    },
  });

  async function enroll() {
    if (!user) {
      navigate({ to: "/auth" });
      return;
    }
    const { error } = await supabase.from("enrollments").insert({ course_id: courseId, user_id: user.id });
    if (error) {
      toast.error("Could not enroll. Please try again.");
      return;
    }
    toast.success("Enrolled. Start your first lesson!");
    queryClient.invalidateQueries({ queryKey: ["enrollment", user.id, courseId] });
  }

  const doneSet = new Set((progress ?? []).filter((p) => p.completed).map((p) => p.lesson_id));
  const enrolled = !!enrollment;

  return (
    <PageShell title={course.title} intro={course.description ?? ""}>
      {user && enrolled ? (
        <CathedralCard className="mb-10">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Your progress — {Math.round(enrollment.progress)}%
          </p>
          <div className="h-3 w-full rounded-full bg-background shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2)]">
            <div className="h-full rounded-full bg-primary" style={{ width: `${Math.round(enrollment.progress)}%` }} />
          </div>
        </CathedralCard>
      ) : null}

      <div className="grid gap-6">
        {lessons.map((lesson, i) => (
          <CathedralCard key={lesson.id} className="flex flex-col">
            <div className="flex items-start gap-4">
              <span className="neu-circle flex h-11 w-11 shrink-0 items-center justify-center text-accent">
                {doneSet.has(lesson.id) ? (
                  <CheckCircle2 size={20} className="text-primary" />
                ) : (
                  <Circle size={20} />
                )}
              </span>
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Lesson {i + 1} · {lesson.duration_minutes} min
                </p>
                <h2 className="engraved-title mt-1 text-lg uppercase">{lesson.title}</h2>
                {lesson.content ? (
                  <p className="mt-2 text-sm text-foreground">{lesson.content}</p>
                ) : null}
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
              <FootballMark className="h-8 w-8" />
              <Link
                to="/lessons/$lessonId"
                params={{ lessonId: lesson.id }}
                className={enrolled ? "btn-firm text-xs" : "btn-quiet text-xs"}
              >
                {enrolled ? "Open Lesson →" : "Preview →"}
              </Link>
            </div>
          </CathedralCard>
        ))}
      </div>

      {!enrolled ? (
        <div className="mt-10 text-center">
          <button type="button" className="btn-firm" onClick={enroll}>
            {user ? "Enroll in This Course" : "Sign In to Enroll"}
          </button>
        </div>
      ) : null}
    </PageShell>
  );
}
