"use client";
import type { Ticket } from "@/generated/prisma/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type TicketsResult = {
  open: Ticket[];
  meeting: Ticket[];
  skipped: Ticket[];
};

const POLLING_TIME = 1000 * 5;

export default function Monitor() {
  const [openTickets, setOpenTickets] = useState<Ticket[]>([]);
  const [meetingTickets, setMeetingTickets] = useState<Ticket[]>([]);
  const [skippedTickets, setSkippedTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async (): Promise<TicketsResult> => {
      const response = await fetch("/api/tickets/monitor");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }

      return data.data as TicketsResult;
    };

    const updateTickets = async () => {
      try {
        const result = await fetchTickets();
        setOpenTickets(result.open);
        setMeetingTickets(result.meeting);
        setSkippedTickets(result.skipped);
        setIsLoading(false);
      } catch (e) {
        console.error(e);
        toast.error("ポーリング中にエラーが発生しました", {
          description: (e as Error).message,
        });
      }

    };

    void updateTickets();
    const interval = setInterval(() => {
      void updateTickets();
    }, POLLING_TIME);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const nextTicket = openTickets[0];

  return (
    <main className="min-h-screen bg-white px-3 py-4 text-black sm:px-5 sm:py-6 lg:px-8 lg:py-8">
      <div className="mx-auto flex h-[calc(100vh-2rem)] w-full max-w-7xl flex-col gap-3 sm:gap-4 lg:gap-6">
        <header className="flex items-center justify-between rounded-lg border border-black bg-white px-4 py-3 sm:px-6 sm:py-4">
          <div>
            <h1 className="text-lg font-bold sm:text-2xl">呼び出しモニター</h1>
            <p className="text-xs text-gray-600 sm:text-sm">現在の呼び出し状況を表示しています</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-gray-500 sm:text-xs">更新間隔</p>
            <p className="text-sm font-semibold sm:text-base">5秒</p>
          </div>
        </header>

        <div className="grid flex-1 grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6">
          <section className="flex min-h-0 flex-col gap-3 rounded-lg border border-black bg-white p-3 sm:p-5">
            <div className="border-b border-black pb-3">
              <p className="text-sm font-semibold tracking-wide sm:text-base">今呼び出している方</p>
            </div>

            {isLoading ? (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-sm text-gray-600 sm:text-base">読み込み中...</p>
              </div>
            ) : meetingTickets.length === 0 ? (
              <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 text-center">
                <p className="text-sm text-gray-600 sm:text-base">現在呼び出し中の方はいません</p>
              </div>
            ) : (
              <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                {meetingTickets.map((ticket, index) => (
                  <article
                    key={ticket.id}
                    className="flex flex-col justify-between rounded-lg border border-black bg-black p-4 text-white sm:p-5"
                  >
                    <p className="text-xs text-gray-200 sm:text-sm">呼び出し中 {index + 1}</p>
                    <p className="mt-3 text-4xl font-bold leading-none sm:text-6xl">{ticket.num}</p>
                    <p className="mt-4 text-xs text-gray-200 sm:text-sm">受付番号</p>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="grid min-h-0 grid-cols-1 gap-3 sm:gap-4">
            <article className="flex min-h-0 flex-col rounded-lg border border-black bg-white p-3 sm:p-4">
              <div className="border-b border-black pb-2">
                <p className="text-sm font-semibold sm:text-base">スキップした方</p>
                <p className="text-xs text-gray-600">呼び出し時に不在だった方</p>
              </div>
              <div className="mt-3 min-h-0 flex-1 overflow-auto">
                {skippedTickets.length === 0 ? (
                  <p className="text-sm text-gray-500">現在はいません</p>
                ) : (
                  <ul className="space-y-2">
                    {skippedTickets.map((ticket) => (
                      <li
                        key={ticket.id}
                        className="flex items-center justify-between rounded border border-gray-300 px-3 py-2"
                      >
                        <span className="text-sm text-gray-700">番号</span>
                        <span className="text-lg font-semibold">{ticket.num}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>

            <article className="flex min-h-0 flex-col rounded-lg border border-black bg-white p-3 sm:p-4">
              <div className="border-b border-black pb-2">
                <p className="text-sm font-semibold sm:text-base">次に呼ばれる方（最大5件）</p>
                <p className="text-xs text-gray-600">先頭の方を次に呼び出します</p>
              </div>
              <div className="mt-3 min-h-0 flex-1 overflow-auto">
                {openTickets.length === 0 ? (
                  <p className="text-sm text-gray-500">待機中の方はいません</p>
                ) : (
                  <ul className="space-y-2">
                    {openTickets.map((ticket, index) => (
                      <li
                        key={ticket.id}
                        className="flex items-center justify-between rounded border border-black px-3 py-2"
                      >
                        <span className="text-sm text-gray-700">{index + 1}番目</span>
                        <span className="text-xl font-bold">{ticket.num}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          </section>
        </div>

        <footer className="rounded-lg border border-black bg-white px-4 py-2 text-xs text-gray-600 sm:px-6 sm:text-sm">
          次回予定: {nextTicket ? `受付番号 ${nextTicket.num}` : "なし"}
        </footer>
      </div>
    </main>
  );
}
