import { Link } from "react-router-dom";
import {
  Instagram,
  Music2,
  Ghost,
  Twitter,
  Youtube,
} from "lucide-react";

const OFFICIAL_LOGO =
  "/Allen-Premier-Football-Academy-Logo.png";

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://instagram.com/allenpremierapfa2025",
    Icon: Instagram,
  },
  {
    label: "TikTok",
    href: "https://tiktok.com/@allenpremierapfa2025",
    Icon: Music2,
  },
  {
    label: "Snapchat",
    href: "https://snapchat.com/add/apfacademy2025",
    Icon: Ghost,
  },
  {
    label: "X",
    href: "https://x.com/allenpremier201",
    Icon: Twitter,
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@AllenPremierFootballAcademy",
    Icon: Youtube,
  },
];

export function SiteFooter() {
  return (
    <footer className="apfa-floating-slab mt-16 px-6 py-10">
      <div className="mx-auto grid w-full max-w-6xl gap-10 md:grid-cols-2">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-4"
            aria-label="Allen Premier Football Academy home"
          >
            <img
              src={OFFICIAL_LOGO}
              alt="Allen Premier Football Academy"
              className="h-14 w-14 rounded-full object-contain"
            />

            <span className="display text-xl uppercase tracking-wide text-primary">
              Allen Premier Football Academy
            </span>
          </Link>

          <p className="mt-5 max-w-md text-sm text-[var(--apfa-text-on-card)]/75">
            Catch Them Young. Build Them Strong.
          </p>

          <p className="mt-2 max-w-md text-sm text-[var(--apfa-text-on-card)]/75">
            Youth football, character development and completely free
            structured education for the community.
          </p>

          <div
            className="mt-6 flex flex-wrap gap-3"
            aria-label="Official social media"
          >
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Allen Premier Football Academy on ${label}`}
                title={label}
                className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] bg-[var(--apfa-card-deep)] text-[#f8f1e4] shadow-[0_8px_16px_rgba(0,0,0,0.22)] transition-transform hover:-translate-y-0.5 hover:text-primary"
              >
                <Icon
                  className="h-5 w-5"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
            Contact
          </p>

          <p className="mt-4 text-sm text-[#f8f1e4]">
            Allen Premier Football Academy
          </p>

          <p className="mt-2 text-sm text-[#f8f1e4]/75">
            Benin City, Edo State, Nigeria
          </p>

          <p className="mt-2 text-sm text-[#f8f1e4]/75">
            Community youth football and education.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-10 flex w-full max-w-6xl flex-col items-center justify-center gap-3 border-t border-[#f8f1e4]/10 pt-5 text-center">
        <img
          src={OFFICIAL_LOGO}
          alt=""
          aria-hidden="true"
          className="h-9 w-9 rounded-full object-contain opacity-90"
        />

        <p className="text-xs text-[#f8f1e4]/60">
          © {new Date().getFullYear()} Allen Premier Football Academy.
          All rights reserved.
        </p>
      </div>
    </footer>
  );
}