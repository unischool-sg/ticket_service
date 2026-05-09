"use client";
import { toast } from "sonner";
import { CenterCard } from "@/components/layout/Center";
import Button from "@/components/ui/button";
import GoogleFillIcon from "@/components/ui/icons/Google";
import { authClient } from "@/lib/auth-client";

export default function LoginClient() {
  return (
    <CenterCard>
      <section className="space-y-8 w-full max-w-md text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">ログイン</h1>
          <p className="text-gray-600">管理パネルにアクセス</p>
        </div>

        <Button
          onClick={async () => {
            try {
              await authClient.signIn.social({
                provider: "google",
                callbackURL: "/manager",
              });
            } catch (error) {
              console.error("Googleログインの開始に失敗しました", error);
              toast.error("Googleログインに失敗しました");
            }
          }}
          className="w-full gap-2"
        >
          <GoogleFillIcon size={20} />
          <span>Googleでログイン</span>
        </Button>
      </section>
    </CenterCard>
  );
}
