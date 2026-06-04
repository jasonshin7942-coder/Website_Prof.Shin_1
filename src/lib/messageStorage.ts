import { db } from './supabase';
import type { ContactMessage } from '@/types/content';

function toMessage(row: any): ContactMessage {
  return {
    id: row.id,
    read: row.read,
    createdAt: row.created_at,
    ...row.data,
  };
}

export async function getMessages(): Promise<ContactMessage[]> {
  const { data, error } = await db
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error('Failed to load messages');
  return (data ?? []).map(toMessage);
}

export async function createMessage(
  input: Omit<ContactMessage, 'id' | 'read' | 'createdAt'>
): Promise<ContactMessage> {
  const id = `msg-${Date.now()}`;
  const row = { id, read: false, data: input };
  const { error } = await db.from('messages').insert(row);
  if (error) throw new Error('Failed to save message');
  return { id, read: false, createdAt: new Date().toISOString(), ...input };
}

export async function markAsRead(id: string): Promise<boolean> {
  const { error } = await db.from('messages').update({ read: true }).eq('id', id);
  return !error;
}

export async function deleteMessage(id: string): Promise<boolean> {
  const { error } = await db.from('messages').delete().eq('id', id);
  return !error;
}

export async function getUnreadCount(): Promise<number> {
  const { count } = await db
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .eq('read', false);
  return count ?? 0;
}
