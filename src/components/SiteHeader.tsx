import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, ChevronRight } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/lib/api";

const OFFICIAL_LOGO =
  "/Allen-Premier-Football-Academy-Logo.png";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/programs", label: "Programs" },
  { to: "/training", label: "Training" },
  { to: "/coaches", label: "Coaches" },
  { to: "/education", label: "Education" },
  { to: "/screening", label: "Screening" },
  { to: "/contact", label: "Contact" },
];

const DONATION_ROUTE = "/donate";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  const { user, clearAuth } = useAuth();

  const navigate = useNavigate();

  async function signOut() {
    await logout();

    clearAuth();

    navigate("/auth", { replace: true });
  }

  return (
    <header className="sticky inset-x-0 top-0 z-[100] isolate w-full bg-background shadow-[0_8px_22px_rgba(0,20,0,0.28)]">
      {/* =====================================================
          DESKTOP HEADER
          TWO-LAYER COMMAND STRUCTURE

          LAYER 1 = OFFICIAL IDENTITY + PRIMARY NAVIGATION
          LAYER 2 = ACCOUNT / DONATION ACTIONS
      ===================================================== */}

      <div className="hidden w-full lg:block">
        <div className="mx-auto w-full max-w-[1600px] px-4 xl:px-6">
          {/* =================================================
              LAYER 1
          ================================================= */}

          <div className="grid min-h-[88px] grid-cols-[auto_minmax(0,1fr)] items-center gap-8 border-b border-border/70 py-3">
            {/* =================================================
                OFFICIAL APFA IDENTITY
            ================================================= */}

            <Link
              to="/"
              className="group flex shrink-0 items-center gap-3"
              aria-label="Allen Premier Football Academy Home"
            >
              <div className="neu-circle flex h-[68px] w-[68px] shrink-0 items-center justify-center p-2 transition-transform duration-200 group-hover:-translate-y-1">
                <img
                  src={OFFICIAL_LOGO}
                  alt="Allen Premier Football Academy official crest"
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="leading-tight">
                <span className="display block text-xl uppercase text-accent">
                  Allen Premier
                </span>

                <span className="block text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                  Football Academy
                </span>
              </div>
            </Link>

            {/* =================================================
                LAYER 1 PRIMARY NAVIGATION
            ================================================= */}

            <nav
              className="flex min-w-0 items-center justify-end gap-2"
              aria-label="Primary navigation"
            >
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    isActive
                      ? "group flex min-h-11 items-center justify-center whitespace-nowrap rounded-full border border-primary/60 bg-secondary px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.08em] text-primary shadow-[inset_4px_5px_11px_rgba(0,20,0,0.58),inset_-1px_-1px_3px_rgba(30,25,20,0.08)]"
                      : "group flex min-h-11 items-center justify-center whitespace-nowrap rounded-full border border-border bg-card px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.08em] text-accent shadow-[5px_6px_13px_rgba(0,20,0,0.58),0_2px_4px_rgba(0,68,0,0.38),inset_1px_1px_3px_rgba(0,0,0,0.10)] transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:text-primary hover:shadow-[7px_9px_18px_rgba(0,20,0,0.70),0_4px_7px_rgba(0,68,0,0.45),inset_1px_1px_3px_rgba(0,0,0,0.10)] active:translate-y-0 active:shadow-[inset_4px_5px_11px_rgba(0,20,0,0.60),inset_-1px_-1px_3px_rgba(30,25,20,0.08)]"
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* =================================================
              LAYER 2
              AUTHORITY / DONATION ACTIONS
          ================================================= */}

          <div className="flex min-h-[68px] items-center justify-end border-b border-border/70 py-3">
            <div className="flex items-center justify-end gap-3">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="flex min-h-11 min-w-[120px] items-center justify-center whitespace-nowrap rounded-full border border-border bg-card px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.1em] text-accent shadow-[6px_7px_15px_rgba(0,20,0,0.66),0_3px_5px_rgba(0,68,0,0.42),inset_1px_1px_3px_rgba(0,0,0,0.10)] transition-all duration-200 hover:-translate-y-1 hover:text-primary hover:shadow-[8px_10px_20px_rgba(0,20,0,0.76),0_4px_8px_rgba(0,68,0,0.50)] active:translate-y-0"
                  >
                    Dashboard
                  </Link>

                  <Link
                    to={DONATION_ROUTE}
                    className="flex min-h-11 min-w-[110px] items-center justify-center whitespace-nowrap rounded-full border border-[#c26c34]/70 bg-[#c26c34] px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.1em] text-[#fff8ed] shadow-[7px_8px_18px_rgba(0,20,0,0.68),0_4px_8px_rgba(194,108,52,0.35),inset_1px_1px_3px_rgba(0,0,0,0.12)] transition-all duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[10px_12px_24px_rgba(0,20,0,0.78),0_5px_10px_rgba(194,108,52,0.45)] active:translate-y-0 active:scale-100"
                  >
                    Donate
                  </Link>

                  <button
                    type="button"
                    onClick={signOut}
                    className="flex min-h-11 min-w-[120px] items-center justify-center whitespace-nowrap rounded-full border border-primary/60 bg-primary px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.1em] text-primary-foreground shadow-[7px_8px_18px_rgba(0,20,0,0.76),0_4px_8px_rgba(0,68,0,0.50),inset_1px_1px_3px_rgba(0,0,0,0.12)] transition-all duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[10px_12px_24px_rgba(0,20,0,0.85),0_5px_10px_rgba(0,68,0,0.60)] active:translate-y-0 active:scale-100 active:shadow-[inset_5px_6px_13px_rgba(0,20,0,0.68)]"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="flex min-h-11 min-w-[110px] items-center justify-center whitespace-nowrap rounded-full border border-border bg-card px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.1em] text-accent shadow-[6px_7px_15px_rgba(0,20,0,0.66),0_3px_5px_rgba(0,68,0,0.42),inset_1px_1px_3px_rgba(0,0,0,0.10)] transition-all duration-200 hover:-translate-y-1 hover:text-primary hover:shadow-[8px_10px_20px_rgba(0,20,0,0.76),0_4px_8px_rgba(0,68,0,0.50)] active:translate-y-0"
                  >
                    Sign In
                  </Link>

                  <Link
                    to={DONATION_ROUTE}
                    className="flex min-h-11 min-w-[110px] items-center justify-center whitespace-nowrap rounded-full border border-[#c26c34]/70 bg-[#c26c34] px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.1em] text-[#fff8ed] shadow-[7px_8px_18px_rgba(0,20,0,0.68),0_4px_8px_rgba(194,108,52,0.35),inset_1px_1px_3px_rgba(0,0,0,0.12)] transition-all duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[10px_12px_24px_rgba(0,20,0,0.78),0_5px_10px_rgba(194,108,52,0.45)] active:translate-y-0 active:scale-100"
                  >
                    Donate
                  </Link>

                  <Link
                    to="/join"
                    className="flex min-h-11 min-w-[110px] items-center justify-center whitespace-nowrap rounded-full border border-primary/60 bg-primary px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.1em] text-primary-foreground shadow-[7px_8px_18px_rgba(0,20,0,0.76),0_4px_8px_rgba(0,68,0,0.50),inset_1px_1px_3px_rgba(0,0,0,0.12)] transition-all duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[10px_12px_24px_rgba(0,20,0,0.85),0_5px_10px_rgba(0,68,0,0.60)] active:translate-y-0 active:scale-100"
                  >
                    Join
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          MOBILE / TABLET HEADER
      ===================================================== */}

      <div className="flex w-full items-center justify-between gap-3 px-4 py-3 lg:hidden">
        <Link
          to="/"
          className="group flex min-w-0 items-center gap-3"
          aria-label="Allen Premier Football Academy Home"
        >
          <div className="neu-circle flex h-14 w-14 shrink-0 items-center justify-center p-1.5 transition-transform duration-200 group-hover:-translate-y-0.5">
            <img
              src={OFFICIAL_LOGO}
              alt="Allen Premier Football Academy official crest"
              className="h-full w-full object-contain"
            />
          </div>

          <div className="min-w-0 leading-tight">
            <span className="display block truncate text-base uppercase text-accent">
              Allen Premier
            </span>

            <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Football Academy
            </span>
          </div>
        </Link>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-card text-primary shadow-[6px_7px_15px_rgba(0,20,0,0.70),0_3px_6px_rgba(0,68,0,0.42),inset_1px_1px_3px_rgba(0,0,0,0.10)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[8px_10px_20px_rgba(0,20,0,0.80),0_4px_8px_rgba(0,68,0,0.50)] active:translate-y-0 active:shadow-[inset_4px_5px_11px_rgba(0,20,0,0.62)]"
        >
          {open ? (
            <X
              size={23}
              strokeWidth={2.5}
              aria-hidden="true"
            />
          ) : (
            <Menu
              size={23}
              strokeWidth={2.5}
              aria-hidden="true"
            />
          )}
        </button>
      </div>

      {/* =====================================================
          MOBILE / TABLET NAVIGATION
      ===================================================== */}

      {open ? (
        <div className="border-t border-border bg-background px-4 pb-5 pt-4 lg:hidden">
          <div className="cathedral-card w-full p-3">
            <nav
              className="grid w-full gap-2.5"
              aria-label="Mobile navigation"
            >
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    isActive
                      ? "group flex min-h-12 w-full items-center justify-between rounded-full border border-primary/60 bg-secondary px-5 py-3 text-sm font-bold uppercase tracking-[0.08em] text-primary shadow-[inset_4px_5px_11px_rgba(0,20,0,0.58)]"
                      : "group flex min-h-12 w-full items-center justify-between rounded-full border border-border bg-card px-5 py-3 text-sm font-bold uppercase tracking-[0.08em] text-accent shadow-[5px_6px_13px_rgba(0,20,0,0.58),0_2px_4px_rgba(0,68,0,0.38)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary hover:shadow-[7px_9px_18px_rgba(0,20,0,0.70),0_4px_7px_rgba(0,68,0,0.45)]"
                  }
                >
                  <span>{item.label}</span>

                  <ChevronRight
                    size={18}
                    className="text-primary transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </NavLink>
              ))}
            </nav>

            <div className="mt-5 border-t border-border pt-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setOpen(false)}
                      className="flex min-h-12 w-full items-center justify-center rounded-full border border-border bg-card px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-accent shadow-[6px_7px_15px_rgba(0,20,0,0.68),0_3px_5px_rgba(0,68,0,0.42)]"
                    >
                      Dashboard
                    </Link>

                    <Link
                      to={DONATION_ROUTE}
                      onClick={() => setOpen(false)}
                      className="flex min-h-12 w-full items-center justify-center rounded-full border border-[#c26c34]/70 bg-[#c26c34] px-5 py-3 text-xs font-black uppercase tracking-[0.1em] text-[#fff8ed] shadow-[7px_8px_18px_rgba(0,20,0,0.70),0_4px_8px_rgba(194,108,52,0.35)] transition-all duration-200 hover:-translate-y-0.5"
                    >
                      Donate
                    </Link>

                    <button
                      type="button"
                      onClick={signOut}
                      className="flex min-h-12 w-full items-center justify-center rounded-full border border-primary/60 bg-primary px-5 py-3 text-xs font-black uppercase tracking-[0.1em] text-primary-foreground shadow-[7px_8px_18px_rgba(0,20,0,0.78),0_4px_8px_rgba(0,68,0,0.54)]"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/auth"
                      onClick={() => setOpen(false)}
                      className="flex min-h-12 w-full items-center justify-center rounded-full border border-border bg-card px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-accent shadow-[6px_7px_15px_rgba(0,20,0,0.68),0_3px_5px_rgba(0,68,0,0.42)]"
                    >
                      Sign In
                    </Link>

                    <Link
                      to={DONATION_ROUTE}
                      onClick={() => setOpen(false)}
                      className="flex min-h-12 w-full items-center justify-center rounded-full border border-[#c26c34]/70 bg-[#c26c34] px-5 py-3 text-xs font-black uppercase tracking-[0.1em] text-[#fff8ed] shadow-[7px_8px_18px_rgba(0,20,0,0.70),0_4px_8px_rgba(194,108,52,0.35)] transition-all duration-200 hover:-translate-y-0.5"
                    >
                      Donate
                    </Link>

                    <Link
                      to="/join"
                      onClick={() => setOpen(false)}
                      className="flex min-h-12 w-full items-center justify-center rounded-full border border-primary/60 bg-primary px-5 py-3 text-xs font-black uppercase tracking-[0.1em] text-primary-foreground shadow-[7px_8px_18px_rgba(0,20,0,0.78),0_4px_8px_rgba(0,68,0,0.54)]"
                    >
                      Join
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}