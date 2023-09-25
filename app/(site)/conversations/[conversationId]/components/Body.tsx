'use client';
import useConversation from '@/app/hooks/useConversation';
import { pusherClient } from '@/app/libs/pusher';
import { FullMessageType } from '@/app/types';
import axios from 'axios';
import { find } from 'lodash';
import { FC, useEffect, useRef, useState } from 'react';
import ImageModal from './ImageModal';
import MessageBox from './MessageBox';

export interface ImageModalType {
  isOpen: boolean;
  image: string;
}

interface BodyProps {
  initialMessages: FullMessageType[];
}

const Body: FC<BodyProps> = ({ initialMessages }) => {
  const [messages, setMessages] = useState(initialMessages);

  // Image modal
  const [imageModal, setImageModal] = useState<ImageModalType>({
    isOpen: false,
    image: '',
  });

  const bottomRef = useRef<HTMLDivElement>(null);

  const { conversationId } = useConversation();

  useEffect(() => {
    if (conversationId) {
      axios.post(`/api/conversations/${conversationId}/seen`);
    }
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (message: FullMessageType) => {
      console.log({ message });

      axios.post(`/api/conversations/${conversationId}/seen`);

      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current;
        }

        return [...current, message];
      });

      bottomRef?.current?.scrollIntoView();
    };

    const updateMessageHandler = (newMessage: FullMessageType) => {
      console.log({ newMessage });

      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) {
            return newMessage;
          }

          return currentMessage;
        })
      );
    };

    pusherClient.bind('message:new', messageHandler);
    pusherClient.bind('message:update', updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind('message:new', messageHandler);
      pusherClient.unbind('message:update', updateMessageHandler);
    };
  }, [conversationId]);
  return (
    <>
      <ImageModal
        src={imageModal?.image}
        isOpen={imageModal?.isOpen}
        onClose={() =>
          setImageModal({
            isOpen: false,
            image: '',
          })
        }
      />
      <div className="flex-1 overflow-y-auto">
        {messages?.map((message, index) => (
          <MessageBox
            key={message?.id}
            message={message}
            isLast={index === messages?.length - 1}
            setImageModal={setImageModal}
          />
        ))}
        <div ref={bottomRef} className="pt-24" />
      </div>
    </>
  );
};

export default Body;
