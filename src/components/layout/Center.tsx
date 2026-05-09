import type { ReactNode } from "react";
import { PageShell } from "./PageShell";

type CenterCardProps = {
  children: ReactNode;
};

export function CenterCard({ children }: CenterCardProps) {
  return (
    <PageShell
      centered
      contentClassName="flex flex-col items-center justify-center"
    >
      {children}
    </PageShell>
  );
}
