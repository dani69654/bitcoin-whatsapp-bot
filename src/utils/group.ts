import { type Chat, Client } from 'whatsapp-web.js';
import { env } from '../lib/env';

export const findGroupChat = async (client: Client): Promise<Chat | undefined> => {
  const chats = await client.getChats();
  return chats.find((chat) => chat.isGroup && chat.name === env.waGroupName);
};
