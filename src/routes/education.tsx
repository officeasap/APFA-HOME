import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BrainCircuit,
  BookOpen,
  Calculator,
  Code2,
  Database,
  FlaskConical,
  GraduationCap,
  Languages,
  Lightbulb,
  Monitor,
  Rocket,
  ShieldCheck,
  Sparkles,
  Bot,
  type LucideIcon,
} from "lucide-react";

import {
  listCoursesBySubject,
  listSubjects,
  type Course,
} from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import {
  CathedralCard,
  FootballMark,
  PageShell,
} from "@/components/cathedral";

const SUBJECT_ICONS: Record<string, LucideIcon> = {
  mathematics: Calculator,
  science: FlaskConical,
  english: BookOpen,
  languages: Languages,

  "computer-studies": Monitor,
  computer_studies: Monitor,

  "artificial-intelligence": BrainCircuit,
  artificial_intelligence: BrainCircuit,
  ai: BrainCircuit,

  "data-science": Database,
  data_science: Database,
  "data-analytics": Database,
  data_analytics: Database,

  robotics: Bot,
  automation: Bot,

  "full-stack-web-development": Code2,
  full_stack_web_development: Code2,
  "web-development": Code2,
  web_development: Code2,

  cybersecurity: ShieldCheck,
  "cyber-security": ShieldCheck,
  cyber_security: ShieldCheck,

  entrepreneurship: Rocket,
  "digital-entrepreneurship": Rocket,
  digital_entrepreneurship: Rocket,

  "critical-thinking": Lightbulb,
  critical_thinking: Lightbulb,
};

function getSubjectIcon(
  slug: string,
  name: string,
): LucideIcon {
  return (
    SUBJECT_ICONS[slug.toLowerCase()] ??
    SUBJECT_ICONS[
      name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "_")
    ] ??
    BookOpen
  );
}

