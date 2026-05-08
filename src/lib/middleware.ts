import type { NextRequest } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { User } from "@/generated/prisma/client";
import { apiResponse } from "./response";
import { auth } from "./auth";
import { prisma } from "./prisma";

const withAuth = async <T extends Partial<Prisma.UserGetPayload<{ include: Prisma.UserInclude }>>, R = Response>(req: NextRequest, handler: (req: NextRequest, user: User & T) => Promise<R>, include: Prisma.UserInclude = {}) => {
    const session = await auth.api.getSession({
        headers: req.headers
    });
    if (!session) {
        return apiResponse.unauthorized();
    }
    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id
        },
        include: { ...include },
    }) as (User & T) | null;
    if (!user) {
        return apiResponse.unauthorized("User not found");
    }

    return await handler(req, user);
}

export { withAuth };