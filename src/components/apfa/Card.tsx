import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "raised" | "sunken";
};

export const ApfaCard = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "apfa-card",
        variant === "raised" && "apfa-card--raised",
        variant === "sunken" && "apfa-card--sunken",
        className,
      )}
      {...props}
    />
  ),
);

ApfaCard.displayName = "ApfaCard";
