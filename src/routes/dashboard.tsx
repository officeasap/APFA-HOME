import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Activity, BookOpen, FileCheck, MessageSquare, Medal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { CathedralCard, FootballMark, PageShell } from "@/components/cathedral";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Allen Premier Football Academy" },
      { name: "description", content: "Your Allen Premier Football Academy member dashboard: courses, progress, quizzes and activity." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", replace: true });
  }, [loading, user, navigate]);

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
      return data;
    },
  });

  const { data: subscription } = useQuery({
    queryKey: ["subscription", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("subscriptions").select("*").eq("user_id", user!.id).maybeSingle();
      return data;
    },
  });

  const { data: enrollments } = useQuery({
    queryKey: ["dashboard-enrollments", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("enrollments").select("*, courses(title, subject)");
      return data ?? [];
    },
  });

  const { data: attempts } = useQuery({
    queryKey: ["quiz-attempts", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("quiz_attempts")
        .select("*, quizzes(title, lessons(title))")
        .order("completed_at", { ascending: false })
        .limit(5);
      return data ?? [];
    },
  });

  const { data: totalLessons } = useQuery({
    queryKey: ["lesson-count"],
    queryFn: async () => {
      const { count } = await supabase.from("lessons").select("id", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: doneLessons } = useQuery({
    queryKey: ["progress-count", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { count } = await supabase.from("progress").select("id", { count: "exact", head: true }).eq("completed", true);
      return count ?? 0;
    },
  });

  if (loading || !user) return null;

  const stats = [
    { Icon: BookOpen, label: "Courses Enrolled", value: enrollments?.length ?? 0 },
    { Icon: FileCheck, label: "Lessons Completed", value: doneLessons ?? 0 },
    { Icon: Activity, label: "Quiz Attempts", value: attempts?.length ?? 0 },
    { Icon: Medal, label: "Current Plan", value: subscription?.plan ?? "FREE" },
  ];

  const activity = [
    ...(attempts ?? []).map((a) => ({
      key: `a-${a.id}`,
      label: `Quiz: ${(a.quizzes as { title?: string } | null)?.title ?? "Quiz"}`,
      detail: `${a.score}/${a.max_score} (${Math.round(a.percentage)}%)`,
      at: a.completed_at,
    })),
  ];

  return (
    <PageShell title={`Welcome, ${profile?.full_name ?? "Player"}`} intro="Track your education progress and academy activity in one place.">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ Icon, label, value }) => (
          <div key={label} className="cathedral-press rounded-[20px_20px_4px_4px] p-5 text-center">
            <span className="neu-circle mx-auto mb-3 flex h-12 w-12 items-center justify-center text-accent">
              <Icon size={20} />
            </span>
            <div className="display text-2xl uppercase text-accent">{value}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-3">
        <CathedralCard className="lg:col-span-2">
          <h2 className="engraved-title mb-5 text-xl uppercase">My Courses</h2>
          {(enrollments ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">
              You are not enrolled yet. Head to the Education Hub to start learning.
            </p>
          ) : (
            <ul className="grid gap-5">
              {(enrollments ?? []).map((e) => (
                <li key={e.id} className="cathedral-press rounded-[16px_16px_4px_4px] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="engraved-title text-base uppercase">
                        {(e.courses as { title?: string } | null)?.title ?? "Course"}
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {Math.round(e.progress)}% complete
                      </p>
                    </div>
                    <Link to="/courses/$courseId" params={{ courseId: e.course_id }} className="btn-firm text-xs">
                      Continue →
                    </Link>
                  </div>
                  <div className="mt-3 h-2.5 w-full rounded-full bg-background shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2)]">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${Math.round(e.progress)}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CathedralCard>

        <div className="grid gap-10">
          <CathedralCard>
            <h2 className="engraved-title mb-4 text-lg uppercase">Subscription</h2>
            <p className="text-sm">
              Plan: <strong>{subscription?.plan ?? "FREE"}</strong>
              {subscription?.status ? ` · ${subscription.status}` : ""}
            </p>
            <div className="mt-4">
              <Link to="/subscription" className="btn-quiet text-xs">
                Manage Plan
              </Link>
            </div>
          </CathedralCard>

          <CathedralCard>
            <h2 className="engraved-title mb-4 flex items-center gap-2 text-lg uppercase">
              <MessageSquare size={18} className="text-primary" /> Recent Activity
            </h2>
            {activity.length === 0 ? (
              <p className="text-sm text-muted-foreground">No activity yet. Complete a quiz to see it here.</p>
            ) : (
              <ul className="grid gap-3 text-sm">
                {activity.map((a) => (
                  <li key={a.key} className="cathedral-press rounded-[12px_12px_4px_4px] p-3">
                    <p className="font-semibold">{a.label}</p>
                    <p className="text-xs text-muted-foreground">{a.detail}</p>
                  </li>
                ))}
              </ul>
            )}
          </CathedralCard>

          <CathedralCard className="flex items-center gap-4">
            <FootballMark className="h-12 w-12" />
            <p className="text-sm">
              {totalLessons ?? 0} lessons across the Education Hub. Catch them young — build them
              strong.
            </p>
          </CathedralCard>
        </div>
      </div>
    </PageShell>
  );
}
