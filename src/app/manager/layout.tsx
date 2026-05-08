import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { auth } from "@/lib/auth";

type LayoutProps = {
  children: ReactNode;
};

export default async function ManagerLayout({ children }: LayoutProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  console.log(session);

  if (!session) {
    return redirect("/");
  }

  return <>{children}</>;
}
