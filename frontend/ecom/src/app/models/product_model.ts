import { User } from './user_model';

export class Product {
  _id?: string;
  product_title: string;
  product_price: number;
  product_desc: string;
  product_quantity: number;
  product_img?: string;
  productUpdated?: Date;
  user_id?: User; 

  constructor(
    product_title: string = '',
    product_price: number = 0,
    product_desc: string = '',
    product_quantity: number = 1,
    product_img: string = '',
    user_id?: User
  ) {
    this._id = undefined;
    this.product_title = product_title;
    this.product_price = product_price;
    this.product_desc = product_desc;
    this.product_quantity = product_quantity;
    this.product_img = product_img;
    this.productUpdated = new Date();
    this.user_id = user_id;
  }
}
