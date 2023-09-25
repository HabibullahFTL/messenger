import Avatar from '@/app/components/avatars/Avatar';
import AvatarGroup from '@/app/components/avatars/AvatarGroup';
import useOtherUser from '@/app/hooks/useOtherUser';
import { FullConversationType } from '@/app/types';
import clsx from 'clsx';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FC, useCallback, useMemo } from 'react';

interface ConversationBox {
  conversation: FullConversationType;
  isSelected: boolean;
}
const ConversationBox: FC<ConversationBox> = ({ isSelected, conversation }) => {
  const router = useRouter();
  const session = useSession();
  const otherUser = useOtherUser(conversation);

  const handleClick = useCallback(() => {
    router.push(`/conversations/${conversation?.id}`);
  }, [conversation?.id, router]);

  const lastMessage = useMemo(() => {
    const messages = conversation?.messages || [];
    return messages[messages?.length - 1];
  }, [conversation?.messages]);

  const userEmail = useMemo(
    () => session?.data?.user?.email,
    [session?.data?.user?.email]
  );

  const isSeen = useMemo(() => {
    if (!userEmail) {
      return false;
    }

    if (!lastMessage) {
      return false;
    }

    const seen = lastMessage?.seen || [];

    return seen?.filter((user) => user?.email === userEmail)?.length !== 0;
  }, [lastMessage, userEmail]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return 'Sent an image';
    }

    if (lastMessage?.body) {
      return lastMessage?.body;
    }

    return 'Started a conversation';
  }, [lastMessage]);

  return (
    <div
      onClick={handleClick}
      className={clsx(
        `w-full relative flex items-center space-x-3 hover:bg-neutral-100 rounded-lg cursor-pointer transition p-3`,
        isSelected ? 'bg-neutral-100' : 'bg-white'
      )}
    >
      {conversation?.isGroup ? (
        <AvatarGroup users={conversation?.users} />
      ) : (
        <Avatar user={otherUser} />
      )}
      <div className="focus:outline-none">
        <div className="flex justify-between items-center gap-1.5 mb-1">
          <p className="font-medium text-gray-900 truncate">
            {conversation?.name || otherUser?.name || 'Conversation'}
          </p>
          {lastMessage?.createdAt && (
            <p className="text-xs text-gray-400 font-light">
              {format(new Date(lastMessage?.createdAt), 'p')}
            </p>
          )}
        </div>
        <p
          className={clsx(
            `truncate text-sm`,
            isSeen ? 'text-gray-500' : 'text-black'
          )}
        >
          {lastMessageText}
        </p>
      </div>
    </div>
  );
};

export default ConversationBox;
