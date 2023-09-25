import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { FullConversationType } from '../types';

const useOtherUser = (
  conversation:
    | FullConversationType
    | {
        users: User[];
      }
) => {
  const session = useSession();

  const otherUsers = useMemo(
    () =>
      session?.data?.user?.email
        ? conversation?.users?.filter(
            (user) => user?.email !== session?.data?.user?.email
          )?.[0]
        : undefined,
    [session?.data?.user?.email, conversation?.users]
  );
  return otherUsers;
};

export default useOtherUser;
