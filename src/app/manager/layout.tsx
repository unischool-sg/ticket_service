import { type JSX } from "react";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";

type LayoutProps = {
    children: JSX.Element;
}

export default async function ManagerLayout({ children }: LayoutProps) {
    const session = await authClient.getSession();

    if (!session.data) {
        redirect("/");
    }

    return <>{ children }</>;
}