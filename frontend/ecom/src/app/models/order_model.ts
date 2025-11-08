  import { User } from "./user_model";
  import { Cart } from "./cart_model";
  import { Product } from "./product_model";
  import { Payment } from "./payment_model";

  export class OrderItem {
    product_id: Product;
    quantity: number;
    price_at_purchase: number;

    constructor(product_id: Product, quantity: number, price_at_purchase: number) {
      this.product_id = product_id;
      this.quantity = quantity;
      this.price_at_purchase = price_at_purchase;
    }
  }

  export class Order {
    _id?: string;
    user_id: User | string;
    cart_id: Cart | string;
    order_items: OrderItem[];
    total_amount: number;
    order_status: "pending" | "paid" | "cancelled";
    payment_id?: Payment | string;
    createdAt?: Date;

    constructor(
      user_id: User | string,
      cart_id: Cart | string,
      order_items: OrderItem[] = [],
      total_amount: number = 0,
      order_status: "pending" | "paid" | "cancelled" = "pending",
      payment_id?: Payment | string,
      createdAt?: Date
    ) {
      this.user_id = user_id;
      this.cart_id = cart_id;
      this.order_items = order_items;
      this.total_amount = total_amount;
      this.order_status = order_status;
      this.payment_id = payment_id;
      this.createdAt = createdAt || new Date();
    }
  }
