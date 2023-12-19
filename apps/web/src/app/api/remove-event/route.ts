import { NextResponse } from "next/server";
import { z } from "zod";
import { User, getServerSession } from "next-auth";
import { authOptions } from "auth";
import HashID from "@/utils/HashID";
import axios from "axios";
import { decryptString } from "@/lib/encrypt";

const REMOVE_EVENT_API = `${process.env.ZAP_EVENTS_SERVICE}/api/event/listen`;

const eventSchema = z.object({
  eventId: z.number(),
});

export async function PUT(request: Request) {
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
  const accessToken = decryptString(user?.apiAccessToken ?? "");

  const deRegisterEventResponse = {
    status: "error",
    message: "Something went wrong",
  };
  let httpResponseCode = 500;

  try {
    const result = await axios.put(`${REMOVE_EVENT_API}/${encodedEventId}`, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });
    const data = result?.data;
    if (data?.status === "success") {
      httpResponseCode = 200;
      deRegisterEventResponse.status = "success";
      deRegisterEventResponse.message = "Event flow de-activated successfully";
    }
  } catch (error: any) {
    console.log(error?.message);
  }

  return NextResponse.json(deRegisterEventResponse, {
    status: httpResponseCode,
  });
}
