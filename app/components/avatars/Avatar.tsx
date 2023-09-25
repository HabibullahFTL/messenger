import useActiveList from '@/app/hooks/useActiveList';
import { User } from '@prisma/client';
import Image from 'next/image';
import { FC } from 'react';

interface AvatarProps {
  user?: User;
}

const Avatar: FC<AvatarProps> = ({ user }) => {
  const { members } = useActiveList();
  const isActive = members.indexOf(user?.email!) !== -1;
  console.log({ members });

  return (
    <div className="relative w-9 h-9 md:h-11 md:w-11">
      <div className="relative inline-block rounded-full overflow-hidden w-full h-full border">
        <Image
          fill
          src={user?.image || '/images/placeholder.jpg'}
          alt="Avatar"
          className="object-contain"
        />
      </div>
      {isActive ? (
        <span className="absolute block rounded-full bg-green-500 ring-2 ring-white top-0 right-0 w-2 h-2 md:w-3 md:h-3" />
      ) : null}
    </div>
  );
};

export default Avatar;
