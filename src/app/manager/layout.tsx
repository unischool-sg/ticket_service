import { type JSX } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

type LayoutProps = {
    children: JSX.Element;
}

export default async function ManagerLayout({ children }: LayoutProps) {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session.data) {
        redirect("/");
    }

    return <>{ children }</>;
}