import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionCardProps = {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
};

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
}: SectionCardProps) {
  const hasHeader = title || description || action;

  return (
    <section
      className={cn(
        "overflow-hidden rounded-lg border border-black bg-white",
        className,
      )}
    >
      {hasHeader ? (
        <div className="flex flex-col gap-3 border-b border-black px-6 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-8">
          <div className="space-y-1">
            {title ? (
              <h2 className="text-lg font-semibold text-black">{title}</h2>
            ) : null}
            {description ? (
              <p className="text-sm text-gray-600">{description}</p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}
      <div className={cn("min-h-0", bodyClassName)}>{children}</div>
    </section>
  );
}
