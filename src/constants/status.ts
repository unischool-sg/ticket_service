import type { TicketStatus } from "@/generated/prisma/enums";

const statusMap: Record<TicketStatus, { label: string; className: string }> = {
  OPEN: {
    label: "受付中",
    className: "border-slate-200 bg-slate-100 text-slate-700",
  },
  ENTERED: {
    label: "入場済み",
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
  CALLING: {
    label: "呼び出し中",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  CALLED: {
    label: "呼び出し済み（いなかった状態）",
    className: "border-red-200 bg-red-50 text-red-700",
  },
  MEETING: {
    label: "面談中",
    className: "border-violet-200 bg-violet-50 text-violet-700",
  },
  CLOSED: {
    label: "完了",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  CANCELED: {
    label: "キャンセル",
    className: "border-rose-200 bg-rose-50 text-rose-700",
  },
} as const;

export { statusMap };
