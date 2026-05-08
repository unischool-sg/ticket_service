import { statusMap } from "@/constants/status";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TicketStatusChangeForm } from "@/components/forms/ticket";
import Link from "next/link";


type TicketDetailPageProps = {
  params: Promise<{ id: string }>;
};



function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "-";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return JSON.stringify(value, null, 2);
}

function getAnswerEntries(rawAnswer: unknown) {
  if (!isRecord(rawAnswer)) {
    return [] as Array<[string, string]>;
  }

  return Object.entries(rawAnswer).map(([key, value]) => [key, formatValue(value)] as [string, string]);
}

export default async function TicketDetailPage({ params }: TicketDetailPageProps) {
  const { id } = await params;

  const ticket = await prisma.ticket.findUnique({
    where: { id },
  });

  if (!ticket) {
    notFound();
  }

  const status = statusMap[ticket.status];
  const answerEntries = getAnswerEntries(ticket.rawAnswer);

  return (
    <main className="min-h-screen bg-white px-4 py-8 text-black sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <section className="rounded-lg border border-black bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <Link
                href="/manager/tickets"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-black"
              >
                ← 一覧へ戻る
              </Link>
              <div className="space-y-2">
                <p className="text-sm font-medium tracking-wide text-gray-600">Ticket Detail</p>
                <h1 className="text-3xl font-semibold tracking-tight">チケット #{ticket.num}</h1>
                <p className="max-w-2xl text-sm leading-6 text-gray-700 sm:text-base">
                  チケットの現在状態と登録内容を確認できます。現場で必要な情報を迷わず確認できるよう、表示を整理しています。
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${status.className}`}
              >
                {status.label}
              </span>
              <span className="inline-flex items-center rounded-full bg-black px-3 py-1 text-sm font-semibold text-white">
                #{ticket.num}
              </span>
            </div>
          </div>
        </section>

        <TicketStatusChangeForm ticketId={id} />

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-lg border border-black bg-white">
            <div className="border-b border-black px-6 py-5 sm:px-8">
              <h2 className="text-lg font-semibold text-black">回答内容</h2>
              <p className="mt-1 text-sm text-gray-600">フォームから登録された内容を確認できます。</p>
            </div>

            {answerEntries.length === 0 ? (
              <div className="px-6 py-12 sm:px-8">
                <p className="text-sm leading-6 text-gray-600">
                  このチケットには表示できる回答データがまだありません。
                </p>
              </div>
            ) : (
              <dl className="divide-y divide-black">
                {answerEntries.map(([key, value]) => (
                  <div key={key} className="grid gap-2 px-6 py-5 sm:px-8 md:grid-cols-[200px_1fr] md:gap-6">
                    <dt className="text-sm font-medium text-gray-600">{key}</dt>
                    <dd className="whitespace-pre-wrap break-words text-sm leading-6 text-black">{value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          <div className="space-y-6">
            <section className="rounded-lg border border-black bg-white">
              <div className="border-b border-black px-6 py-5">
                <h2 className="text-lg font-semibold text-black">基本情報</h2>
              </div>
              <dl className="grid gap-4 px-6 py-5 text-sm text-gray-700">
                <div className="space-y-1">
                  <dt className="text-gray-600">チケットID</dt>
                  <dd className="break-all font-medium text-black">{ticket.id}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-gray-600">作成日時</dt>
                  <dd className="font-medium text-black">{formatDate(ticket.createdAt)}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-gray-600">更新日時</dt>
                  <dd className="font-medium text-black">{formatDate(ticket.updatedAt)}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-gray-600">クローズ日時</dt>
                  <dd className="font-medium text-black">
                    {ticket.closedAt ? formatDate(ticket.closedAt) : "未完了"}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="rounded-lg border border-black bg-white p-6">
              <h2 className="text-lg font-semibold text-black">次の操作</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                一覧へ戻って別のチケットを確認するか、検索画面から番号指定で直接移動できます。
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <Link
                  href="/manager/tickets"
                  className="inline-flex items-center justify-center rounded border border-black bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-900"
                >
                  チケット一覧へ戻る
                </Link>
                <Link
                  href="/manager"
                  className="inline-flex items-center justify-center rounded border border-black bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-gray-100"
                >
                  番号で検索する
                </Link>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
