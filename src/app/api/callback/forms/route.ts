import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse } from "@/lib/response";

export async function POST(req: NextRequest) {
  const callbackToken = process.env.CALLBACK_TOKEN;
  if (!callbackToken) {
    console.error("CALLBACL_TOKEN is not configured");
    return apiResponse.internalServerError();
  }
  
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return apiResponse.unauthorized();
  }

  const token = authHeader.split(" ")[1];
  if (token !== process.env.CALLBACK_TOKEN) {
    return apiResponse.unauthorized();
  }

  try {
    const rawData = await req.json();
    const result = await prisma.ticket.create({
      data: {
        rawAnswer: rawData,
      },
    });
    return apiResponse.success(result);
  } catch (error) {
    console.error("Error creating ticket:", error);
    return apiResponse.internalServerError();
  }
}
