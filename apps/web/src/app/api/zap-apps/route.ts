import { getPrismaClient } from "@zapweb3/prisma";
import { User, getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ZapApp, ZapAppsResponse } from "@zap/recoil";

export async function GET(request: NextRequest, response: NextResponse) {
  const session = await getServerSession(authOptions);
  const user: User | undefined = session?.user;

  let zapApps: ZapAppsResponse = {
    apps: [],
  };
  if (user) {
    const prismaClient = getPrismaClient();

    const apps: ZapApp[] | [] = await prismaClient.app.findMany({
      select: {
        id: true,
        app_name: true,
        app_key: true,
        app_auth_url: true,
        UserApp: {
          select: {
            userId: true,
          },
          where: {
            userId: user?.id,
          },
        },
      },
      where:{
        app_key:{
          not: 'webhook'
        }
      }
    });
    zapApps.apps = apps;
  }

  return Response.json(zapApps);
}
