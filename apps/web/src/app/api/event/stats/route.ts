import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { User, getServerSession } from "next-auth";
import { authOptions } from "auth";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const user: User | undefined = session?.user;
  if (!session || !user || !user?.id) {
    return NextResponse.json(
      {
        status: "error",
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  const eventStats = {
    count: 0,
  };

  try {
    const eventCount = await prisma.event.count({
      where: {
        userId: user.id,
      },
    });
    eventStats.count = eventCount;
  } catch (error) {}

  return NextResponse.json(eventStats, { status: 200 });
}
