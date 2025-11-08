import { Product } from "./product_model";
import { User } from "./user_model";

export class CartItem {
  product_id: Product;
  quantity: number;

  constructor(product_id: Product, quantity: number = 1) {
    this.product_id = product_id;
    this.quantity = quantity;
  }
}

export class Cart {
  _id?: string;
  user_id: User | string;
  items: CartItem[];
  total_price: number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(
    user_id: User | string,
    items: CartItem[] = [],
    total_price: number = 0,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.user_id = user_id;
    this.items = items;
    this.total_price = total_price;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }
}
