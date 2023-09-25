import getCurrentUser from '@/app/actions/getCurrentUser';
import { userSelector } from '@/app/libs/constants';
import prisma from '@/app/libs/prismadb';
import { pusherServer } from '@/app/libs/pusher';
import { NextResponse } from 'next/server';

interface IParams {
  conversationId: string;
}

export const POST = async (req: Request, { params }: { params: IParams }) => {
  console.log(params);
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!params?.conversationId) {
      return new NextResponse('Invalid request', { status: 400 });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: params?.conversationId },
      include: {
        messages: {
          take: 1, // Limit the result to one message
          orderBy: {
            createdAt: 'desc', // Order messages by creation date in descending order
          },
          include: {
            seen: userSelector,
          },
        },
        users: userSelector,
      },
    });

    if (!conversation) {
      return new NextResponse('Invalid id', { status: 400 });
    }

    //Find last message
    const lastMessage =
      conversation?.messages?.[conversation?.messages?.length - 1];

    if (!lastMessage) {
      return NextResponse.json(conversation);
    }

    const updatedMessage = await prisma.message.update({
      where: {
        id: lastMessage.id,
      },
      include: {
        sender: userSelector,
        seen: userSelector,
      },
      data: {
        seen: {
          connect: {
            id: currentUser?.id,
          },
        },
      },
    });

    await pusherServer.trigger(currentUser.email, 'conversation:update', {
      id: params.conversationId,
      messages: [updatedMessage],
    });

    if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
      return NextResponse.json(conversation);
    }

    await pusherServer.trigger(
      params.conversationId,
      'message:update',
      updatedMessage
    );

    return NextResponse.json(updatedMessage);
  } catch (error) {
    return new NextResponse('Internal server error', { status: 500 });
  }
};
