import * as React from "react";
import { cn } from "@/lib";

type InputProps =
  React.InputHTMLAttributes<HTMLInputElement>;

export function Input({
  className,
  ...props
}: InputProps) {
  return (
    <input
      className={cn(
        `
        h-11
        w-full
        rounded-xl
        border
        border-border
        bg-surface
        px-4
        text-sm
        outline-none
        transition-all

        placeholder:text-muted

        focus:border-primary
        focus:ring-2
        focus:ring-primary/20
        `,
        className
      )}
      {...props}
    />
  );
}