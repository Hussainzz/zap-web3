import { NextResponse } from "next/server";
import { z } from "zod";
import { User, getServerSession } from "next-auth";
import { authOptions } from "auth";
import axios from "axios";
import { decryptString } from "@/lib/encrypt";
import prisma from "@/lib/prisma";

const REVOKE_APP_API = `${process.env.ZAP_API_URL}/api/apps/revoke`;

const eventSchema = z.object({
  appId: z.number(),
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

  const { appId } = requestBody.data;
  const accessToken = decryptString(user?.apiAccessToken ?? "");

  const revokeAppResponse = {
    status: "error",
    message: "Something went wrong",
  };
  let httpResponseCode = 500;

  try {
    const useAppInfo = await prisma.userApp.findFirst({
      where: {
        userId: user.id,
        appId: appId,
      },
      select: {
        id: true,
        appId: true,
        App: {
          select: {
            app_key: true,
          },
        },
      },
    });

    if (!useAppInfo) {
      return NextResponse.json(
        {
          status: "error",
          message: "User App not found",
        },
        { status: 400 }
      );
    }

    const connectedToActions = await checkFlowActionsConnectedToApp(appId);
    if (connectedToActions) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "User App is connected to flows, please delete the flow and try again",
        },
        { status: 200 }
      );
    }

    const result = await axios.post(
      `${REVOKE_APP_API}`,
      {
        userAppId: useAppInfo?.id,
        appKey: useAppInfo.App.app_key,
        appId: appId,
      },
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );
    const data = result?.data;
    if (data?.disconnected) {
      httpResponseCode = 200;
      revokeAppResponse.status = "success";
      revokeAppResponse.message = "App disconnected successfully";
    }
  } catch (error: any) {
    console.log(error?.message);
  }

  return NextResponse.json(revokeAppResponse, { status: httpResponseCode });
}

const checkFlowActionsConnectedToApp = async (appId: number) => {
  try {
    const actions = await prisma.flowAction.findMany({
      where: {
        AppEndpoint: {
          appId: appId,
        },
      },
      select: {
        id: true,
        appEndpointId: true,
        AppEndpoint: {
          select: {
            appId: true,
          },
        },
      },
    });
    return actions.length > 0;
  } catch (error:any) {
    console.log(error?.message)
  }
  return false;
};
