import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { CathedralCard, FootballMark, PageShell } from "@/components/cathedral";

export const Route = createFileRoute("/quizzes/$quizId")({
  head: () => ({
    meta: [
      { title: "Quiz — Allen Premier Football Academy Education Hub" },
      { name: "description", content: "Test your knowledge and earn a certificate in the Allen Premier Football Academy Education Hub." },
    ],
  }),
  component: QuizPage,
});

function QuizPage() {
  const { quizId } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ score: number; total: number; percentage: number; passed: boolean } | null>(null);
  const [busy, setBusy] = useState(false);

  const { data: quiz } = useSuspenseQuery({
    queryKey: ["quiz", quizId],
    queryFn: async () => {
      const { data, error } = await supabase.from("quizzes").select("*, lessons(id, title, course_id)").eq("id", quizId).single();
      if (error) throw error;
      return data;
    },
  });

  const { data: questions } = useSuspenseQuery({
    queryKey: ["quiz-questions", quizId],
    queryFn: async () => {
      const { data } = await supabase.from("questions").select("*").eq("quiz_id", quizId).order("order");
      return data ?? [];
    },
  });

  const { data: attempts } = useQuery({
    queryKey: ["my-attempts", user?.id, quizId],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("quiz_attempts")
        .select("*")
        .eq("quiz_id", quizId)
        .order("started_at", { ascending: false })
        .limit(3);
      return data ?? [];
    },
  });

  const maxScore = useMemo(() => questions.reduce((sum, q) => sum + q.points, 0), [questions]);

  async function submit() {
    if (!user) {
      navigate({ to: "/auth" });
      return;
    }
    if (Object.keys(answers).length < questions.length) {
      toast.error("Answer every question before submitting.");
      return;
    }
    const score = questions.reduce((sum, q) => (answers[q.id] === q.correct_answer ? sum + q.points : sum), 0);
    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
    const passed = percentage >= quiz.passing_score;
    setBusy(true);
    const { error } = await supabase.from("quiz_attempts").insert({
      user_id: user.id,
      quiz_id: quizId,
      score,
      passed,
      answers,
      completed_at: new Date().toISOString(),
    });
    setBusy(false);
    if (error) {
      toast.error("Could not save your attempt. Please try again.");
      return;
    }
    setResult({ score, total: maxScore, percentage, passed });
    queryClient.invalidateQueries({ queryKey: ["my-attempts", user.id, quizId] });
  }

  const lesson = quiz.lessons as { id: string; title: string; course_id: string } | null;

  return (
    <PageShell title={quiz.title} intro={quiz.description ?? `Pass mark: ${quiz.passing_score}%`}>
      {result ? (
        <CathedralCard className="mx-auto max-w-xl text-center">
          <h2 className={`display text-4xl uppercase ${result.passed ? "text-primary" : "text-accent"}`}>
            {result.passed ? "Passed!" : "Try Again"}
          </h2>
          <p className="display mt-4 text-3xl text-accent">
            {result.score} / {result.total}
          </p>
          <p className="mt-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {Math.round(result.percentage)}% — pass mark {quiz.passing_score}%
          </p>
          {result.passed ? (
            <p className="mt-4 text-sm">Well done! Your result has been recorded on your dashboard.</p>
          ) : (
            <p className="mt-4 text-sm">Review the lesson and take the quiz again when you are ready.</p>
          )}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {lesson ? (
              <Link to="/lessons/$lessonId" params={{ lessonId: lesson.id }} className="btn-firm text-xs">
                Back to Lesson
              </Link>
            ) : null}
            <button
              type="button"
              className="btn-quiet text-xs"
              onClick={() => { setAnswers({}); setResult(null); }}
            >
              Retake Quiz
            </button>
          </div>
        </CathedralCard>
      ) : (
        <div className="grid gap-6">
          {questions.map((q, i) => (
            <CathedralCard key={q.id}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Question {i + 1} · {q.points} point{q.points === 1 ? "" : "s"}
              </p>
              <h2 className="engraved-title mt-1 text-lg">{q.text}</h2>
              <div className="mt-4 grid gap-2">
                {q.options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
                    className={`rounded-[12px_12px_4px_4px] px-4 py-3 text-left text-sm ${
                      answers[q.id] === opt ? "btn-firm" : "cathedral-press"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </CathedralCard>
          ))}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <FootballMark className="h-10 w-10" />
            <button type="button" className="btn-firm" onClick={submit} disabled={busy}>
              {busy ? "Submitting…" : user ? "Submit Answers" : "Sign In to Submit"}
            </button>
          </div>
        </div>
      )}

      {(attempts ?? []).length > 0 && !result ? (
        <CathedralCard className="mt-10">
          <h2 className="engraved-title mb-4 text-lg uppercase">Previous Attempts</h2>
          <ul className="grid gap-2 text-sm">
            {(attempts ?? []).map((a) => (
              <li key={a.id} className="cathedral-press flex items-center justify-between rounded-[12px_12px_4px_4px] p-3">
                <span>{a.score} / {maxScore} points</span>
                <span className={a.passed ? "font-bold text-primary" : "font-bold text-accent"}>
                  {a.passed ? "Passed" : "Not passed"}
                </span>
              </li>
            ))}
          </ul>
        </CathedralCard>
      ) : null}
    </PageShell>
  );
}
