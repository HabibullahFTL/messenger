import clsx from 'clsx';
import Link from 'next/link';
import { FC } from 'react';
import { IconType } from 'react-icons';

interface MobileItemProps {
  label: string;
  href: string;
  icon: IconType;
  active?: boolean;
  onClick?: () => void;
}

const MobileItem: FC<MobileItemProps> = ({
  label,
  href,
  icon: Icon,
  active,
  onClick,
}) => {
  const handleClick = () => {
    if (typeof onClick === 'function') {
      onClick();
    }
  };
  return (
    <Link
      href={href}
      onClick={handleClick}
      className={clsx(
        `group flex gap-x-3 leading-6 font-semibold w-full justify-center p-4 text-gray-500 hover:text-black hover:bg-gray-100`
      )}
    >
      <Icon />
    </Link>
  );
};

export default MobileItem;
