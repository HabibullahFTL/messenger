import { Conversation, Message, User } from '@prisma/client';

export type FullMessageType = Message & {
  seen: User[];
  sender: User;
};

export type FullConversationType = Conversation & {
  messages: FullMessageType[];
  users: User[];
};
