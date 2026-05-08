import type { ReactNode } from "react";

type CenterCardProps = {
  children: ReactNode;
};
export function CenterCard({ children }: CenterCardProps) {
  return (
    <main className="h-screen flex flex-col items-center justify-center bg-white">
      {children}
    </main>
  );
}
