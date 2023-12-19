import { NextResponse } from "next/server";
import { z } from "zod";
import { User, getServerSession } from "next-auth";
import { authOptions } from "auth";
import HashID from "@/utils/HashID";
import axios from "axios";
import { decryptString } from "@/lib/encrypt";

const REGISTER_EVENT_API = `${process.env.ZAP_API_URL}/api/event/register`;


const eventSchema = z.object({
  eventId: z.number()
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

  const { eventId } = requestBody.data;
  const encodedEventId = HashID.encodeNumber(eventId);
  const accessToken = decryptString(user?.apiAccessToken ?? '');

  const registerEventResponse = {
    status: "error",
    message: "Something went wrong",
  };
  let httpResponseCode = 500;

  try {
    const result = await axios.post(
      `${REGISTER_EVENT_API}`,
      {
        eventId: encodedEventId
      },
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );
    const data = result?.data;
    if (data?.created) {
      httpResponseCode = 200;
      registerEventResponse.status = "success";
      registerEventResponse.message = "Event flow activated successfully"
    }
  } catch (error: any) {
    console.log(error?.message);
  }

  return NextResponse.json(registerEventResponse, { status: httpResponseCode });
}
