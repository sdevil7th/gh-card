import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Theme } from "@/lib/themes";
import { motion, HTMLMotionProps } from "framer-motion";
import Magnetic from "../effects/Magnetic";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  theme?: Theme;
}

// Combine Motion props with Button props
type CombinedButtonProps = ButtonProps & HTMLMotionProps<"button">;

const Button = forwardRef<HTMLButtonElement, CombinedButtonProps>(
  ({ className, variant = "primary", size = "md", theme, ...props }, ref) => {
    // Dynamic styles based on theme
    const dynamicStyles: React.CSSProperties = {};
    if (theme) {
      if (variant === "primary") {
        dynamicStyles.backgroundColor = theme.primary;
        dynamicStyles.boxShadow = `0 0 20px ${theme.glow}`;
        dynamicStyles.color = "white";
      } else if (variant === "secondary") {
        dynamicStyles.backgroundColor = theme.accent;
        dynamicStyles.boxShadow = `0 0 15px ${theme.glow.replace("0.3", "0.15")}`;
        dynamicStyles.color = "white";
        // If electric yellow, we might want black text.
        if (theme.id === "electric-yellow") {
          dynamicStyles.color = "black";
        }
      } else if (variant === "outline") {
        dynamicStyles.borderColor = theme.primary;
        dynamicStyles.color = theme.primary;
      }
    }

    const variants = {
      primary: theme
        ? "hover:brightness-110" // Use brightness for dynamic colors
        : "bg-indigo-500 text-white hover:bg-indigo-600 shadow-[0_0_20px_rgba(99,102,241,0.5)]",
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

    const buttonContent = (
      <motion.button
        ref={ref}
        style={dynamicStyles}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          variants[variant],
          sizes[size],
          className,
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        {...props}
      />
    );

    return (
      <Magnetic strength={0.4} radius={200}>
        {buttonContent}
      </Magnetic>
    );
  },
);
Button.displayName = "Button";

export { Button };
