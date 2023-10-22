import bcrypt from "bcryptjs";
import prisma from "@/libs/prisma.db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  console.log(request);
  const body = await request.json();

  const { email, name, password } = body;

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword,
    },
  });

  return NextResponse.json(user);
}
