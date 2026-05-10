import { prisma } from "@/lib/prisma";
import { apiResponse } from "@/lib/response";

const GET = async () => {
  try {
    // Reduce DB load by requesting only required fields.
    // Keep queries parallel (Promise.all) to avoid long transactions.
    const [calling, skipped, nextCandidates] = await Promise.all([
      prisma.ticket.findMany({
        where: {
          status: { in: ["CALLING", "MEETING"] },
        },
        orderBy: [{ status: "asc" }, { num: "asc" }],
        take: 3,
        select: {
          id: true,
          num: true,
          status: true,
          updatedAt: true,
          createdAt: true,
        },
      }),
      prisma.ticket.findMany({
        where: { status: "CALLED" },
        orderBy: [{ updatedAt: "desc" }, { num: "asc" }],
        take: 8,
        select: {
          id: true,
          num: true,
          status: true,
          updatedAt: true,
        },
      }),
      prisma.ticket.findMany({
        where: { status: { in: ["ENTERED", "OPEN"] } },
        orderBy: [{ num: "asc" }],
        take: 5,
        select: {
          id: true,
          num: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    return apiResponse.success({
      open: nextCandidates,
      meeting: calling,
      skipped,
    });
  } catch (error) {
    console.error(error);
    return apiResponse.internalServerError(
      "モニター用チケット取得に失敗しました",
    );
  }
};

export { GET };
