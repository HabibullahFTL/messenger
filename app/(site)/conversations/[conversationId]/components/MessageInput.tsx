import { FC } from 'react';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';

interface MessageInputProps {
  id: string;
  type: string;
  placeholder?: string;
  register: UseFormRegister<FieldValues>;
  required?: boolean;
  errors: FieldErrors;
}

const MessageInput: FC<MessageInputProps> = ({
  id,
  type,
  placeholder,
  register,
  required,
  errors,
}) => {
  return (
    <div className="relative w-full">
      <input
        type={type}
        placeholder={placeholder}
        autoComplete={id}
        {...register(id, { required })}
        className="text-black font-light py-2 px-4 bg-neutral-100 w-full rounded-full focus:outline-none"
      />
    </div>
  );
};

export default MessageInput;
