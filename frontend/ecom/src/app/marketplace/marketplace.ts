import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Product } from '../models/product_model';
import { DbService } from '../services/db-service';
import 'swiper/css/bundle';
import { register } from 'swiper/element/bundle';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Cart } from '../models/cart_model';
import { Skeleton } from '../skeleton/skeleton';

register();

@Component({
  selector: 'app-marketplace',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './marketplace.html',
  styleUrl: './marketplace.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Marketplace {
  products: Product[] = [];
  groupedProducts: any[] = [];
  comments: Comment[] = [];
  new_comment: string = '';
  loading = true;

  //carts
  cart: Cart | null = null;
  cartItems: any[] = [];
  quantity: number = 1;

  constructor(private db: DbService, private router: Router) {}

  ngOnInit() {
    //dont call lis comment here due to dual API calls --> bad performance
    this.listAllProduct();
  }

  addToCart(product_id: string) {
    this.db.addToCart(product_id, this.quantity).subscribe({
      next: (res: any) => {
        console.log('Added:', res.message);
        alert('Product added to cart successfully!');
      },
      error: (err) => {
        console.error('Add to cart error:', err);
        alert('FAILED');
      },
    });
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

  toggleLike(product: any) {
    this.db.toggleLike(product._id).subscribe({
      next: (res: any) => {
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
    const commentText = product.new_comment?.trim();
    // prevent posting empty or blank comments
    this.db.addComment(product._id, { text: commentText }).subscribe({
      next: (res: any) => {
        const comment = res?.comment || res;
        if (comment) {
          product.comments.unshift(comment);
          //update count locally for instant change
          product.comments_count = product.comments_count + 1;
        }
        // clear only this product’s input
        product.new_comment = '';
      },
      error: (err) => {
        console.error('[addComment] Failed to post comment:', err);
      },
    });
  }

  toggleComments(product: any) {
    product.showComments = !product.showComments;

    if (product.showComments && !product.comments) {
      this.db.listComment(product._id).subscribe({
        next: (res: any) => {
          product.comments = res.comments || [];
        },
        error: (err) =>
          console.error('[toggleComments] Failed to load comments:', err),
      });
    }
  }
}
