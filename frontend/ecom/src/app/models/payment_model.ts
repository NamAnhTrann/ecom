import { User } from "./user_model";
import { Order } from "./order_model";

export class Payment {
  _id?: string;
  order_id: Order | string;
  user_id: User | string;
  amount: number;
  payment_status: "pending" | "completed" | "failed";
  transaction_id?: string;
  createdAt?: Date;

  constructor(
    order_id: Order | string,
    user_id: User | string,
    amount: number,
    payment_status: "pending" | "completed" | "failed" = "pending",
    transaction_id?: string,
    createdAt?: Date
  ) {
    this.order_id = order_id;
    this.user_id = user_id;
    this.amount = amount;
    this.payment_status = payment_status;
    this.transaction_id = transaction_id;
    this.createdAt = createdAt || new Date();
  }
}
