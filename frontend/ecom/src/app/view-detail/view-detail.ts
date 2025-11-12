import { Component } from '@angular/core';
import { Product } from '../models/product_model';
import { DbService } from '../services/db-service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Cart } from '../models/cart_model';

@Component({
  selector: 'app-view-detail',
  imports: [RouterLink],
  templateUrl: './view-detail.html',
  styleUrl: './view-detail.css',
})
export class ViewDetail {
  product?: Product;
  cart: Cart | null = null;
  cartItems: any[] = [];
  quantity: number = 1;
  //add to cart later

  ngOnInit(): void {
    //TODO list product
    this.listSingleProduct();
  }

  constructor(
    private db: DbService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  listSingleProduct() {
    const product_id = this.route.snapshot.paramMap.get('id');
    if (!product_id) {
      return;
    }

    this.db.listSingleProduct(product_id).subscribe({
      next: (data: any) => (this.product = data),
      error: (err) => console.error('Error loading product:', err),
    });
  }

  addToCart(product_id: string) {
    if (!product_id) {
      alert('No product found');
      return;
    }
    this.db.addToCart(product_id, this.quantity).subscribe({
      next: (res: any) => {
        alert('product has been added to cart');
      },
      error: (err) => {
        alert(`error occured ${err}`);
      },
    });
  }


}

