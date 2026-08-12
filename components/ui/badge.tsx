import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib";

const badgeVariants = cva(
  `
  inline-flex
  items-center
  rounded-full
  px-3
  py-1
  text-xs
  font-medium
  `,
  {
    variants: {
      variant: {
        primary: `
          bg-primary/15
          text-primary
        `,

        secondary: `
          bg-secondary/15
          text-secondary
        `,

        surface: `
          bg-surface-secondary
          text-muted
        `,

        success: `
          bg-success/15
          text-success
        `,
      },
    },

    defaultVariants: {
      variant: "surface",
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({
  className,
  variant,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        badgeVariants({
          variant,
        }),
        className
      )}
      {...props}
    />
  );
}