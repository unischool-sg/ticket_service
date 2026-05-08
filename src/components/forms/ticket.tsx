"use client";
import { TicketStatus } from "@/generated/prisma/enums";
import { toast } from "sonner";
import { statusMap } from "@/constants/status";

type TicketStatusChangeForm = {
    ticketId: string;
}
export function TicketStatusChangeForm({ ticketId }: TicketStatusChangeForm) {
    const handleTicketSubmit = async (form: FormData) => {
        const toaster = toast.loading("チケットステータスを更新しています...");

        try {
            const status: TicketStatus = form.get("status") as TicketStatus ?? "ENTERED";
            console.log(status);
            const response = await fetch(`/api/tickets/${ticketId}`, {
                method: "PUT",
                body: JSON.stringify({ status }),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            if (!response.ok) {
                toast.error(data.error, { id: toaster });
                return;
            }
        } catch (e) {
            console.error(e);
            toast.error("エラーが発生しました", {
                id: toaster,
                description: (e as Record<string, string>).message
            });
            return;
        }

        toast.success("チケットの更新に成功しました", {
            id: toaster
        });
    }
    
    const statuses = Object.entries(statusMap).map(([key, value]) => ({
        key: key as TicketStatus,
        ...value
    }));

    return (
        <form action={handleTicketSubmit}>
            <section className="rounded-lg border border-black bg-white p-6 sm:p-8">
                <div className="space-y-4">
                    <div>
                        <h2 className="text-lg font-semibold text-black">ステータス変更</h2>
                        <p className="mt-1 text-sm text-gray-600">このチケットの状態を更新します。</p>
                    </div>

                    <div className="space-y-3">
                        {statuses.map((status) => (
                            <label key={status.key} className="flex items-center gap-3 cursor-pointer p-3 rounded border border-gray-300 hover:border-black transition">
                                <input
                                    type="radio"
                                    name="status"
                                    value={status.key}
                                    className="w-4 h-4 accent-black cursor-pointer"
                                />
                                <div className="flex-1">
                                    <p className="font-medium text-black">{status.label}</p>
                                </div>
                                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${status.className}`}>
                                    {status.label}
                                </span>
                            </label>
                        ))}
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded border border-black bg-black px-6 py-2.5 font-medium text-white transition hover:bg-gray-900"
                    >
                        ステータスを更新
                    </button>
                </div>
            </section>
        </form>
    );
}