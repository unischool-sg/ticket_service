import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse } from "@/lib/response";

type Context = {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, context: Context) {
  try {
    const { id } = await context.params;
    const ticket = await prisma.ticket.findUnique({
      where: { id },
    });

    if (!ticket) {
      return apiResponse.notFound("チケットが見つかりません");
    }

    return apiResponse.success(ticket);
  } catch (e) {
    console.error("Error in GET /api/tickets/[id]:", e);
    return apiResponse.internalServerError("サーバーエラーが発生しました");
  }

}

export async function PUT(req: NextRequest, context: Context) {
  try {
    const [{ id }, { status }] = await Promise.all([context.params, req.json()]);
    const ticket = await prisma.ticket.findUnique({
      where: { id },
    });
    if (!ticket) {
      return apiResponse.notFound("チケットが見つかりません");
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: { status },
    });
    
    return apiResponse.success(updatedTicket);
  } catch (e) {
    console.error("Error in PUT /api/tickets/[id]:", e);
    return apiResponse.internalServerError("サーバーエラーが発生しました");
  }
}