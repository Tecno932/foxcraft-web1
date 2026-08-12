import { cn } from "@/lib";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function Container({
  children,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-7xl px-6 lg:px-8",
        className
      )}
    >
      {children}
    </div>
  );
}