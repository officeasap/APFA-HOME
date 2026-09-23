import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ApfaIconTile({
  children,
  variant = "default",
  className,
}: {
  children: ReactNode;
  variant?: "default" | "on-card" | "donate";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "apfa-icon-tile",
        variant === "on-card" && "apfa-icon-tile--on-card",
        variant === "donate" && "apfa-icon-tile--donate",
        className,
      )}
    >
      {children}
    </span>
  );
}
