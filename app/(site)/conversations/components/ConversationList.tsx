'use client';

import useConversation from '@/app/hooks/useConversation';
import { pusherClient } from '@/app/libs/pusher';
import { FullConversationType } from '@/app/types';
import { User } from '@prisma/client';
import clsx from 'clsx';
import { find } from 'lodash';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useMemo, useState } from 'react';
import { MdOutlineGroupAdd } from 'react-icons/md';
import ConversationBox from './ConversationBox';
import GroupChatModal from './GroupChatModal';

interface ConversationListProps {
  initialItems: FullConversationType[];
  users: User[];
}

const ConversationList: FC<ConversationListProps> = ({
  initialItems,
  users,
}) => {
  const [items, setItems] = useState(initialItems);
  const [isGroupChatModalOpen, setIsGroupChatModalOpen] = useState(false);
  const { isOpen, conversationId } = useConversation();
  const router = useRouter();

  const session = useSession();

  const pusherKey = useMemo(() => {
    return session?.data?.user?.email;
  }, [session?.data?.user?.email]);

  useEffect(() => {
    if (!pusherKey) {
      return;
    }

    pusherClient.subscribe(pusherKey);

    const newConversationHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        if (find(current, { id: conversation?.id })) {
          console.log('Found');

          return current;
        }
        console.log('Not Found');
        return [conversation, ...current];
      });
    };
    pusherClient.bind('conversation:new', newConversationHandler);

    const updateConversationHandler = (conversation: FullConversationType) => {
      setItems((current) =>
        current?.map((currentConversation) => {
          if (currentConversation?.id === conversation?.id) {
            return { ...currentConversation, messages: conversation?.messages };
          }
          return currentConversation;
        })
      );
    };
    pusherClient.bind('conversation:update', updateConversationHandler);

    const removeConversationHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        return [
          ...current?.filter(
            (currentConversation) =>
              currentConversation?.id !== conversation?.id
          ),
        ];
      });

      if (conversation?.id === conversationId) {
        router.push('/conversations');
      }
    };
    pusherClient.bind('conversation:remove', removeConversationHandler);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.bind('conversation:new', newConversationHandler);
      pusherClient.bind('conversation:update', updateConversationHandler);
      pusherClient.bind('conversation:remove', removeConversationHandler);
    };
  }, [conversationId, pusherKey]);

  return (
    <>
      <GroupChatModal
        users={users}
        isOpen={isGroupChatModalOpen}
        onClose={() => setIsGroupChatModalOpen(false)}
      />
      <aside
        className={clsx(
          `fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block  overflow-y-auto border-r border-gray-200`,
          isOpen ? 'hidden' : 'block w-full left-0'
        )}
      >
        <div className="px-5">
          <div className="flex justify-between mb-4 pt-4">
            <div className="text-2xl font-bold text-neutral-800">Messages </div>
            <button
              onClick={() => setIsGroupChatModalOpen(true)}
              className="rounded-full p-2 bg-gray-100 text-gray-600 cursor-pointer hover:opacity-75 transition"
            >
              <MdOutlineGroupAdd size={20} />
            </button>
          </div>
          {items?.map((item) => (
            <ConversationBox
              key={item?.id}
              conversation={item}
              isSelected={item?.id === conversationId}
            />
          ))}
        </div>
      </aside>
    </>
  );
};

export default ConversationList;
