import { statusMap } from "@/constants/status";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
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
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <Link
                href="/manager/tickets"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-700"
              >
                ← 一覧へ戻る
              </Link>
              <div className="space-y-2">
                <p className="text-sm font-medium tracking-wide text-slate-500">Ticket Detail</p>
                <h1 className="text-3xl font-semibold tracking-tight">チケット #{ticket.num}</h1>
                <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
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
              <span className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-sm font-semibold text-white">
                #{ticket.num}
              </span>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-5 sm:px-8">
              <h2 className="text-lg font-semibold text-slate-900">回答内容</h2>
              <p className="mt-1 text-sm text-slate-500">フォームから登録された内容を確認できます。</p>
            </div>

            {answerEntries.length === 0 ? (
              <div className="px-6 py-12 sm:px-8">
                <p className="text-sm leading-6 text-slate-500">
                  このチケットには表示できる回答データがまだありません。
                </p>
              </div>
            ) : (
              <dl className="divide-y divide-slate-200">
                {answerEntries.map(([key, value]) => (
                  <div key={key} className="grid gap-2 px-6 py-5 sm:px-8 md:grid-cols-[200px_1fr] md:gap-6">
                    <dt className="text-sm font-medium text-slate-500">{key}</dt>
                    <dd className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-900">{value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-6 py-5">
                <h2 className="text-lg font-semibold text-slate-900">基本情報</h2>
              </div>
              <dl className="grid gap-4 px-6 py-5 text-sm text-slate-600">
                <div className="space-y-1">
                  <dt className="text-slate-400">チケットID</dt>
                  <dd className="break-all font-medium text-slate-800">{ticket.id}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-slate-400">作成日時</dt>
                  <dd className="font-medium text-slate-800">{formatDate(ticket.createdAt)}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-slate-400">更新日時</dt>
                  <dd className="font-medium text-slate-800">{formatDate(ticket.updatedAt)}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-slate-400">クローズ日時</dt>
                  <dd className="font-medium text-slate-800">
                    {ticket.closedAt ? formatDate(ticket.closedAt) : "未完了"}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">次の操作</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                一覧へ戻って別のチケットを確認するか、検索画面から番号指定で直接移動できます。
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <Link
                  href="/manager/tickets"
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  チケット一覧へ戻る
                </Link>
                <Link
                  href="/manager"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
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
