
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
    color: "#E4405F",
  },
  {
    label: "TikTok",
    href: "https://tiktok.com/@allenpremierapfa2025",
    Icon: Music2,
    color: "#25F4EE",
  },
  {
    label: "Snapchat",
    href: "https://snapchat.com/add/apfacademy2025",
    Icon: Ghost,
    color: "#FFFC00",
  },
  {
    label: "X",
    href: "https://x.com/allenpremier201",
    Icon: Twitter,
    color: "#FFFFFF",
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@AllenPremierFootballAcademy",
    Icon: Youtube,
    color: "#FF0000",
  },
];

const DONATION_ROUTE = "/donate";

export function SiteFooter() {
  return (
    <footer className="apfa-floating-slab mt-16 px-6 py-10">
      <div className="mx-auto grid w-full max-w-6xl gap-10 md:grid-cols-3">
        {/* =====================================================
            SECTION 1 — APFA IDENTITY
        ===================================================== */}

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
            {SOCIALS.map(({ label, href, Icon, color }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Allen Premier Football Academy on ${label}`}
                title={label}
                className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] bg-[var(--apfa-card-deep)] shadow-[0_8px_16px_rgba(0,0,0,0.22)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                <Icon
                  className="h-5 w-5"
                  strokeWidth={2}
                  aria-hidden="true"
                  style={{ color }}
                />
              </a>
            ))}
          </div>
        </div>

        {/* =====================================================
            SECTION 2 — CONTACT
        ===================================================== */}

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

        {/* =====================================================
            SECTION 3 — SUPPORT APFA
        ===================================================== */}

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
            Support APFA
          </p>

          <p className="mt-4 max-w-sm text-sm leading-6 text-[#f8f1e4]/75">
            Help us continue providing completely free football development,
            character development and structured education for the community.
          </p>

          <Link
            to={DONATION_ROUTE}
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full border border-[#c26c34]/70 bg-[#c26c34] px-7 py-3 text-xs font-black uppercase tracking-[0.12em] text-[#fff8ed] shadow-[7px_8px_18px_rgba(0,20,0,0.68),0_4px_8px_rgba(194,108,52,0.35),inset_1px_1px_3px_rgba(0,0,0,0.12)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[10px_12px_24px_rgba(0,20,0,0.78),0_5px_10px_rgba(194,108,52,0.45)] active:translate-y-0"
          >
            Donate to APFA
          </Link>
        </div>
      </div>

      {/* =======================================================
          COPYRIGHT
      ======================================================= */}

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