export function Education() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      void navigate("/auth", { replace: true });
    }
  }, [loading, user, navigate]);

  const {
    data: subjects,
    isLoading: subjectsLoading,
    isError: subjectsError,
  } = useQuery({
    queryKey: ["education-subjects"],
    enabled: !!user,
    queryFn: listSubjects,
  });

  const {
    data: courses,
    isLoading: coursesLoading,
    isError: coursesError,
  } = useQuery({
    queryKey: [
      "education-courses",
      subjects?.map((subject) => subject.slug).join(","),
    ],
    enabled: !!user && !!subjects,
    queryFn: async (): Promise<Course[]> => {
      if (!subjects || subjects.length === 0) {
        return [];
      }

      const responses = await Promise.all(
        subjects.map((subject) =>
          listCoursesBySubject(subject.slug),
        ),
      );

      return responses.flatMap(
        (response) => response.courses,
      );
    },
  });

  if (loading || !user) {
    return null;
  }

  const isLoading = subjectsLoading || coursesLoading;
  const hasError = subjectsError || coursesError;
  const courseList = courses ?? [];

  return (
    <PageShell
      title="Education Hub"
      intro="Free, beginner-first learning for curious minds — from first questions to real-world creation."
    >
      <div className="space-y-10">
        {/* HERO */}
        <CathedralCard className="overflow-hidden">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-4xl">
              <div className="flex items-start gap-4">
                <span className="neu-circle flex h-14 w-14 shrink-0 items-center justify-center text-accent">
                  <GraduationCap className="h-7 w-7" />
                </span>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                    APFA Education
                  </p>

                  <h2 className="engraved-title mt-1 text-3xl uppercase leading-tight md:text-5xl">
                    Your next skill
                    <br />
                    starts here.
                  </h2>
                </div>
              </div>

              <p className="mt-7 max-w-3xl text-base leading-8 md:text-lg">
                You do not need to know everything before you
                begin. Start with curiosity, learn one idea at a
                time, and build your confidence through doing.
              </p>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
                APFA brings accessible technology and future-ready
                education into one free learning environment for
                young people and lifelong learners.
              </p>
            </div>

            <div className="hidden lg:block">
              <FootballMark className="h-32 w-32" />
            </div>
          </div>

          <div className="mt-8 grid gap-4 border-t border-border pt-6 sm:grid-cols-3">
            <EducationPillar
              icon={Lightbulb}
              title="Curiosity"
              text="Ask questions without fear."
            />

            <EducationPillar
              icon={BookOpen}
              title="Learning"
              text="Understand ideas step by step."
            />

            <EducationPillar
              icon={Rocket}
              title="Creation"
              text="Turn knowledge into something real."
            />
          </div>
        </CathedralCard>

        {/* PRINCIPLE */}
        <section>
          <div className="mb-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
              The APFA approach
            </p>

            <h2 className="engraved-title mt-1 text-2xl uppercase md:text-3xl">
              Learn without intimidation.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <PrincipleCard
              icon={Sparkles}
              title="Beginner First"
              text="No assumed technical background. We explain the idea before the technical language."
            />

            <PrincipleCard
              icon={Code2}
              title="Learn by Creating"
              text="Do not just memorize. Experiment, build, solve problems, and make things."
            />

            <PrincipleCard
              icon={BrainCircuit}
              title="Future Ready"
              text="Develop skills around AI, computing, data, technology, and creative problem-solving."
            />
          </div>
        </section>

        {/* COURSE GATEWAY */}
        <section>
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                Your learning doors
              </p>

              <h2 className="engraved-title mt-1 text-2xl uppercase md:text-3xl">
                Choose where curiosity takes you.
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
                Every course is a starting point. Choose one,
                open the first lesson, and begin building.
              </p>
            </div>

            {courseList.length > 0 && (
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {courseList.length}{" "}
                {courseList.length === 1 ? "course" : "courses"}
              </span>
            )}
          </div>

          {isLoading ? (
            <CathedralCard>
              <div className="flex items-center gap-4">
                <FootballMark className="h-10 w-10 shrink-0" />

                <div>
                  <p className="text-sm font-semibold">
                    Opening the Education Hub…
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Loading your available learning paths.
                  </p>
                </div>
              </div>
            </CathedralCard>
          ) : hasError ? (
            <CathedralCard>
              <div className="flex items-start gap-4">
                <span className="neu-circle flex h-12 w-12 shrink-0 items-center justify-center text-accent">
                  <BookOpen size={21} />
                </span>

                <div>
                  <h2 className="engraved-title text-lg uppercase">
                    Education Hub Unavailable
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
                    We could not load the current course catalogue.
                    Please refresh and try again.
                  </p>
                </div>
              </div>
            </CathedralCard>
          ) : courseList.length === 0 ? (
            <CathedralCard>
              <div className="flex items-start gap-4">
                <FootballMark className="h-12 w-12 shrink-0" />

                <div>
                  <h2 className="engraved-title text-lg uppercase">
                    Your First Door Is Coming
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
                    The Education Hub is ready for learning
                    content. Courses will appear here as they
                    become available.
                  </p>
                </div>
              </div>
            </CathedralCard>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {courseList.map((course) => {
                const Icon = getSubjectIcon(
                  course.subject.slug,
                  course.subject.name,
                );

                return (
                  <CathedralCard
                    key={course.id}
                    className="group flex min-h-[270px] flex-col"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="neu-circle flex h-13 w-13 shrink-0 items-center justify-center text-accent">
                        <Icon size={23} />
                      </span>

                      <span className="text-[9px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                        Course
                      </span>
                    </div>

                    <div className="mt-6">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        {course.subject.name}
                      </p>

                      <h3 className="engraved-title mt-1 text-xl uppercase leading-tight">
                        {course.title}
                      </h3>
                    </div>

                    <div className="mt-4 h-px w-full bg-border" />

                    <p className="mt-5 line-clamp-4 text-sm leading-6 text-muted-foreground">
                      {course.description ??
                        "Start from the foundations, learn step by step, and build your confidence through practice."}
                    </p>

                    <div className="mt-auto flex items-center justify-between gap-4 pt-7">
                      <FootballMark className="h-9 w-9 shrink-0" />

                      <button
                        type="button"
                        className="btn-firm text-xs"
                        onClick={() => {
                          void navigate(
                            `/courses/${course.slug}`,
                          );
                        }}
                      >
                        Enter Course
                        <ArrowRight
                          size={14}
                          className="ml-1 inline"
                        />
                      </button>
                    </div>
                  </CathedralCard>
                );
              })}
            </div>
          )}
        </section>

        {/* CLOSING */}
        <CathedralCard>
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-3xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
                The APFA promise
              </p>

              <h2 className="engraved-title mt-1 text-xl uppercase md:text-2xl">
                Catch Them Young. Build Them Strong. Teach Them
                to Create.
              </h2>

              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                One question becomes one discovery. One discovery
                becomes one skill. One skill can become something
                you build, solve, share, or use to create an
                opportunity.
              </p>
            </div>

            <FootballMark className="hidden h-16 w-16 shrink-0 md:block" />
          </div>
        </CathedralCard>
      </div>
    </PageShell>
  );
}

function EducationPillar({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="neu-circle flex h-10 w-10 shrink-0 items-center justify-center text-accent">
        <Icon size={18} />
      </span>

      <div>
        <p className="text-xs font-black uppercase tracking-wider">
          {title}
        </p>

        <p className="mt-0.5 text-xs text-muted-foreground">
          {text}
        </p>
      </div>
    </div>
  );
}

function PrincipleCard({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <CathedralCard>
      <span className="neu-circle flex h-11 w-11 items-center justify-center text-accent">
        <Icon size={20} />
      </span>

      <h3 className="engraved-title mt-4 text-base uppercase">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {text}
      </p>
    </CathedralCard>
  );
}
