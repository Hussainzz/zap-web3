import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { User, getServerSession } from "next-auth";
import { authOptions } from "auth";

const flowActionSchema = z.object({
  flowActions: z.array(
    z.object({
      flowId: z.number(),
      appEndpointId: z.number(),
      actionPayload: z.unknown(),
    })
  ),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const user: User | undefined = session?.user;
  const body = await request.json();
  const requestBody = flowActionSchema.safeParse(body);

  if (!session || !user || !user?.id) {
    return NextResponse.json(
      {
        status: "error",
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  if (!requestBody.success) {
    const { errors } = requestBody.error;

    return NextResponse.json(
      {
        status: "error",
        message: "Bad Request",
        errors,
      },
      { status: 400 }
    );
  }

  const { flowActions } = requestBody.data;

  const createFlowActionResponse = {
    status: "error",
    message: "Something went wrong",
  };
  let httpResponseCode = 500;
  try {
    const newFlowAction = await prisma.flowAction.createMany({
      data: flowActions as any[],
    });
    if (newFlowAction) {
      httpResponseCode = 201;
      createFlowActionResponse.status = "success";
      createFlowActionResponse.message = "Flow Action created successfully";
    }
  } catch (error: any) {
    console.log(error?.message);
  }

  return NextResponse.json(createFlowActionResponse, {
    status: httpResponseCode,
  });
}

export async function DELETE(request: NextRequest, response: NextResponse){
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
  let actionId = request.nextUrl.searchParams.get("actionId") ?? null;

  if(!flowId || !actionId) {
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
    message: "Failed to remove action"
  }
  try {
    await prisma.$executeRaw`SET foreign_key_checks = 0`;
    await prisma.flowAction.delete({
      where: {
        id: parseInt(actionId),
        flowId: parseInt(flowId)
      },
    });
    await prisma.flowActionLog.deleteMany({
      where: {
        flowActionId: parseInt(actionId),
        flowId: parseInt(flowId)
      },
    });
    resultResponse.status = 'success';
    resultResponse.message = 'Action removed successfully';
    httpCode = 200;
  } catch (error: any) {
    console.log(error?.message);
    resultResponse.message = "Something went wrong!"
  }
  return NextResponse.json(resultResponse, {
    status: httpCode,
  });
}
