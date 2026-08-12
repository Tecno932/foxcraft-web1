import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib";
import { Slot } from "@radix-ui/react-slot";

const buttonVariants = cva(
  `
  inline-flex
  items-center
  justify-center
  gap-2
  rounded-xl
  font-medium
  transition-all
  duration-200
  whitespace-nowrap
  outline-none
  disabled:pointer-events-none
  disabled:opacity-50
  focus-visible:ring-2
  focus-visible:ring-primary
  active:scale-[0.98]
  `,
  {
    variants: {
      variant: {
        primary: `
          bg-primary
          text-white
          hover:bg-primary-hover
        `,

        secondary: `
          bg-surface
          border
          border-border
          hover:border-border-hover
          hover:bg-surface-secondary
        `,

        ghost: `
          hover:bg-surface-secondary
        `,

        outline: `
          border
          border-primary
          text-primary
          hover:bg-primary/10
        `,

        danger: `
          bg-danger
          text-white
          hover:brightness-110
        `,
      },

      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-5",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg",
        icon: "h-11 w-11",
      },
    },

    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps & {
  asChild?: boolean;
}) {
  const Component = asChild ? Slot : "button";

  return (
    <Component
      className={cn(
        buttonVariants({
          variant,
          size,
        }),
        className
      )}
      {...props}
    />
  );
}