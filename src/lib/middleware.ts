import type { NextRequest } from "next/server";
import type { User } from "@/generated/prisma/client";
import { auth } from "./auth";
import { apiResponse } from "./response";

type Handler<ctx> = (
  req: NextRequest,
  user: User,
  ctx?: ctx,
) => Promise<Response>;

const withAuth = async <Context extends Record<string, unknown>>(
  req: NextRequest,
  handler: Handler<Context>,
  ctx?: Context,
) => {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return apiResponse.unauthorized("認証が必要です");
  }

  try {
    return await handler(req, session.user as User, ctx);
  } catch (e) {
    console.error("Error in withAuth handler:", e);
    return apiResponse.internalServerError("サーバーエラーが発生しました");
  }
};

export { withAuth };
