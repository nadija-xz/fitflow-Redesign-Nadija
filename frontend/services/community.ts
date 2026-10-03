import * as SecureStore from 'expo-secure-store';
import { apiRequest } from './api';

export type ChatMessage = { id: string; senderId: string; senderName: string; text: string; createdAt: string };
export type ChatPage = { group: { id: string; name: string }; messages: ChatMessage[]; hasMore: boolean };

async function request(path: string, text?: string) {
  const token = await SecureStore.getItemAsync('fitflow_token');
  if (!token) throw new Error('Your session has expired. Please sign in again.');
  const response = await apiRequest(path, {
    method: text === undefined ? 'GET' : 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    ...(text === undefined ? {} : { body: JSON.stringify({ text }) }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(typeof data.message === 'string' ? data.message : 'Could not connect to the community. Please try again.');
  return data;
}
export const getMessages = (before?: string): Promise<ChatPage> => request(`/community/messages${before ? `?before=${encodeURIComponent(before)}` : ''}`);
export const sendMessage = (text: string): Promise<ChatMessage> => request('/community/messages', text);
