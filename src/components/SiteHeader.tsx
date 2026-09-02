import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/apfa-logo.png.asset.json";
import { GrassBand } from "@/components/cathedral";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/programs", label: "Programs" },
  { to: "/training", label: "Training" },
  { to: "/coaches", label: "Coaches" },
  { to: "/education", label: "Education" },
  { to: "/screening", label: "Screening" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <header className="sticky top-0 z-40 bg-background">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <span className="neu-circle flex h-14 w-14 items-center justify-center p-1.5">
            <img src={logo.url} alt="Allen Premier Football Academy crest" className="h-full w-full object-contain" />
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="display block text-lg uppercase text-accent">Allen Premier</span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
              Football Academy
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-xs font-bold uppercase tracking-[0.14em] text-accent transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <Link to="/dashboard" className="btn-quiet text-xs">
                Dashboard
              </Link>
              <button type="button" onClick={signOut} className="btn-firm text-xs">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/auth" className="btn-quiet text-xs">
                Sign In
              </Link>
              <Link to="/join" className="btn-firm text-xs">
                Join Academy
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="neu-circle flex h-11 w-11 items-center justify-center text-accent lg:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open ? (
        <div className="cathedral-card mx-4 mb-3 grid gap-1 p-4 lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2 text-sm font-bold uppercase tracking-wide text-accent"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-3 flex flex-wrap gap-2">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)} className="btn-quiet text-xs">
                  Dashboard
                </Link>
                <button type="button" onClick={signOut} className="btn-firm text-xs">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/auth" onClick={() => setOpen(false)} className="btn-quiet text-xs">
                  Sign In
                </Link>
                <Link to="/join" onClick={() => setOpen(false)} className="btn-firm text-xs">
                  Join Academy
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}

      <GrassBand height={28} />
    </header>
  );
}
