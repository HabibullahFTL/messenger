import getUsers from '@/app/actions/getUsers';
import Sidebar from '@/app/components/Sidebar';
import { ReactNode } from 'react';
import UserList from './components/UserList';

const UserLayout = async ({ children }: { children: ReactNode }) => {
  const items = await getUsers();
  return (
    <Sidebar>
      <UserList items={items!} />
      <div className="h-full">{children}</div>
    </Sidebar>
  );
};

export default UserLayout;
