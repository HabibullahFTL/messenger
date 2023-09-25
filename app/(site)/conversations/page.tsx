'use client';
import EmptyState from '@/app/components/EmptyState';
import useConversation from '@/app/hooks/useConversation';
import clsx from 'clsx';

const ConversationsHome = () => {
  const { isOpen } = useConversation();
  return (
    <div className={clsx('lg:pl-80 h-full lg:block', isOpen)}>
      <EmptyState />
    </div>
  );
};

export default ConversationsHome;
