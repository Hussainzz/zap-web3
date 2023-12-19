import { getPrismaClient } from "@zapweb3/prisma";
import { User, getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AppZap, AppZapEndpoint } from "@zap/recoil";

interface ZapAppParams {
  appId?: number;
  appEndpointId?: number;
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const user: User | undefined = session?.user;

  let zapApp: AppZap | null = null;
  let zapAppEndpoint: AppZapEndpoint | null = null;
  if (user) {
    const prismaClient = getPrismaClient();

    let appIdParam = request.nextUrl.searchParams.get("appId");
    let appEndpointIdParam = request.nextUrl.searchParams.get("appEndpointId");

    let appId: number | null = appIdParam ? parseInt(appIdParam) : null;
    let appEndpointId: number | null = appEndpointIdParam
      ? parseInt(appEndpointIdParam)
      : null;

    if (!appEndpointId && !appId) {
      return NextResponse.json(
        {
          status: "error",
          message: "Bad Request",
        },
        { status: 400 }
      );
    }

    if (!appId && appEndpointId) {
      const appEndpoint = await prismaClient.appEndpoint.findFirst({
        where: {
          id: appEndpointId,
        },
        select: {
          id: true,
          appId: true,
          endpoint_name: true,
          endpoint_description: true,
        },
      });
      if (appEndpoint) {
        appId = appEndpoint?.appId;
        zapAppEndpoint = appEndpoint;
      }
    }

    if (appId) {
      const app: AppZap | null = await prismaClient.app.findUnique({
        where: {
          id: appId,
        },
        select: {
          id: true,
          app_name: true,
          app_key: true,
        },
      });
      zapApp = app;
    }
  }

  return Response.json({
    zapApp,
    zapAppEndpoint,
  });
}
