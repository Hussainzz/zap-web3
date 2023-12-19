import { User, getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function DELETE(request: NextRequest, response: NextResponse) {
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

  let flowId = request.nextUrl.searchParams.get("flowId") ?? null;
  let eventId = request.nextUrl.searchParams.get("eventId") ?? null;

  if (!flowId || !eventId) {
    return NextResponse.json(
      {
        status: "error",
        message: "Bad Request",
      },
      { status: 400 }
    );
  }

  let httpCode = 500;
  let resultResponse = {
    status: "error",
    message: "Failed to remove event flow",
  };
  try {
    await prisma.$executeRaw`SET foreign_key_checks = 0`;
    await prisma.$transaction([
      prisma.event.deleteMany({
        where: {
          id: parseInt(eventId),
          userId: user.id,
        },
      }),
      prisma.flow.deleteMany({
        where: {
          id: parseInt(flowId),
          eventId: parseInt(eventId),
        },
      }),
      prisma.flowAction.deleteMany({
        where: {
          flowId: parseInt(flowId),
        },
      }),
      prisma.flowActionLog.deleteMany({
        where: {
          flowId: parseInt(flowId),
        },
      }),
    ]);

    resultResponse.status = "success";
    resultResponse.message = "Event flow removed successfully";
    httpCode = 200;
  } catch (error: any) {
    console.log(error?.message);
    resultResponse.message = "Something went wrong!";
  }
  return NextResponse.json(resultResponse, {
    status: httpCode,
  });
}
