import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock3,
  GraduationCap,
  Trophy,
} from "lucide-react";

import {
  getLessonProgress,
  listLessonsByCourse,
  type LessonProgress,
} from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import {
  CathedralCard,
  FootballMark,
  PageShell,
} from "@/components/cathedral";

type LessonProgressMap = Record<string, LessonProgress | null>;

export function CourseDetail() {
  const { courseId } = useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["education-course", courseId],
    enabled: !!user && !loading && !!courseId,
    queryFn: () => {
      if (!courseId) {
        throw new Error("Course ID is required");
      }

      return listLessonsByCourse(courseId);
    },
  });

  const lessons = data?.lessons ?? [];

  const {
    data: progressMap,
    isLoading: progressLoading,
  } = useQuery({
    queryKey: [
      "education-course-progress-ui",
      courseId,
      lessons.map((lesson) => lesson.id).join(","),
    ],
    enabled: !!user && !loading && !!courseId && lessons.length > 0,
    queryFn: async (): Promise<LessonProgressMap> => {
      const entries = await Promise.all(
        lessons.map(async (lesson) => {
          const result = await getLessonProgress(lesson.id);

          return [lesson.id, result.progress] as const;
        }),
      );

      return Object.fromEntries(entries);
    },
  });

  if (loading) {
    return null;
  }

  if (!user) {
    void navigate("/auth", { replace: true });

    return null;
  }

  if (isLoading) {
    return (
      <PageShell
        title="Course"
        intro="Loading your course from the Education Hub."
      >
        <CathedralCard>
          <p className="text-sm text-muted-foreground">
            Loading course content…
          </p>
        </CathedralCard>
      </PageShell>
    );
  }

  if (isError || !data) {
    return (
      <PageShell
        title="Course Unavailable"
        intro="This course could not be loaded from the Education Hub."
      >
        <CathedralCard>
          <p className="text-sm text-muted-foreground">
            The course may not exist, may not be published yet, or
            your active education access may need to be refreshed.
          </p>
        </CathedralCard>
      </PageShell>
    );
  }

  const { course } = data;

  const completedLessons = lessons.filter(
    (lesson) => progressMap?.[lesson.id]?.completedAt,
  ).length;

  const totalLessons = lessons.length;
  const progressPercent =
    totalLessons > 0
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0;

  const courseComplete =
    totalLessons > 0 && completedLessons === totalLessons;

  return (
    <PageShell
      title={course.title}
      intro={course.description ?? "Continue your learning journey."}
    >
      <div className="space-y-8">
        <CathedralCard className="overflow-hidden">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="flex items-start gap-4">
                <span className="neu-circle flex h-14 w-14 shrink-0 items-center justify-center text-accent">
                  <GraduationCap className="h-7 w-7" />
                </span>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    {course.subject.name}
                  </p>

                  <h2 className="engraved-title mt-1 text-2xl uppercase leading-tight md:text-3xl">
                    {course.title}
                  </h2>
                </div>
              </div>

              {course.description && (
                <p className="mt-6 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
                  {course.description}
                </p>
              )}
            </div>

            <div className="flex justify-start lg:justify-end">
              <FootballMark className="h-20 w-20" />
            </div>
          </div>

          <div className="mt-8 border-t border-border pt-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Course Progress
                </p>

                <p className="mt-1 text-2xl font-black">
                  {progressLoading ? "…" : `${progressPercent}%`}
                </p>
              </div>

              <p className="text-sm text-muted-foreground">
                {progressLoading
                  ? "Checking your lessons…"
                  : `${completedLessons} of ${totalLessons} lessons completed`}
              </p>
            </div>

            <div className="mt-4 h-4 overflow-hidden rounded-full border border-border bg-background p-1">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <BookOpen size={14} />
                {totalLessons} Lessons
              </span>

              {courseComplete && (
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                  <Trophy size={14} />
                  Course Complete
                </span>
              )}
            </div>
          </div>
        </CathedralCard>

        {totalLessons === 0 ? (
          <CathedralCard>
            <div className="flex items-start gap-4">
              <span className="neu-circle flex h-12 w-12 shrink-0 items-center justify-center text-accent">
                <BookOpen size={21} />
              </span>

              <div>
                <h2 className="engraved-title text-lg uppercase">
                  Course Lessons
                </h2>

                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  This course has been published, but no lessons have
                  been added yet.
                </p>
              </div>
            </div>
          </CathedralCard>
        ) : (
          <section className="space-y-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Your learning path
              </p>

              <h2 className="engraved-title mt-1 text-2xl uppercase">
                Course Lessons
              </h2>
            </div>

            <div className="grid gap-5">
              {lessons.map((lesson, index) => {
                const completed =
                  !!progressMap?.[lesson.id]?.completedAt;

                return (
                  <CathedralCard
                    key={lesson.id}
                    className="transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <div className="flex items-start gap-4">
                      <span className="neu-circle flex h-12 w-12 shrink-0 items-center justify-center text-accent">
                        {completed ? (
                          <CheckCircle2
                            size={22}
                            className="text-primary"
                          />
                        ) : (
                          <Circle size={22} />
                        )}
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                              Lesson {index + 1}
                            </p>

                            <h3 className="engraved-title mt-1 text-lg uppercase leading-tight md:text-xl">
                              {lesson.title}
                            </h3>
                          </div>

                          <span
                            className={`text-[10px] font-bold uppercase tracking-widest ${
                              completed
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
                          >
                            {completed ? "Completed" : "Not started"}
                          </span>
                        </div>

                        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
                          <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock3 size={14} />
                            Lesson {lesson.position}
                          </span>

                          <Link
                            to={`/lessons/${lesson.id}`}
                            className="btn-firm text-xs"
                          >
                            {completed
                              ? "Review Lesson"
                              : "Open Lesson"}
                            <ArrowRight
                              size={14}
                              className="ml-1 inline"
                            />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CathedralCard>
                );
              })}
            </div>
          </section>
        )}

        <CathedralCompletion courseComplete={courseComplete} />
      </div>
    </PageShell>
  );
}

function CathedralCompletion({
  courseComplete,
}: {
  courseComplete: boolean;
}) {
  if (!courseComplete) {
    return null;
  }

  return (
    <CathedralCard>
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <span className="neu-circle flex h-12 w-12 shrink-0 items-center justify-center text-accent">
            <Trophy size={22} />
          </span>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              Achievement Unlocked
            </p>

            <h2 className="engraved-title mt-1 text-xl uppercase">
              Course Complete
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              You have completed every lesson in this course.
            </p>
          </div>
        </div>
      </div>
    </CathedralCard>
  );
}
