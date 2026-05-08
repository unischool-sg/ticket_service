import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse } from "@/lib/response";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const number = searchParams.get("number");
  if (!number) {
    return apiResponse.badRequest("チケットIDが必要です");
  }

  const ticket = await prisma.ticket.findFirst({
    where: { num: parseInt(number) }
  });
  console.log(ticket);
  
  if (!ticket) {
    return apiResponse.notFound("チケットが見つかりません");
  }

  return apiResponse.success(ticket);
}