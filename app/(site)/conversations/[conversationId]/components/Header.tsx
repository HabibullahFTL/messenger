'use client';

import Avatar from '@/app/components/avatars/Avatar';
import AvatarGroup from '@/app/components/avatars/AvatarGroup';
import useOtherUser from '@/app/hooks/useOtherUser';
import { Conversation, User } from '@prisma/client';
import Link from 'next/link';
import { FC, useMemo, useState } from 'react';
import { HiChevronLeft, HiEllipsisHorizontal } from 'react-icons/hi2';
import ProfileDrawer from './ProfileDrawer';

interface HeaderProps {
  conversation: Conversation & {
    users: User[];
  };
}

const Header: FC<HeaderProps> = ({ conversation }) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const otherUser = useOtherUser(conversation);

  const statusText = useMemo(() => {
    if (conversation?.isGroup) {
      return `${conversation?.users?.length} members`;
    }

    return 'Active';
  }, [conversation]);
  return (
    <>
      <ProfileDrawer
        isOpen={showDrawer}
        onClose={() => setShowDrawer(false)}
        conversation={conversation}
      />
      <div className="bg-white w-full flex border-b px-4 py-3 lg:px-6 justify-between items-center shadow-md">
        <div className="flex gap-3 items-center">
          <Link
            href={'/conversations'}
            className="lg:hidden block text-sky-500 transition cursor-pointer"
          >
            <HiChevronLeft size={32} />
          </Link>
          {conversation?.isGroup ? (
            <AvatarGroup users={conversation?.users || []} />
          ) : (
            <Avatar user={otherUser} />
          )}
          <div className="flex flex-col">
            <div className="">{conversation?.name || otherUser?.name}</div>
            <div className="text-sm font-light text-neutral-500">
              {statusText}
            </div>
          </div>
        </div>
        <HiEllipsisHorizontal
          onClick={() => setShowDrawer(true)}
          size={32}
          className="text-sky-500 cursor-pointer transition hover:text-sky-600"
        />
      </div>
    </>
  );
};

export default Header;
