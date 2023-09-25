import getConversations from '@/app/actions/getConversations';
import getUsers from '@/app/actions/getUsers';
import Sidebar from '@/app/components/Sidebar';
import { FC, ReactNode } from 'react';
import ConversationList from './components/ConversationList';

interface ConversationsLayoutProps {
  children: ReactNode;
}

const ConversationsLayout: FC<ConversationsLayoutProps> = async ({
  children,
}) => {
  const conversations = await getConversations();
  const users = await getUsers();
  return (
    <Sidebar>
      <div className="h-full">
        <ConversationList initialItems={conversations} users={users || []} />
        {children}
      </div>
    </Sidebar>
  );
};

export default ConversationsLayout;
