import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Award,
  Bell,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Headphones,
  LifeBuoy,
  MessageCircle,
  Play,
  Rocket,
  Settings,
  ShieldCheck,
  Target,
  Trophy,
  type LucideIcon,
} from "lucide-react";

import {
  listCoursesBySubject,
  listSubjects,
  logout,
  type Course,
} from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

const OFFICIAL_LOGO =
  "/Allen-Premier-Football-Academy-Logo.png";

type SidebarItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Target,
  },
  {
    label: "My Courses",
    href: "/education",
    icon: BookOpen,
  },
  {
    label: "Contact Support",
    href: "/contact",
    icon: Headphones,
  },
];

function OfficialLogo({
  className = "",
  alt = "",
}: {
  className?: string;
  alt?: string;
}) {
  return (
    <img
      src={OFFICIAL_LOGO}
      alt={alt}
      className={`object-contain ${className}`}
    />
  );
}

export function Dashboard() {
  const { user, loading, clearAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      void navigate("/auth", { replace: true });
    }
  }, [loading, user, navigate]);

  const { data: subjects, isLoading: subjectsLoading } = useQuery({
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
      "dashboard-courses",
      subjects?.map((subject) => subject.slug).join(","),
    ],
    enabled: !!user && !!subjects,
    queryFn: async (): Promise<Course[]> => {
      if (!subjects?.length) {
        return [];
      }

      const responses = await Promise.all(
        subjects.map((subject) => listCoursesBySubject(subject.slug)),
      );

      return responses.flatMap((response) => response.courses);
    },
  });

  const courseList = courses ?? [];

  const firstName =
    user?.fullName?.trim().split(/\s+/)[0] || "Learner";

  const today = useMemo(
    () =>
      new Intl.DateTimeFormat("en", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date()),
    [],
  );

  async function signOut() {
    try {
      await logout();
    } finally {
      clearAuth();
      navigate("/auth", { replace: true });
    }
  }

  if (loading || !user) {
    return null;
  }

  const isLoadingCatalogue = subjectsLoading || coursesLoading;
  const featuredCourses = courseList.slice(0, 3);

  return (
    <div className="apfa-dashboard min-h-screen">
      {/* =====================================================
          ZONE 1 — FLOATING HEADER
          ===================================================== */}
      <header className="apfa-dashboard-header flex items-center gap-6">
        <Link
          to="/dashboard"
          className="flex min-w-0 shrink-0 items-center gap-3"
          aria-label="APFA Dashboard"
        >
          <span className="apfa-header-mark flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--apfa-card-deep)] p-1.5">
            <OfficialLogo
              className="h-full w-full"
              alt="Allen Premier Football Academy"
            />
          </span>

          <span className="hidden leading-none sm:block">
            <strong className="block text-xl font-black tracking-tight text-[#f8f1e4]">
              APFA
            </strong>

            <span className="mt-1 block text-[8px] font-semibold uppercase tracking-[0.18em] text-[#d9d0c9]">
              ALLEN PREMIER
            </span>

            <span className="block text-[8px] font-semibold uppercase tracking-[0.18em] text-[#d9d0c9]">
              FOOTBALL ACADEMY
            </span>
          </span>
        </Link>

        <nav
          className="hidden flex-1 items-center justify-center gap-2 xl:flex"
          aria-label="Dashboard navigation"
        >
          <Link
            to="/dashboard"
            className="apfa-header-nav apfa-header-active"
          >
            Dashboard
          </Link>

          <Link to="/training" className="apfa-header-nav">
            Training
          </Link>

          <Link to="/education" className="apfa-header-nav">
            Education
          </Link>

          <Link to="/screening" className="apfa-header-nav">
            Screening
          </Link>

          <Link to="/contact" className="apfa-header-nav">
            Support
          </Link>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-3">
          <button
            type="button"
            className="apfa-header-icon"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="apfa-notification-dot" />
          </button>

          <Link
            to="/dashboard"
            className="apfa-avatar-chip"
            aria-label="Open dashboard profile"
          >
            <span className="apfa-avatar overflow-hidden">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt=""
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <OfficialLogo
                  className="h-full w-full p-1"
                  alt=""
                />
              )}
            </span>

            <span className="hidden text-left md:block">
              <strong className="block text-xs text-[#f8f1e4]">
                {firstName}
              </strong>

              <span className="block text-[9px] uppercase tracking-[0.14em] text-[#d9d0c9]/70">
                APFA Member
              </span>
            </span>
          </Link>
        </div>
      </header>

      {/* =====================================================
          ZONE 2 — MEMBER SIDEBAR
          ONLY REAL DESTINATIONS + REAL LOGOUT
          ===================================================== */}
      <aside className="apfa-dashboard-sidebar">
        <div className="flex h-full flex-col">
          <div className="mb-5">
            <p className="px-2 text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#d9d0c9]/55">
              Member Navigation
            </p>
          </div>

          <nav
            className="grid gap-1.5"
            aria-label="Member navigation"
          >
            {SIDEBAR_ITEMS.map(
              ({ label, href, icon: Icon }) => {
                const active = label === "Dashboard";

                return (
                  <Link
                    key={label}
                    to={href}
                    className={`apfa-sidebar-item ${
                      active ? "apfa-sidebar-active" : ""
                    }`}
                  >
                    <Icon size={17} aria-hidden="true" />
                    <span>{label}</span>
                  </Link>
                );
              },
            )}
          </nav>

          <div className="mt-3">
            <button
              type="button"
              onClick={() => void signOut()}
              className="apfa-sidebar-item w-full text-left"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-[17px] w-[17px]"
                aria-hidden="true"
              >
                <path
                  d="M10 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M14 8l4 4-4 4M9 12h9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span>Sign Out</span>
            </button>
          </div>

          <div className="mt-auto">
            <div className="apfa-crest-tile p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--apfa-card-deep)] p-1">
                  <OfficialLogo
                    className="h-full w-full"
                    alt="Allen Premier Football Academy"
                  />
                </span>

                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#f8f1e4]/55">
                    APFA
                  </p>

                  <p className="mt-1 text-xs font-bold text-[#f8f1e4]">
                    Learn. Build. Accomplish.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 px-2">
              <span className="apfa-system-dot" />

              <div>
                <p className="text-xs font-bold text-[#f8f1e4]">
                  System Online
                </p>

                <p className="text-[9px] text-[#d9d0c9]/55">
                  All services operational
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* =====================================================
          ZONE 6 — RIGHT RAIL
          ===================================================== */}
      <aside className="apfa-dashboard-right-rail space-y-5">
        <div className="apfa-floating-slab rounded-[16px] p-5">
          <div className="flex items-center gap-4">
            <div className="apfa-right-avatar overflow-hidden">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt=""
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <OfficialLogo
                  className="h-full w-full p-2"
                  alt=""
                />
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate text-base font-bold text-[#f8f1e4]">
                {user.fullName || "APFA Learner"}
              </p>

              <p className="mt-1 text-xs text-[#d9d0c9]/60">
                APFA Member
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-2">
            <DashboardStatRow
              icon={BookOpen}
              label="Courses Enrolled"
              value={
                isLoadingCatalogue
                  ? "—"
                  : String(courseList.length)
              }
            />

            <DashboardStatRow
              icon={CheckCircle2}
              label="Completed"
              value="—"
            />

            <DashboardStatRow
              icon={Target}
              label="In Progress"
              value="—"
            />

            <DashboardStatRow
              icon={Award}
              label="Certificates"
              value="0"
            />
          </div>

          <Link
            to="/dashboard"
            className="apfa-pill-button mt-5 w-full"
          >
            View Profile
          </Link>

          <button
            type="button"
            onClick={() => void signOut()}
            className="apfa-pill-button mt-2 w-full"
          >
            Sign Out
          </button>
        </div>

        <div className="apfa-floating-slab rounded-[16px] p-5">
          <div className="mb-4 flex items-center gap-2">
            <Rocket
              size={17}
              className="text-[#6bc444]"
              aria-hidden="true"
            />

            <h2 className="text-sm font-black uppercase tracking-[0.12em]">
              Quick Actions
            </h2>
          </div>

          <div className="grid gap-2">
            <QuickAction
              icon={BookOpen}
              label="View Courses"
              href="/education"
            />

            <QuickAction
              icon={Target}
              label="Track Progress"
              href="/dashboard"
            />

            <QuickAction
              icon={Award}
              label="Certificates"
              href="/dashboard"
            />

            <QuickAction
              icon={Headphones}
              label="Contact Support"
              href="/contact"
            />
          </div>
        </div>
      </aside>

      {/* =====================================================
          ZONE 3 — NAVE
          ===================================================== */}
      <main className="apfa-dashboard-main">
        <section className="mb-8">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="apfa-nave-eyebrow">
                WELCOME BACK
              </p>

              <div className="apfa-orange-underline" />

              <h1 className="apfa-nave-title mt-4">
                Your Learning Journey
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#365036] md:text-base">
                Welcome back, {firstName}. Learn deliberately,
                complete your lessons, and keep building what you
                can do.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="apfa-lozenge">
                <span className="font-bold">Today</span>
                <span>{today}</span>
              </span>

              <span className="apfa-lozenge">
                <span className="apfa-active-dot" />
                <strong>Active Learner</strong>
                <span>Keep going!</span>
              </span>
            </div>
          </div>
        </section>

        {/* ===================================================
            ZONE 4 — PRIMARY CARDS
            =================================================== */}
        <section className="grid gap-5 xl:grid-cols-3">
          <PrimaryCard
            eyebrow="Lesson 1"
            title={
              featuredCourses[0]?.title ||
              "Introduction to Football Fundamentals"
            }
            body={
              featuredCourses[0]?.description ||
              "Start with the foundations, understand the core principles, and build your learning rhythm."
            }
            action="OPEN LESSON"
            href={
              featuredCourses[0]
                ? `/courses/${featuredCourses[0].slug}`
                : "/education"
            }
          />

          <PrimaryCard
            eyebrow="Goal Tracking"
            title="Improve Ball Control"
            body="Track progress and keep moving toward the skills and knowledge you are building."
            action="VIEW PROGRESS"
            href="/dashboard"
          />

          <PrimaryCard
            eyebrow="Next Lesson"
            title={
              featuredCourses[1]?.title ||
              "Attacking Principles"
            }
            body={
              featuredCourses[1]?.description ||
              "Movement, positioning, decision making, and the next step in your learning path."
            }
            action="CONTINUE"
            href={
              featuredCourses[1]
                ? `/courses/${featuredCourses[1].slug}`
                : "/education"
            }
            tag="NEXT LESSON"
          />
        </section>

        {/* ===================================================
            CATALOGUE BRIDGE
            =================================================== */}
        <section className="mt-7">
          <div className="apfa-floating-slab rounded-[18px] p-5 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#d9d0c9]/55">
                  Education
                </p>

                <h2 className="mt-1 font-serif text-2xl font-medium text-[#f8f1e4]">
                  Your APFA learning catalogue
                </h2>
              </div>

              <Link
                to="/education"
                className="apfa-pill-button"
              >
                VIEW ALL COURSES
                <ChevronRight size={15} />
              </Link>
            </div>

            {coursesError ? (
              <div className="apfa-carved mt-5 p-5 text-sm text-[#f8f1e4]/65">
                The learning catalogue could not be loaded
                right now.
              </div>
            ) : isLoadingCatalogue ? (
              <div className="apfa-carved mt-5 p-5 text-sm text-[#f8f1e4]/65">
                Loading your available courses…
              </div>
            ) : courseList.length === 0 ? (
              <div className="apfa-carved mt-5 p-5 text-sm text-[#f8f1e4]/65">
                No courses are currently available.
              </div>
            ) : (
              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {featuredCourses.map((course) => (
                  <Link
                    key={course.id}
                    to={`/courses/${course.slug}`}
                    className="apfa-mini-course"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--apfa-card-deep)] p-1">
                        <OfficialLogo
                          className="h-full w-full"
                          alt=""
                        />
                      </span>

                      <div className="min-w-0">
                        <span className="text-[9px] font-black uppercase tracking-[0.16em] text-[#8ed087]">
                          {course.subject.name}
                        </span>

                        <h3 className="mt-1 truncate text-sm font-bold text-[#f8f1e4]">
                          {course.title}
                        </h3>
                      </div>
                    </div>

                    <ChevronRight
                      size={14}
                      className="shrink-0 text-[#6bc444]"
                    />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ===================================================
            ZONE 5 — CONTROL DECK
            =================================================== */}
        <section className="mt-7">
          <div className="apfa-control-deck">
            <div>
              <p className="apfa-control-label">
                SELECT PROGRAM
              </p>

              <div className="apfa-carved apfa-select-well">
                <span>Education &amp; Future Skills</span>
                <ChevronRight size={17} />
              </div>
            </div>

            <div className="mt-5">
              <p className="apfa-control-label">
                PROGRAM STATUS
              </p>

              <div className="mt-2 flex flex-wrap gap-3">
                <span className="apfa-radio-pill">
                  <span className="apfa-radio-selected" />
                  Active Learner
                </span>

                <span className="apfa-radio-pill">
                  <span className="apfa-radio-empty" />
                  Training
                </span>
              </div>
            </div>

            <div className="apfa-report-panel mt-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="apfa-control-label">
                    SUBMIT REPORT
                  </p>

                  <p className="mt-1 text-xs text-[#d9d0c9]/55">
                    Share a learning issue or request with APFA.
                  </p>
                </div>

                <Settings
                  size={17}
                  className="text-[#6bc444]"
                />
              </div>

              <textarea
                className="apfa-report-textarea mt-4"
                maxLength={1000}
                placeholder="Tell APFA what you need help with…"
                rows={4}
              />

              <div className="mt-3 flex items-center justify-end">
                <span className="text-[10px] font-bold text-[#d9d0c9]/45">
                  0/1000
                </span>
              </div>

              <button
                type="button"
                className="apfa-pill-button mt-4"
              >
                SAVE
              </button>
            </div>
          </div>
        </section>

        {/* ===================================================
            ZONE 7 — CREED STRIP
            =================================================== */}
        <section className="apfa-creed-strip mt-7">
          <CreedItem
            icon={ShieldCheck}
            label="Discipline"
            sublabel="Build character"
          />

          <CreedItem
            icon={Target}
            label="Focus"
            sublabel="Improve"
          />

          <CreedItem
            icon={MessageCircle}
            label="Community"
            sublabel="Grow together"
          />

          <CreedItem
            icon={Trophy}
            label="Excellence"
            sublabel="Achieve more"
          />

          <div className="apfa-creed-signature">
            APFA — More Than Football
            <span />
          </div>
        </section>
      </main>
    </div>
  );
}

function PrimaryCard({
  eyebrow,
  title,
  body,
  action,
  href,
  tag,
}: {
  eyebrow: string;
  title: string;
  body: string;
  action: string;
  href: string;
  tag?: string;
}) {
  return (
    <article className="apfa-compound-card">
      <div className="apfa-compound-card__well">
        <div className="relative z-10 flex h-full min-h-[276px] flex-col">
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--apfa-card-deep)] p-1">
                <OfficialLogo
                  className="h-full w-full"
                  alt=""
                />
              </span>

              <span className="apfa-compound-card__eyebrow">
                {eyebrow}
              </span>
            </span>

            {tag ? (
              <span className="rounded-full border border-[#6bc444]/40 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.14em] text-[#8ed087]">
                {tag}
              </span>
            ) : null}
          </div>

          <h2 className="apfa-compound-card__title">
            {title}
          </h2>

          <p className="apfa-compound-card__body line-clamp-4">
            {body}
          </p>

          <div className="mt-auto pt-6">
            <Link
              to={href}
              className="apfa-pill-button"
            >
              {action}
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function DashboardStatRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="apfa-stat-row">
      <span className="flex items-center gap-2">
        <Icon
          size={14}
          className="text-[#8ed087]"
          aria-hidden="true"
        />

        <span>{label}</span>
      </span>

      <strong>{value}</strong>
    </div>
  );
}

function QuickAction({
  icon: Icon,
  label,
  href,
}: {
  icon: LucideIcon;
  label: string;
  href: string;
}) {
  return (
    <Link
      to={href}
      className="apfa-quick-action"
    >
      <span className="flex items-center gap-3">
        <Icon
          size={15}
          className="text-[#6bc444]"
          aria-hidden="true"
        />

        <span>{label}</span>
      </span>

      <ChevronRight
        size={15}
        aria-hidden="true"
      />
    </Link>
  );
}

function CreedItem({
  icon: Icon,
  label,
  sublabel,
}: {
  icon: LucideIcon;
  label: string;
  sublabel: string;
}) {
  return (
    <div className="apfa-creed-item">
      <span className="apfa-creed-icon">
        <Icon
          size={14}
          aria-hidden="true"
        />
      </span>

      <span>
        <strong>{label}</strong>
        <small>{sublabel}</small>
      </span>
    </div>
  );
}