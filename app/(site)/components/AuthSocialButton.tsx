import clsx from 'clsx';
import { IconType } from 'react-icons';

interface IProps {
  Icon: IconType;
  onClick: () => void;
}

const AuthSocialButton = ({ Icon, onClick }: IProps) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={clsx(
        `inline-flex w-full justify-center rounded-md px-4 py-2 bg-white text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-500 focus:outline-offset-0 hover:text-white`
      )}
    >
      <Icon />
    </button>
  );
};

export default AuthSocialButton;
