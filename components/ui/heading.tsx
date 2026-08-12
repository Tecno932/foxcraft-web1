import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib";

const headingVariants = cva(
  "font-bold tracking-tight",
  {
    variants: {
      size: {
        sm: "text-xl",
        md: "text-2xl",
        lg: "text-3xl",
        xl: "text-4xl",
        "2xl": "text-5xl lg:text-6xl",
      },
    },

    defaultVariants: {
      size: "lg",
    },
  }
);

interface Props
  extends VariantProps<typeof headingVariants> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export function Heading({
  as: Component = "h2",
  size,
  className,
  children,
}: Props) {
  return (
    <Component
      className={cn(
        headingVariants({
          size,
        }),
        className
      )}
    >
      {children}
    </Component>
  );
}