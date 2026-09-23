
import {
  Activity,
  BookOpen,
  CalendarDays,
  ClipboardList,
  Contact,
  Download,
  GraduationCap,
  Home,
  Mail,
  Trophy,
  UserRound,
} from "lucide-react";

type DashboardSection =
  | "home"
  | "learning"
  | "courses"
  | "lessons"
  | "quizzes"
  | "progress"
  | "certificates"
  | "profile";

type DashboardSidebarProps = {
  activeSection: DashboardSection;
  onSectionChange: (section: DashboardSection) => void;
};

const NAV_ITEMS: Array<{
  label: string;
  section: DashboardSection;
  Icon: typeof Home;
}> = [
  { label: "Home", section: "home", Icon: Home },
  { label: "My Learning", section: "learning", Icon: BookOpen },
  { label: "Courses", section: "courses", Icon: GraduationCap },
  { label: "Lessons", section: "lessons", Icon: ClipboardList },
  { label: "Quizzes", section: "quizzes", Icon: ClipboardList },
  { label: "Progress", section: "progress", Icon: Activity },
  { label: "Certificates", section: "certificates", Icon: Trophy },
  { label: "Profile", section: "profile", Icon: UserRound },
];

export function DashboardSidebar({
  activeSection,
  onSectionChange,
}: DashboardSidebarProps) {
  return (
    <aside className="apfa-sidebar">
      <div className="apfa-sidebar__brand">
        <div className="apfa-sidebar__mark">APFA</div>

        <div>
          <p className="apfa-sidebar__name">Allen Premier</p>
          <p className="apfa-sidebar__tagline">Football Academy</p>
        </div>
      </div>

      <nav className="apfa-sidebar__nav" aria-label="Dashboard navigation">
        {NAV_ITEMS.map(({ label, section, Icon }) => {
          const active = activeSection === section;

          return (
            <button
              key={section}
              type="button"
              className={`apfa-sidebar__item ${active ? "is-active" : ""}`}
              onClick={() => onSectionChange(section)}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={18} strokeWidth={2} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="apfa-sidebar__external">
        <a href="/screening" className="apfa-sidebar__external-link">
          <Download size={17} />
          <span>Screening</span>
        </a>

        <a href="/events" className="apfa-sidebar__external-link">
          <CalendarDays size={17} />
          <span>Events</span>
        </a>

        <a href="/contact" className="apfa-sidebar__external-link">
          <Mail size={17} />
          <span>Contact</span>
        </a>
      </div>

      <div className="apfa-sidebar__bottom">
        <div className="apfa-sidebar__principle">
          <Contact size={18} />
          <div>
            <strong>More Than Football</strong>
            <span>A Better Future</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
