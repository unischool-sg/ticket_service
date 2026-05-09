import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageShellProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  centered?: boolean;
};

export function PageShell({
  children,
  className,
  contentClassName,
  centered = false,
}: PageShellProps) {
  return (
    <main
      className={cn(
        "min-h-screen bg-white px-4 py-8 text-black sm:px-6 lg:px-8",
        centered && "flex items-center justify-center",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto w-full",
          centered ? "max-w-md" : "max-w-7xl",
          contentClassName,
        )}
      >
        {children}
      </div>
    </main>
  );
}
