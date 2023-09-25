import getCurrentUser from '@/app/actions/getCurrentUser';
import { userSelector } from '@/app/libs/constants';
import prisma from '@/app/libs/prismadb';
import { pusherServer } from '@/app/libs/pusher';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
  try {
    const currentUser = await getCurrentUser();
    const body = await req.json();
    const { message, image, conversationId } = body;
    console.log({ message, image, conversationId });

    if (!currentUser || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!conversationId || (!message && !image)) {
      return new NextResponse('Invalid request', { status: 400 });
    }

    const newMessage = await prisma?.message.create({
      data: {
        body: message,
        image,
        conversation: {
          connect: {
            id: conversationId,
          },
        },
        sender: {
          connect: {
            id: currentUser?.id,
          },
        },
        seen: {
          connect: {
            id: currentUser?.id,
          },
        },
      },
      include: {
        seen: userSelector,
        sender: userSelector,
      },
    });

    await pusherServer.trigger(conversationId, 'message:new', newMessage);

    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage.id,
          },
        },
      },
      include: {
        users: userSelector,
        messages: {
          take: 1, // Limit the result to one message
          orderBy: {
            createdAt: 'desc', // Order messages by creation date in descending order
          },
          include: {
            seen: userSelector,
          },
        },
      },
    });

    const lastMessage = await updatedConversation?.messages?.[
      updatedConversation?.messages?.length - 1
    ];

    updatedConversation?.users?.map((user) => {
      pusherServer.trigger(user?.email!, 'conversation:update', {
        id: conversationId,
        messages: [lastMessage],
      });
    });

    return NextResponse.json(newMessage);
  } catch (error) {
    console.log(error, 'MESSAGE_CREATION_ERROR');
    return new NextResponse('Internal error', { status: 500 });
  }
};
