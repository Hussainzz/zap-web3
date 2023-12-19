import { getPrismaClient } from "@zapweb3/prisma";
import { User, getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserZapFlowEvent, UserZapEventFlowResponse } from "@zap/recoil";

export async function GET(request: NextRequest, response: NextResponse) {
  const session = await getServerSession(authOptions);
  const user: User | undefined = session?.user;

  let eventFlows: UserZapEventFlowResponse = {
    userEventFlows: [],
  };
  if (user) {
    let flowId = request.nextUrl.searchParams.get("flowId") ?? null;
    if(flowId) {
      const eventFlow = await getUserEventFlowById(parseInt(flowId), user);
      eventFlows.userEventFlows = eventFlow ? [eventFlow] : [];
    }else{
      eventFlows.userEventFlows = await getAllUserEventFlows(user);
    }
  }

  return Response.json(eventFlows);
}

const getUserEventFlowById = async (flowId: number, user: User): Promise<UserZapFlowEvent | null> => {
  let allEvent: UserZapFlowEvent | null = null;
  try {
    const prismaClient = getPrismaClient();
    allEvent = await prismaClient.flow.findUnique({
      where: {
        id: flowId,
        Event: {
          userId: user.id,
        },
      },
      select: {
        id: true,
        flow_name: true,
        FlowAction: {
          select: {
            id: true,
            actionPayload: true,
            appEndpointId: true,
            AppEndpoint: {
              select: {
                endpoint_name: true,
                endpoint_description: true,
                endpoint_key: true,
                appId: true,
                App: {
                  select: {
                    app_name: true,
                    app_key: true,
                  },
                },
              },
            },
          },
        },
        eventId: true,
        Event: {
          select: {
            event_name: true,
            event_description: true,
            event_payload: true,
            is_active: true,
            userId: true,
            contractId: true,
            Contract: {
              select: {
                contract_address: true,
              },
            },
          },
        },
      },
    });
  } catch (error: any) {
    console.log("Error User Event Flow ", error?.message);
  }
  return allEvent;
}

const getAllUserEventFlows = async (
  user: User
): Promise<UserZapFlowEvent[] | []> => {
  let allEvents: UserZapFlowEvent[] | [] = [];
  try {
    const prismaClient = getPrismaClient();

    allEvents = await prismaClient.flow.findMany({
      where: {
        Event: {
          userId: user.id,
        },
      },
      select: {
        id: true,
        flow_name: true,
        FlowAction: {
          select: {
            id: true,
            actionPayload: true,
            appEndpointId: true,
            AppEndpoint: {
              select: {
                endpoint_name: true,
                endpoint_description: true,
                endpoint_key: true,
                appId: true,
                App: {
                  select: {
                    app_name: true,
                    app_key: true,
                  },
                },
              },
            },
          },
        },
        eventId: true,
        Event: {
          select: {
            event_name: true,
            event_description: true,
            event_payload: true,
            is_active: true,
            userId: true,
            contractId: true,
            Contract: {
              select: {
                contract_address: true,
              },
            },
          },
        },
      },
    });
  } catch (error: any) {
    console.log("getAllUserEventFlows | ERROR | ", error?.message);
  }
  return allEvents;
};
