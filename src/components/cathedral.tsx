import { Link } from "react-router-dom";
import type { ReactNode } from "react";

export function CathedralCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`apfa-card cathedral-card p-6 ${className}`}>
      {children}
    </div>
  );
}

export function SectionHeading({
  kicker,
  title,
}: {
  kicker?: string;
  title: string;
}) {
  return (
    <div className="mb-10 text-center">
      {kicker ? (
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-primary">
          {kicker}
        </p>
      ) : null}

      <h2 className="engraved-title text-3xl uppercase sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}

export function FirmLink({
  to,
  children,
  className = "",
}: {
  to: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      to={to}
      className={`btn-firm apfa-btn text-sm ${className}`}
    >
      {children}
    </Link>
  );
}

export function PageShell({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-14">
      <h1 className="engraved-title text-4xl uppercase sm:text-5xl">
        {title}
      </h1>

      {intro ? (
        <p className="mt-3 max-w-2xl text-muted-foreground">
          {intro}
        </p>
      ) : null}

      <div className="mt-10">
        {children}
      </div>
    </main>
  );
}

export function FootballMark({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      aria-hidden
    >
      <circle
        cx="24"
        cy="24"
        r="22"
        fill="var(--apfa-card-deep)"
        stroke="var(--apfa-primary)"
        strokeWidth="2"
      />

      <path
        d="M24 12l7 5-2.7 8.2h-8.6L17 17z"
        fill="var(--apfa-primary)"
      />

      <path
        d="M24 42a18 18 0 0 1-9-2.4l4-6.3h10l4 6.3A18 18 0 0 1 24 42z"
        fill="var(--apfa-primary)"
      />

      <path
        d="M6.5 20l6.6 4.2-1.3 8.3-4.9.7A18 18 0 0 1 6.5 20z"
        fill="var(--apfa-primary)"
      />

      <path
        d="M41.5 20a18 18 0 0 1-.4 13.2l-4.9-.7-1.3-8.3z"
        fill="var(--apfa-primary)"
      />
    </svg>
  );
}
