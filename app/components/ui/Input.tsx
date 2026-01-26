import { InputHTMLAttributes, forwardRef, CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { Theme } from "@/lib/themes";
import { motion, HTMLMotionProps } from "framer-motion";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  theme?: Theme;
}

type CombinedInputProps = InputProps & HTMLMotionProps<"input">;

const Input = forwardRef<HTMLInputElement, CombinedInputProps>(
  ({ className, type, theme, style, ...props }, ref) => {
    const dynamicStyles: CSSProperties = {
      ...style,
    };

    const focusColor = theme ? theme.primary : "#c084fc";

    return (
      <motion.input
        type={type}
        style={dynamicStyles}
        className={cn(
          "flex h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-sm text-white shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        whileFocus={{
          scale: 1.02,
          borderColor: focusColor,
          boxShadow: `0 0 15px ${theme ? theme.glow : "rgba(192, 132, 252, 0.4)"}`,
        }}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
