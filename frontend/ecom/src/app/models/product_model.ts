import { User } from './user_model';
import { Like } from './like_model';
import { Comment } from './comment_model';

export class Product {
  _id: string;
  product_title: string;
  product_price: number;
  product_desc: string;
  product_quantity: number;
  product_img?: string;
  productUpdated?: Date;
  user_id?: User;
  likes?: Like[];
  likes_count?: number = 0;
  liked?: boolean = false;
  comments?: Comment[];
  comments_count?: number;

  constructor(
    product_title: string = '',
    product_price: number = 0,
    product_desc: string = '',
    product_quantity: number = 1,
    product_img: string = '',
    user_id?: User,
    likes: Like[] = [],
    likes_count: number = 0,
    liked: boolean = false,
    comments: Comment[] = [],
    comments_count: number = 0
  ) {
    this._id = '';
    this.product_title = product_title;
    this.product_price = product_price;
    this.product_desc = product_desc;
    this.product_quantity = product_quantity;
    this.product_img = product_img;
    this.productUpdated = new Date();
    this.user_id = user_id;
    this.likes = likes;
    this.likes_count = likes_count;
    this.liked = liked;
    this.comments = comments;
    this.comments_count = comments_count;
  }
}
