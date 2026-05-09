import { prisma } from "@/lib/prisma";
import { apiResponse } from "@/lib/response";

const GET = async () => {
	try {
		const [calling, skipped, nextCandidates] = await Promise.all([
			prisma.ticket.findMany({
				where: {
					status: {
						in: ["CALLING", "MEETING"],
					},
				},
				orderBy: [{ status: "asc" }, { num: "asc" }],
				take: 3,
			}),
			prisma.ticket.findMany({
				where: {
					status: "CALLED",
				},
				orderBy: [{ updatedAt: "desc" }, { num: "asc" }],
				take: 8,
			}),
			prisma.ticket.findMany({
				where: {
					status: {
						in: ["ENTERED", "OPEN"],
					},
				},
				orderBy: [{ status: "desc" }, { num: "asc" }],
				take: 5,
			}),
		]);

		return apiResponse.success({
			open: nextCandidates,
			meeting: calling,
			skipped,
		});
	} catch (error) {
		console.error(error);
		return apiResponse.internalServerError("モニター用チケット取得に失敗しました");
	}
};

export { GET };