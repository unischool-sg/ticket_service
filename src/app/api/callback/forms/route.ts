import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    if (token !== process.env.CALLBACK_TOKEN) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const rawData = await req.json();
        await prisma.ticket.create({
            data: {
                rawAnswer: rawData,
            }
        });
    } catch (error) {
        console.error("Error creating ticket:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

    return NextResponse.json({ message: "Ticket created successfully" });
}