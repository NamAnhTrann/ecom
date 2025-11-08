import { Component } from '@angular/core';
import { Order } from '../models/order_model';
import { DbService } from '../services/db-service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../models/user_model';

@Component({
  selector: 'app-order-summary-page',
  imports: [RouterLink, CommonModule],
  templateUrl: './order-summary-page.html',
  styleUrl: './order-summary-page.css',
})
export class OrderSummaryPage {
  order: Order | null = null;
  orderItems: any[] = [];
  sessionId: string | null = null;

  constructor(
    private db: DbService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.sessionId = this.route.snapshot.queryParamMap.get('session_id');
    //list order and order items
    this.listOrder();
  }

  listOrder() {
    this.db.fetchingSingleOrder().subscribe((data: any) => {
      this.order = data.order;
      this.orderItems = data.order.order_items;
    });
  }
  get userName(): string {
    if (!this.order) {
      return '';
    }
    const user = this.order.user_id as User;
    return user.user_first_name || 'Valued Customer';
  }
}
