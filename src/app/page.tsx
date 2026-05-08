import { CenterCard } from "@/components/layout/Center";
import Button from "@/components/ui/button";

export default function Home() {
  return (
    <CenterCard>
      <section className="space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-5xl font-bold">順番待ち管理システム</h1>
          <p className="text-gray-600 text-lg">シンプルで効率的なチケット管理</p>
        </div>

        <div className="space-y-3">
          <Button href={`/login`} className="w-full">
            管理パネル
          </Button>

          <Button href={`/monitor`} className="w-full">
            公衆モニター
          </Button>
        </div>
      </section>
    </CenterCard>
  );
}
