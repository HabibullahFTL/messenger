import Avatar from '@/app/components/avatars/Avatar';
import { FullMessageType } from '@/app/types';
import clsx from 'clsx';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Dispatch, FC, SetStateAction } from 'react';
import { ImageModalType } from './Body';

interface MessageBoxProps {
  isLast: boolean;
  message: FullMessageType;
  setImageModal: Dispatch<SetStateAction<ImageModalType>>;
}

const MessageBox: FC<MessageBoxProps> = ({
  isLast,
  message,
  setImageModal,
}) => {
  const session = useSession();

  const isOwn = message?.sender?.email === session?.data?.user?.email;
  const seenList = (message?.seen || [])
    ?.filter((user) => user?.email !== session?.data?.user?.email)
    ?.map((user) => user?.name)
    ?.join(', ');

  const containerClass = clsx('flex gap-3 p-4', isOwn && 'justify-end');
  const avatarClass = clsx(isOwn && 'order-2');
  const bodyClass = clsx('flex flex-col gap-2', isOwn && 'items-end');
  const messageClass = clsx(
    'text-sm w-fit overflow-hidden',
    isOwn ? 'bg-sky-500 text-white' : 'bg-gray-100',
    message?.image ? 'rounded-md p-0' : 'rounded-2xl py-2 px-3'
  );
  return (
    <div className={containerClass}>
      <div className={avatarClass}>
        <Avatar user={message?.sender} />
      </div>
      <div className={bodyClass}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">{message?.sender?.name}</div>
          {message?.createdAt ? (
            <div className="text-xs text-gray-400">
              {format(new Date(message?.createdAt), 'p')}
            </div>
          ) : null}
        </div>
        <div className={messageClass}>
          {message?.image ? (
            <Image
              onClick={() =>
                setImageModal({
                  isOpen: true,
                  image: message?.image || '',
                })
              }
              src={message?.image}
              alt="Image"
              height={'288'}
              width={'288'}
              className="object-cover cursor-pointer hover:scale-110 transition translate"
            />
          ) : (
            <div className="">{message?.body}</div>
          )}
        </div>
        {isLast && isOwn && seenList?.length > 0 ? (
          <div className="text-xs font-light text-gray-500">{`Seen by ${seenList}`}</div>
        ) : null}
      </div>
    </div>
  );
};

export default MessageBox;
