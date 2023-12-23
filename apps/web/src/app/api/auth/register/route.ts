import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { z } from "zod";

const registerSchema = z.object({
  fullname: z.string().refine((value) => !value.includes("+"), {
    message: "String should not contain a plus symbol (+).",
  }),
  email: z.string().email(),
  password: z.string().min(7),
});

export async function POST(request: Request) {
  const body = await request.json();
  const response = registerSchema.safeParse(body);

  if (!response.success) {
    const { errors } = response.error;

    return NextResponse.json(
      {
        status: "error",
        message: "Bad Request",
        errors,
      },
      { status: 400 }
    );
  }

  const { fullname, email, password } = response.data;
  const exists = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (exists) {
    return NextResponse.json(
      {
        status: "error",
        message: "User already exists",
      },
      { status: 400 }
    );
  } else {
    const user = await prisma.user.create({
      data: {
        fullname,
        email,
        password: await hash(password, 10),
      },
    });

    const webhookApp = await prisma.app.findFirst({where:{app_key:"webhook"}, select:{id: true}});
    if(webhookApp){
      const webhookAppUserAppCount = await prisma.userApp.count({
        where: {
          userId: user.id,
          appId: webhookApp.id
        },
      });
      if(!webhookAppUserAppCount){
        await prisma.userApp.create({
          data:{
            userId: user.id,
            appId: webhookApp.id,
            access_token: '',
            response_payload: {}
          }
        });
      }
    }

    return NextResponse.json(
      {
        status: "success",
        message: "User Registered",
        user,
      },
      { status: 201 }
    );
  }
}
