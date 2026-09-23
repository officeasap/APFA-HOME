import {
  forwardRef,
  type InputHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

export const ApfaInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn("apfa-input", className)}
    {...props}
  />
));

ApfaInput.displayName = "ApfaInput";
