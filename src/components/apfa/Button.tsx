import {
  forwardRef,
  type ButtonHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "donate" | "ghost" | "light";

export const ApfaButton = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
  }
>(({ className, variant = "default", ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "apfa-btn",
      variant === "donate" && "apfa-btn--donate",
      variant === "ghost" && "apfa-btn--ghost",
      variant === "light" && "apfa-btn--light",
      className,
    )}
    {...props}
  />
));

ApfaButton.displayName = "ApfaButton";
