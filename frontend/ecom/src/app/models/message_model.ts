export interface Message {
  _id?: string;

  messages_content: string;

  message_status: 'sent' | 'seen';
  message_createdAt?: Date;

  conversation_id: string;

  sender_id: string | any;
  receiver_id: string | any;

  message_type: 'text' | 'image' | 'file';
}
