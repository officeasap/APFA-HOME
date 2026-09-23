import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
  GraduationCap,
  Trophy,
} from "lucide-react";

import {
  completeLesson,
  getLessonProgress,
  listLessonsByCourse,
  type Course,
  type Lesson,
  type LessonProgress,
} from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { MarkdownLesson } from "@/components/education/MarkdownLesson";
import {
  CathedralCard,
  FootballMark,
  PageShell,
} from "@/components/cathedral";

type LessonContext = {
  course: Course;
  lesson: Lesson & {
    courseId: string;
    course: Course;
  };
  progress: LessonProgress | null;
};

export function LessonPage() {
  const { lessonId } = useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: lessonContext,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["education-lesson", lessonId],
    enabled: !!user && !loading && !!lessonId,
    queryFn: async (): Promise<LessonContext | null> => {
      if (!lessonId) {
        return null;
      }

      const result = await getLessonProgress(lessonId);

      return {
        course: result.lesson.course,
        lesson: result.lesson,
        progress: result.progress,
      };
    },
  });

  const courseSlug = lessonContext?.course.slug;

  const {
    data: courseLessons,
    isLoading: courseLessonsLoading,
  } = useQuery({
    queryKey: ["education-course-lessons", courseSlug],
    enabled: !!user && !loading && !!courseSlug,
    queryFn: () => {
      if (!courseSlug) {
        throw new Error("Course slug is required");
      }

      return listLessonsByCourse(courseSlug);
    },
  });

  const completeLessonMutation = useMutation({
    mutationFn: async () => {
      if (!lessonId) {
        throw new Error("Lesson ID is required");
      }

      return completeLesson(lessonId);
    },
    onSuccess: (result) => {
      queryClient.setQueryData(
        ["education-lesson", lessonId],
        {
          course: result.lesson.course,
          lesson: result.lesson,
          progress: result.progress,
        },
      );

      queryClient.invalidateQueries({
        queryKey: [
          "education-course-progress-ui",
          result.lesson.course.slug,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: ["education-course", result.lesson.course.slug],
      });
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
        title="Lesson"
        intro="Loading your lesson from the Education Hub."
      >
        <CathedralCard>
          <p className="text-sm text-muted-foreground">
            Loading lesson content…
          </p>
        </CathedralCard>
      </PageShell>
    );
  }

  if (isError || !lessonContext) {
    return (
      <PageShell
        title="Lesson Unavailable"
        intro="This lesson could not be loaded from the Education Hub."
      >
        <CathedralCard>
          <p className="text-sm text-muted-foreground">
            The lesson may not exist, may not be published yet, or
            your active education access may need to be refreshed.
          </p>
        </CathedralCard>
      </PageShell>
    );
  }

  const { course, lesson, progress } = lessonContext;

  const lessons = courseLessons?.lessons ?? [];
  const currentIndex = lessons.findIndex(
    (item) => item.id === lesson.id,
  );

  const previousLesson =
    currentIndex > 0 ? lessons[currentIndex - 1] : null;

  const nextLesson =
    currentIndex >= 0 && currentIndex < lessons.length - 1
      ? lessons[currentIndex + 1]
      : null;

  const isCompleted = !!progress?.completedAt;
  const isLastLesson =
    lessons.length > 0 &&
    currentIndex === lessons.length - 1;

  return (
    <PageShell
      title={lesson.title}
      intro={`Part of ${course.title}`}
    >
      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            to={`/courses/${course.slug}`}
            className="btn-quiet text-xs"
          >
            <ArrowLeft
              size={14}
              className="mr-1 inline"
            />
            Back to Course
          </Link>

          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <BookOpen size={14} />
            Lesson {lesson.position}
          </span>
        </div>

        <CathedralCard className="overflow-hidden">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <span className="neu-circle flex h-14 w-14 shrink-0 items-center justify-center text-accent">
                <GraduationCap className="h-7 w-7" />
              </span>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  {course.subject.name}
                </p>

                <h2 className="engraved-title mt-1 text-xl uppercase leading-tight md:text-2xl">
                  {lesson.title}
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  {course.title}
                </p>
              </div>
            </div>

            <div
              className={`flex shrink-0 items-center gap-2 text-xs font-black uppercase tracking-wider ${
                isCompleted
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 size={18} />
              ) : (
                <Circle size={18} />
              )}

              {isCompleted ? "Completed" : "In Progress"}
            </div>
          </div>
        </CathedralCard>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <CathedralCard className="min-w-0">
            <div className="mb-8 border-b border-border pb-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Canonical lesson
              </p>

              <h1 className="engraved-title mt-1 text-2xl uppercase md:text-3xl">
                Learn. Understand. Create.
              </h1>
            </div>

            <MarkdownLesson content={lesson.content} />

            <div className="mt-10 border-t border-border pt-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    Lesson completion
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {isCompleted
                      ? "This lesson is recorded as completed."
                      : "Finish the lesson, then mark it complete."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    completeLessonMutation.mutate()
                  }
                  disabled={
                    isCompleted ||
                    completeLessonMutation.isPending
                  }
                  className="btn-firm text-xs disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCompleted
                    ? "Lesson Completed"
                    : completeLessonMutation.isPending
                      ? "Saving…"
                      : "Mark Lesson Complete"}
                </button>
              </div>
            </div>
          </CathedralCard>

          <aside className="grid content-start gap-5">
            <CathedralProgress
              completed={isCompleted}
              position={lesson.position}
              total={lessons.length}
            />

            <CathedralCard>
              <div className="flex items-start gap-3">
                <FootballMark className="h-9 w-9 shrink-0" />

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    Course
                  </p>

                  <h2 className="engraved-title mt-1 text-base uppercase leading-tight">
                    {course.title}
                  </h2>
                </div>
              </div>

              <Link
                to={`/courses/${course.slug}`}
                className="btn-quiet mt-5 w-full text-xs"
              >
                View Course →
              </Link>
            </CathedralCard>

            <CathedralCard>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Keep going
              </p>

              <h2 className="engraved-title mt-1 text-base uppercase">
                One lesson at a time.
              </h2>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Every completed lesson moves you closer to
                completing the course.
              </p>
            </CathedralCard>
          </aside>
        </div>

        <CathedralCard>
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Lesson navigation
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {courseLessonsLoading
                  ? "Loading the course path…"
                  : lessons.length > 0
                    ? `${lesson.position} of ${lessons.length}`
                    : "Course path unavailable"}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {previousLesson ? (
                <Link
                  to={`/lessons/${previousLesson.id}`}
                  className="btn-quiet text-xs"
                >
                  <ArrowLeft
                    size={14}
                    className="mr-1 inline"
                  />
                  Previous
                </Link>
              ) : null}

              {nextLesson ? (
                <Link
                  to={`/lessons/${nextLesson.id}`}
                  className="btn-firm text-xs"
                >
                  Next Lesson
                  <ArrowRight
                    size={14}
                    className="ml-1 inline"
                  />
                </Link>
              ) : isLastLesson && isCompleted ? (
                <Link
                  to={`/courses/${course.slug}`}
                  className="btn-firm text-xs"
                >
                  <Trophy
                    size={14}
                    className="mr-1 inline"
                  />
                  Return to Course
                </Link>
              ) : null}
            </div>
          </div>
        </CathedralCard>
      </div>
    </PageShell>
  );
}

function CathedralProgress({
  completed,
  position,
  total,
}: {
  completed: boolean;
  position: number;
  total: number;
}) {
  const percent =
    total > 0
      ? Math.round((position / total) * 100)
      : 0;

  return (
    <CathedralCard>
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
        Your place
      </p>

      <div className="mt-4 flex items-end justify-between gap-3">
        <span className="text-2xl font-black">
          {position}
          <span className="text-sm text-muted-foreground">
            {" "}
            / {total || "—"}
          </span>
        </span>

        <span
          className={`text-xs font-bold uppercase tracking-wider ${
            completed
              ? "text-primary"
              : "text-muted-foreground"
          }`}
        >
          {completed ? "Complete" : "Learning"}
        </span>
      </div>

      <div className="mt-4 h-3 overflow-hidden rounded-full border border-border bg-background p-1">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${percent}%` }}
        />
      </div>
    </CathedralCard>
  );
}
