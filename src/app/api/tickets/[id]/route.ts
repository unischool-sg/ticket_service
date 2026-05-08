import type { NextRequest } from "next/server";
import type { User } from "@/generated/prisma/client";
import { withAuth } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";
import { apiResponse } from "@/lib/response";

type Context = {
  params: Promise<{ id: string }>;
};

const GET = (req: NextRequest, ctx: Context) =>
  withAuth<Context>(
    req,
    async (_: NextRequest, user: Partial<User>, ctx: Context | undefined) => {
      if (!user?.email?.endsWith("@sandagakuen.ed.jp")) {
        return apiResponse.forbidden("アクセスが拒否されました");
      }
      if (!ctx)
        return apiResponse.internalServerError(
          "チケットIDの取得に失敗しました",
        );

      const { id } = await ctx.params;
      const ticket = await prisma.ticket.findUnique({
        where: { id },
      });

      if (!ticket) {
        return apiResponse.notFound("チケットが見つかりません");
      }

      return apiResponse.success(ticket);
    },
    ctx,
  );
const PUT = (req: NextRequest, ctx: Context) =>
  withAuth<Context>(
    req,
    async (_: NextRequest, user: Partial<User>, ctx: Context | undefined) => {
      if (!user?.email?.endsWith("@sandagakuen.ed.jp")) {
        return apiResponse.forbidden("アクセスが拒否されました");
      }
      if (!ctx)
        return apiResponse.internalServerError(
          "チケットIDの取得に失敗しました",
        );

      const { id } = await ctx.params;
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
    },
    ctx,
  );

export { GET, PUT };
