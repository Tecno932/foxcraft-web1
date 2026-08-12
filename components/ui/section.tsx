import { cn } from "@/lib/utils";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
};

export function Section({
  children,
  className,
  as: Component = "section",
}: Readonly<SectionProps>) {
  return (
    <Component
      className={cn(
        "relative w-full py-16 md:py-20 lg:py-24",
        className
      )}
    >
      {children}
    </Component>
  );
}