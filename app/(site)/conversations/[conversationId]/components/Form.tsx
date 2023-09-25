'use client';
import useConversation from '@/app/hooks/useConversation';
import axios from 'axios';
import { CldUploadButton } from 'next-cloudinary';
import { FieldValues, useForm } from 'react-hook-form';
import { HiPaperAirplane, HiPhoto } from 'react-icons/hi2';
import MessageInput from './MessageInput';

const Form = () => {
  const { conversationId } = useConversation();

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: '',
    },
  });

  const onSubmit = (data: FieldValues) => {
    axios.post('/api/messages', { ...data, conversationId }).then(() => {});
    setValue('message', '', { shouldValidate: true });
  };

  const handleUploadPhoto = (result: any, widget: any) => {
    console.log({ widget });

    axios.post('/api/messages', {
      image: result?.info?.secure_url,
      conversationId,
    });
  };
  return (
    <div className="p-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full">
      <CldUploadButton
        options={{
          maxFiles: 1,
        }}
        uploadPreset="ofrhudhz"
        onUpload={handleUploadPhoto}
      >
        <HiPhoto size={30} className={'text-sky-500'} />
      </CldUploadButton>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 lg:gap-4 w-full"
      >
        <MessageInput
          id="message"
          type="text"
          register={register}
          errors={errors}
          required
          placeholder="Write message here..."
        />
        <button
          type="submit"
          className="rounded-full p-2 bg-sky-500 hover:bg-sky-600 cursor-pointer transition"
        >
          <HiPaperAirplane size={18} className={'text-white'} />
        </button>
      </form>
    </div>
  );
};

export default Form;
