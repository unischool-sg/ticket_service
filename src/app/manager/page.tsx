"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CenterCard } from "@/components/layout/Center";
import Button from "@/components/ui/button";
import Link from "next/link";

export default function Manager() {
  const router = useRouter();
  const handleTicketSubmit = async (e: FormData) => {
    const toaster = toast.loading("チケット情報を確認中...");
    try {
      const number = e.get("number") as string;
      console.log(number);
      if (!number) {
        toast.error("チケットIDを入力してください", { id: toaster });
        return;
      }

      const response = await fetch(`/api/tickets?number=${encodeURIComponent(number)}`);
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error, { id: toaster });
        return;
      }

      router.push("/manager/tickets/" + data.data.id);
      toast.success("チケットが見つかりました", { id: toaster });
    } catch (e) {
      console.error(e);
      toast.error("エラーが発生しました", {
        description: (e as Record<string, string>).message,
        id: toaster
      });
    }
  };

  return (
    <CenterCard>
      <h1 className="text-4xl">チケットマネージャー</h1>
      <form action={handleTicketSubmit} className="mt-5 space-y-4">
        <input type="number" name="number" className="border rounded p-5 w-full" placeholder="発見ナンバーを入力" />
        <Button className="w-full" type="submit">
          検索
        </Button>
      </form>

      <Link href="/manager/tickets" className="mt-5 hover:underline">
        チケット一覧へ
      </Link>
    </CenterCard>
  );
}
