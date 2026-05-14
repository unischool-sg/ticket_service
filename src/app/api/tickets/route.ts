import type { NextRequest } from "next/server";
import type { User } from "@/generated/prisma/client";
import { withAuth } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";
import { apiResponse } from "@/lib/response";

const GET = (req: NextRequest) =>
  withAuth(req, async (req: NextRequest, _user: User) => {
    const { searchParams } = new URL(req.url);

    const number = searchParams.get("number");
    if (!number) {
      return apiResponse.badRequest("チケット番号が必要です");
    }
    try {
      const ticket = await prisma.ticket.findFirst({
        where: { num: number },
      });
      console.log(ticket);

      if (!ticket) {
        return apiResponse.notFound("チケットが見つかりません");
      }

      return apiResponse.success(ticket);
    } catch (e) {
      console.error(e);
      return apiResponse.internalServerError("チケットの取得に失敗しました");
    }
  });

export { GET };
