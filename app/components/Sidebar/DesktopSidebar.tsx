'use client';
import useRoutes from '@/app/hooks/useRoutes';
import { User } from '@prisma/client';
import { FC, useState } from 'react';
import Avatar from '../avatars/Avatar';
import DesktopItem from './DesktopItem';
import SettingsModal from './SettingsModal';

interface DesktopSidebarProps {
  currentUser: User;
}

const DesktopSidebar: FC<DesktopSidebarProps> = ({ currentUser }) => {
  const routes = useRoutes();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <SettingsModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        currentUser={currentUser}
      />
      <div className="hidden lg:fixed  lg:inset-y-0 lg:z-40 lg:w-20 lg:left-0 lg:px-6 lg:overflow-y-auto lg:bg-white lg:border-r lg:pb-4 lg:flex lg:flex-col justify-between">
        <nav className="pt-4 flex flex-col justify-between">
          <ul role="list" className="flex flex-col items-center space-y-1">
            {routes?.map((item) => (
              <DesktopItem
                key={item?.label}
                label={item?.label}
                href={item?.href}
                icon={item?.icon}
                active={item?.active}
                onClick={item?.onClick}
              />
            ))}
          </ul>
        </nav>
        <nav className="mt-4 flex flex-col justify-between items-center">
          <div
            onClick={() => setIsOpen(true)}
            className="cursor-pointer hover:opacity-75 transition"
          >
            <Avatar user={currentUser} />
          </div>
        </nav>
      </div>
    </>
  );
};

export default DesktopSidebar;
