import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prismadb from "@/helpers/prismadb";

export async function GET(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const users = await prismadb.user.findMany({
    include: {
      conversations: {
        include: {
          messages: {
            include: {
              sender: true,
              receiver: true,
            },
            orderBy: {
              createdAt: "asc",
            },
          },
          users: true,
        },
      },
    },
  });

  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();

  // 이미 둘이 대화를 한 conversation 찾기
  const conversation = await prisma?.conversation.findFirst({
    where: {
      AND: [
        {
          users: {
            some: {
              id: body.senderId,
            },
          },
        },
        {
          users: {
            some: {
              id: body.receiverId,
            },
          },
        },
      ],
    },
  });

  if (conversation) {
    // 이미 둘이 대화를 한 conversation 이 있다면 메시지만 생성
    try {
      const message = await prisma?.message.create({
        data: {
          text: body.text,
          image: body.image,
          senderId: body.senderId,
          receiverId: body.receiverId,
          conversationId: conversation.id,
        },
      });

      return NextResponse.json(message);
    } catch (err) {
      return NextResponse.json(err);
    }
  } else {
    const newConversation = await prisma?.conversation.create({
      data: {
        senderId: body.senderId,
        receiverId: body.receiverId,
        users: {
          connect: [
            {
              id: body.senderId,
            },
            {
              id: body.receiverId,
            },
          ],
        },
      },
    });

    if (!newConversation) {
      throw new Error("대화가 생성되지 않음");
    }

    try {
      const message = await prisma?.message.create({
        data: {
          text: body.text,
          image: body.image,
          senderId: body.senderId,
          receiverId: body.receiverId,
          conversationId: newConversation.id,
        },
      });

      return NextResponse.json(message);
    } catch (err) {
      return NextResponse.json(err);
    }
  }
}
