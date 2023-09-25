import getCurrentUser from '@/app/actions/getCurrentUser';
import { userSelector } from '@/app/libs/constants';
import prisma from '@/app/libs/prismadb';
import { pusherServer } from '@/app/libs/pusher';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
  const currentUser = await getCurrentUser();
  const body = await req.json();

  const { userId = '', isGroup = false, members, name = '' } = body;

  if (!currentUser?.id || !currentUser?.email) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if (isGroup && (!members || members?.length < 2 || !name)) {
    return new NextResponse('Invalid data', { status: 400 });
  }

  try {
    if (isGroup) {
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members?.map((member: { value: string }) => ({
                id: member?.value,
              })),
              {
                id: currentUser?.id,
              },
            ],
          },
        },
        include: {
          users: userSelector,
        },
      });

      newConversation?.users?.map((user) => {
        if (user?.email) {
          pusherServer.trigger(
            user?.email,
            'conversation:new',
            newConversation
          );
        }
      });

      return NextResponse.json(newConversation);
    }

    const existingConversations = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [userId, currentUser?.id],
            },
          },
          {
            userIds: {
              equals: [currentUser?.id, userId],
            },
          },
        ],
      },
    });

    const singleConversation = existingConversations?.[0];

    if (singleConversation) {
      return NextResponse.json(singleConversation);
    }

    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: currentUser?.id,
            },
            {
              id: userId,
            },
          ],
        },
      },
      include: {
        users: userSelector,
      },
    });

    newConversation?.users?.map((user) => {
      if (user?.email) {
        pusherServer.trigger(user?.email, 'conversation:new', newConversation);
      }
    });

    return NextResponse.json(newConversation);
  } catch (error) {
    console.log(error, 'CONVERSATION_CREATE_ERROR');
    return new NextResponse('Internal error', { status: 500 });
  }
};
