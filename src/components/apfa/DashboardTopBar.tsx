import { Bell, UserRound } from "lucide-react";
import { FootballMark } from "@/components/cathedral";

type DashboardTopBarProps = {
  fullName: string | null;
  avatarUrl: string | null;
  level?: string;
  onProfileClick?: () => void;
};

export function DashboardTopBar({
  fullName,
  avatarUrl,
  level = "APFA Member",
  onProfileClick,
}: DashboardTopBarProps) {
  const displayName = fullName?.trim() || "APFA Member";

  return (
    <header className="apfa-topbar">
      <div className="apfa-topbar__brand">
        <FootballMark className="apfa-topbar__mark" />

        <div>
          <p className="apfa-topbar__name">APFA</p>
          <p className="apfa-topbar__sub">Member Area</p>
        </div>
      </div>

      <div className="apfa-topbar__right">
        <button
          type="button"
          className="apfa-topbar__notification"
          aria-label="Notifications"
        >
          <Bell size={18} />
        </button>

        <div className="apfa-topbar__welcome">
          <span>Welcome back</span>
          <strong>{displayName}</strong>
        </div>

        <button
          type="button"
          className="apfa-topbar__avatar"
          aria-label="Open profile"
          onClick={onProfileClick}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="" />
          ) : (
            <UserRound size={20} aria-hidden="true" />
          )}
        </button>

        <div className="apfa-topbar__identity">
          <strong>{displayName}</strong>
          <span>{level}</span>
        </div>
      </div>
    </header>
  );
}