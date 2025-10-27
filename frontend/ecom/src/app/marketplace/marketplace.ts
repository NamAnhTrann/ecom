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
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './marketplace.html',
  styleUrl: './marketplace.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Marketplace {
  products: Product[] = [];
  groupedProducts: any[] = [];
  comments: Comment[] = [];
  new_comment: string = '';

  constructor(private db: DbService, private router: Router) {}

  ngOnInit() {
    //dont call lis comment here due to dual API calls --> bad performance
    this.listAllProduct();
  }

  listAllProduct() {
    this.db.listAllProducts().subscribe((data: any) => {
      console.log('API Response:', data);
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

  toggleLike(product: any) {
    this.db.toggleLike(product._id).subscribe({
      next: (res: any) => {
        console.log(res.message);

        if (res.liked) {
          product.liked = true;
          product.likes_count = (product.likes_count || 0) + 1;
        } else {
          product.liked = false;
          product.likes_count = Math.max(0, (product.likes_count || 0) - 1);
        }
      },
      error: (err) => {
        console.error('Like toggle failed:', err);
      },
    });
  }

  listComments(product: any) {
    this.db.listComment(product._id).subscribe({
      next: (res: any) => {
        product.comments = res.comments;
      },
      error: (err) => {
        console.error('failed to load comments', err);
      },
    });
  }

  addComment(product: any) {
    this.db.addComment(product._id, {text:this.new_comment}).subscribe({
      next: (res: any) => {
        this.comments.unshift(res.comment);
        this.new_comment = '';
      },
      error: (err) => {
        console.error('failed to post comment', err);
      },
    });
  }
}
