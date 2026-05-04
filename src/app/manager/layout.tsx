"use client";
import { type JSX, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Loading } from "@/components/layout/Loading";
import { toast } from "sonner";

type LayoutProps = {
    children: JSX.Element;
}

export default function ManagerLayout({ children }: LayoutProps) {
    const router = useRouter();
    const [isLoading, setLoading] = useState<boolean>(true);
    const [isLoggedIn, setLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        const loading = toast.loading("認証チェック中...");
        const checkLoggedIn = async () => {
            const session = await authClient.getSession();
            setLoading(false);
            if (session.data) {
                toast.success("認証に成功しました", { id: loading })
                setLoggedIn(true);
            } else {
                toast.success("ユーザー認証に失敗しました", { id: loading });
                router.push("/");
            }
        };

        checkLoggedIn();
    }, [router]);

    if (isLoading) return <Loading />
    if (!isLoading && isLoggedIn) return <>{ children }</>
}