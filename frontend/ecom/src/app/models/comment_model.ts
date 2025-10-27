import { User } from './user_model';
import { Product } from './product_model';

export class Comment {
  _id?: string;
  text: string;
  user_id: User;       
  product_id: Product; 
  createdAt?: Date;    

  constructor(text: string, user_id: User, product_id: Product, createdAt?: Date) {
    this.text = text;
    this.user_id = user_id;
    this.product_id = product_id;
    this.createdAt = createdAt || new Date();
  }
}
