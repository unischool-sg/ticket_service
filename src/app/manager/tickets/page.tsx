import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { TicketStatus } from "@/generated/prisma/enums";
import { statusMap } from "@/constants/status";

type TicketsProps = {
  searchParams: Promise<{ page?: string }>;
};

const TICKET_COUNT = 10;

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function buildPageHref(page: number) {
  return page === 0 ? "/manager/tickets" : `/manager/tickets?page=${page}`;
}

export default async function Tickets({ searchParams }: TicketsProps) {
  const { page } = await searchParams;
  const requestedPage = Number.parseInt(page ?? "0", 10);
  const normalizedPage = Number.isNaN(requestedPage) || requestedPage < 0 ? 0 : requestedPage;

  const totalCount = await prisma.ticket.count();
  const totalPages = totalCount === 0 ? 0 : Math.ceil(totalCount / TICKET_COUNT);
  const currentPage = totalPages === 0 ? 0 : Math.min(normalizedPage, totalPages - 1);

  const tickets = await prisma.ticket.findMany({
    take: TICKET_COUNT,
    skip: currentPage * TICKET_COUNT,
    orderBy: {
      createdAt: "desc",
    },
  });

  const showingFrom = totalCount === 0 ? 0 : currentPage * TICKET_COUNT + 1;
  const showingTo = Math.min((currentPage + 1) * TICKET_COUNT, totalCount);
  const hasPreviousPage = currentPage > 0;
  const hasNextPage = currentPage + 1 < totalPages;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium tracking-wide text-slate-500">Manager Console</p>
              <div className="space-y-1.5">
                <h1 className="text-3xl font-semibold tracking-tight">チケット一覧</h1>
                <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  受付されたチケットを新しい順に確認できます。状態と更新日時が一目で分かるため、次に対応すべきチケットを素早く判断できます。
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:items-end">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <span className="block text-xs uppercase tracking-[0.18em] text-slate-400">
                  Total Tickets
                </span>
                <span className="mt-1 block text-2xl font-semibold text-slate-900">{totalCount}</span>
              </div>
              <Link
                href="/manager"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
              >
                チケット番号で検索
              </Link>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">一覧表示</h2>
              <p className="text-sm text-slate-500">
                {totalCount === 0
                  ? "現在表示できるチケットはありません。"
                  : `${showingFrom}〜${showingTo}件目を表示しています`}
              </p>
            </div>
            {totalCount > 0 ? (
              <p className="text-sm text-slate-500">
                {currentPage + 1} / {totalPages} ページ
              </p>
            ) : null}
          </div>

          {tickets.length === 0 ? (
            <div className="px-6 py-16 text-center sm:px-8">
              <div className="mx-auto max-w-md space-y-3">
                <h3 className="text-xl font-semibold text-slate-900">チケットがまだありません</h3>
                <p className="text-sm leading-6 text-slate-500 sm:text-base">
                  チケットが作成されるとここに一覧表示されます。特定の番号を確認したい場合は、検索画面から直接照会してください。
                </p>
                <div className="pt-2">
                  <Link
                    href="/manager"
                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                  >
                    検索画面へ戻る
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {tickets.map((ticket) => {
                const status = statusMap[ticket.status as TicketStatus];

                return (
                  <Link
                    key={ticket.id}
                    href={`/manager/tickets/${ticket.id}`}
                    className="group block px-6 py-5 transition hover:bg-slate-50 focus:bg-slate-50 focus:outline-none sm:px-8"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="inline-flex min-w-20 items-center justify-center rounded-full bg-slate-900 px-3 py-1 text-sm font-semibold text-white">
                            #{ticket.num}
                          </span>
                          <span
                            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${status.className}`}
                          >
                            {status.label}
                          </span>
                        </div>

                        <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2 sm:gap-x-8">
                          <p>
                            <span className="mr-2 text-slate-400">作成日時</span>
                            <span className="font-medium text-slate-700">{formatDate(ticket.createdAt)}</span>
                          </p>
                          <p>
                            <span className="mr-2 text-slate-400">更新日時</span>
                            <span className="font-medium text-slate-700">{formatDate(ticket.updatedAt)}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 md:min-w-36 md:justify-end">
                        <span className="text-sm text-slate-500 transition group-hover:text-slate-700">
                          詳細を見る
                        </span>
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition group-hover:border-slate-300 group-hover:text-slate-700">
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {totalCount > 0 ? (
            <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <p className="text-sm text-slate-500">
                1ページあたり {TICKET_COUNT} 件まで表示しています。
              </p>
              <div className="flex items-center gap-3">
                {hasPreviousPage ? (
                  <Link
                    href={buildPageHref(currentPage - 1)}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
                  >
                    前のページ
                  </Link>
                ) : (
                  <span className="inline-flex cursor-not-allowed items-center justify-center rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-400">
                    前のページ
                  </span>
                )}

                {hasNextPage ? (
                  <Link
                    href={buildPageHref(currentPage + 1)}
                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                  >
                    次のページ
                  </Link>
                ) : (
                  <span className="inline-flex cursor-not-allowed items-center justify-center rounded-xl bg-slate-200 px-4 py-2 text-sm font-medium text-slate-500">
                    次のページ
                  </span>
                )}
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
