import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const eventSchema = z.object({
  flowName: z.string().refine((value) => !value.includes("+"), {
    message: "String should not contain a plus symbol (+).",
  }),
  flowDesc: z.string(),
  contractId: z.number(),
  contractEvent: z.object({
    name: z.string(),
    type: z.string(),
    inputs: z.array(
      z.object({
        name: z.string(),
        type: z.string(),
        indexed: z.boolean(),
        internalType: z.string(),
      })
    ),
    anonymous: z.boolean(),
  }),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const user: User | undefined = session?.user;
  const body = await request.json();
  const requestBody = eventSchema.safeParse(body);

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

  const { flowName, flowDesc, contractId, contractEvent } = requestBody.data;

  const createEventResponse = {
    status: "error",
    message: "Something went wrong",
  };
  let httpResponseCode = 500;
  try {
    const newEvent = await prisma.event.create({
      data: {
        event_name: contractEvent?.name,
        event_description: '',
        event_payload: contractEvent,
        userId: user?.id,
        contractId: contractId,
        is_active: 0,
      },
    });

    if (newEvent?.id) {
      const newFlow = await prisma.flow.create({
        data: {
          eventId: newEvent.id,
          flow_name: flowName,
          flow_description: flowDesc,
        },
      });
      if (newFlow) {
        httpResponseCode = 201;
        createEventResponse.status = "success";
        createEventResponse.message = "Event created successfully";
      }
    }
  } catch (error: any) {
    console.log(error?.message);
  }

  return NextResponse.json(createEventResponse, { status: httpResponseCode });
}
