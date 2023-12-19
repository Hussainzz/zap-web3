import { getPrismaClient } from "@zapweb3/prisma";
import { User, getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { FlowActionLogsResponse, FlowActionLog } from "@zap/recoil";

export async function GET(request: NextRequest, response: NextResponse) {
  const session = await getServerSession(authOptions);
  const user: User | undefined = session?.user;
  let flowId = request.nextUrl.searchParams.get("flowId") ?? null;
  let limit = request.nextUrl.searchParams.get("limit") ?? null;
  let c = request.nextUrl.searchParams.get("c") ?? null;
  if (!flowId) {
    return NextResponse.json(
      {
        status: "error",
        message: "Bad Request",
      },
      { status: 400 }
    );
  }

  let allLogs: FlowActionLogsResponse = {
    logs: [],
    cursor: null,
  };
  if (user) {
    if (!limit) {
      limit = "10";
    }
    allLogs = await getAllActionLogs(
      parseInt(flowId),
      parseInt(limit),
      c ? parseInt(c) : null
    );
  }

  return Response.json(allLogs);
}

const getAllActionLogs = async (
  flowId: number,
  limit: number,
  myCursor: number | null
): Promise<{
  logs: FlowActionLog[];
  cursor: number | null;
}> => {
  let logs: FlowActionLog[] = [];
  let cursor: number | null = null;

  try {
    const prismaClient = getPrismaClient();
    logs = (await prismaClient.flowActionLog.findMany({
      take: limit,
      ...(myCursor && {
        skip: 1,
        cursor: {
          id: myCursor,
        },
      }),
      where: {
        flowId,
      },
      select: {
        id: true,
        flowId: true,
        flowActionId: true,
        FlowAction: {
          select: {
            AppEndpoint: {
              select: {
                endpoint_name: true,
              },
            },
          },
        },
        status: true,
        resultPayload: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })) as FlowActionLog[] | [];
    cursor =
      logs.length > 0
        ? logs.length === limit
          ? logs[logs.length - 1].id
          : null
        : null;
  } catch (error: any) {
    console.error("Error fetching FlowActionLogs:", error?.message);
  }

  return { logs, cursor };
};
