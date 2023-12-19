import { NextResponse } from "next/server";
import { z } from "zod";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import axios from "axios";
import { decryptString } from "@/lib/encrypt";

const SLACK_USER_INFO_API = `${process.env.ZAP_API_URL}/api/apps/user-app-info`;
/* 
{
  "appEndpointId": 1,
  "appKey":"slack",
  "dataType":"channels"
}
*/
const appInfoSchema = z.object({
  appEndpointId: z.number(),
  appKey: z.string(),
  dataType: z.string().default(''),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const user: User | undefined = session?.user;

  const body = await request.json();
  const requestBody = appInfoSchema.safeParse(body);

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

  const { appEndpointId, appKey, dataType } = requestBody.data;
  const accessToken = decryptString(user?.apiAccessToken ?? '');
  let appInfoResponse = {
    dataRequested: dataType,
    status: "error",
    data: null,
  };
  let httpResponseCode = 200;
  try {
    const result = await axios.post(
      `${SLACK_USER_INFO_API}`,
      {
        appEndpointId,
        appKey,
        dataType,
      },
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );
    const data = result?.data;
    if (data?.status == "success") {
      appInfoResponse = data;
    }
  } catch (error: any) {
    console.log(error?.message);
  }

  return NextResponse.json(appInfoResponse, { status: httpResponseCode });
}
