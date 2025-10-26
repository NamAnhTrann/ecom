import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Product } from '../models/product_model';
import { DbService } from '../services/db-service';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import { register } from 'swiper/element/bundle';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

register(); 

@Component({
  selector: 'app-marketplace',
  imports: [RouterLink, CommonModule],
  templateUrl: './marketplace.html',
  styleUrl: './marketplace.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
})
export class Marketplace {
  products: Product[] = [];
  groupedProducts: any[] = [];

  constructor(private db: DbService, private router: Router) {}

  ngOnInit() {
    this.listAllProduct();
  }

  listAllProduct() {
    this.db.listAllProducts().subscribe((data: any) => {
      this.products = data;

      const grouped = this.products.reduce((acc: any, product: any) => {
        const sellerId = product.user_id?._id;
        if (!sellerId) return acc;

        if (!acc[sellerId]) {
          acc[sellerId] = {
            user_first_name: product.user_id.user_first_name,
            user_last_name: product.user_id.user_last_name,
            user_email: product.user_id.user_email,
            user_profile_img: product.user_id.user_profile_img,
            products: [],
          };
        }

        acc[sellerId].products.push(product);
        return acc;
      }, {});

      this.groupedProducts = Object.values(grouped);
    });
  }
}
