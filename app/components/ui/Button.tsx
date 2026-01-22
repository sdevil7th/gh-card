import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary:
        "bg-indigo-500 text-white hover:bg-indigo-600 shadow-[0_0_20px_rgba(99,102,241,0.5)]",
      secondary:
        "bg-purple-500 text-white hover:bg-purple-600 shadow-[0_0_20px_rgba(168,85,247,0.5)]",
      outline:
        "border border-white/20 bg-transparent hover:bg-white/10 text-white",
      ghost: "hover:bg-white/10 text-white",
    };

    const sizes = {
      sm: "h-9 px-4 text-sm",
      md: "h-12 px-6 text-base",
      lg: "h-14 px-8 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
