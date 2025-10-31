import { Component } from '@angular/core';
import { DbService } from '../services/db-service';
import { Router } from '@angular/router';
import { Product } from '../models/product_model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-seller-dashboard',
  imports: [FormsModule],
  templateUrl: './seller-dashboard.html',
  styleUrl: './seller-dashboard.css',
})
export class SellerDashboard {
  Product: Product[] = [];
  product_data: Product = new Product();

  constructor(private db: DbService, private router: Router) {}

  ngOnInit(): void {
    //call analytics here TBD
  }

  addProduct() {
    this.db.addProduct(this.product_data).subscribe({
      next: (res: any) => {
        this.product_data = new Product();
        alert('product has been added');
      },
    });
  }

  deleteSingleProduct(product_id: string) {
    this.db.deleteSingleProduct(product_id).subscribe({
      next: (res: any) => {
        console.log(res);
      },
      error: (err) => {
        console.error(`delete error: ${err}`);
      },
    });
  }

  updateSingleProduct(product_id: string, product_data: any) {
    this.db.updateSingleProduct(product_id, this.product_data).subscribe({
      next: (res: any) => {
        console.log(res);
      },
      error: (err) => {
        console.error(`update product error: ${err}`);
      },
    });
  }


}
