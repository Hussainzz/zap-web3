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
