import { getPrismaClient } from "@zapweb3/prisma";
import { User, getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  UserZapApp,
  UserZapAppsResponse,
} from "@zap/recoil";

export async function GET(request: NextRequest, response: NextResponse) {
  const session = await getServerSession(authOptions);
  const user: User | undefined = session?.user;

  let zapApps: UserZapAppsResponse = {
    apps: [],
  };
  if (user) {
    const prismaClient = getPrismaClient();

    const apps: UserZapApp[] | [] = await prismaClient.app.findMany({
      where: {
        UserApp: {
          some: {
            userId: user?.id,
          },
        },
      },
      select: {
        id: true,
        app_name: true,
        app_key: true,
        AppEndpoint: {
          select:{
            id: true,
            endpoint_name: true,
            endpoint_key: true,
            endpoint_description: true,
            endpoint_type: true
          }
        },
        UserApp: {
          select: {
            userId: true,
          },
        },
      },
    });
    zapApps.apps = apps;
  }

  return Response.json(zapApps);
}
