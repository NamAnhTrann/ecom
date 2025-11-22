import { User } from './user_model';

export interface Conversation {
  _id?: string;

  participants: (string | User)[];

  last_message?: string;
  last_updatedAt?: Date;
}
