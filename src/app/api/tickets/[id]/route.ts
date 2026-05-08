import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse } from "@/lib/response";

type Context = {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, context: Context) {
  const { id } = await context.params;
  
  const ticket = await prisma.ticket.findUnique({
    where: { id },
  });

  if (!ticket) {
    return apiResponse.notFound("チケットが見つかりません");
  }

  return apiResponse.success(ticket);
}

export async function PUT(req: NextRequest, context: Context) {
  const { id } = await context.params;
  const { status } = await req.json();

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
}