import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { ip, latitude, longitude, photo } = body;

    await prisma.attendance.create({
      data: {
        ip,
        latitude,
        longitude,
        photo,
      },
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    return NextResponse.json(
      { error: "Failed" },
      { status: 500 }
    );
  }
}
