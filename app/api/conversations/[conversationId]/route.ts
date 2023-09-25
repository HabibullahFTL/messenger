import getCurrentUser from '@/app/actions/getCurrentUser';
import { NextResponse } from 'next/server';

import { userSelector } from '@/app/libs/constants';
import prisma from '@/app/libs/prismadb';
import { pusherServer } from '@/app/libs/pusher';

interface IParams {
  conversationId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const { conversationId } = params;
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return NextResponse.json(null);
    }

    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: userSelector,
      },
    });

    if (!existingConversation) {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    existingConversation?.users?.map((user) => {
      if (user?.email) {
        pusherServer.trigger(
          user?.email,
          'conversation:remove',
          existingConversation
        );
      }
    });

    const deletedConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id],
        },
      },
    });

    return NextResponse.json(deletedConversation);
  } catch (error) {
    return NextResponse.json(null);
  }
}
