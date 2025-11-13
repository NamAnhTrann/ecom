import { Component } from '@angular/core';
import { DbService } from '../services/db-service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Cart, CartItem } from '../models/cart_model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart-page',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.css',
})
export class CartPage {
  constructor(private db: DbService, private router: Router) {}
  cart: Cart | null = null;
  cartItems: any[] = [];
  isLoading = false;

  ngOnInit(): void {
    this.listCart();
  }

  listCart() {
    this.db.listCart().subscribe((data: any) => {
      this.cart = data.cart;
      this.cartItems = data.cart.items;
    });
  }

  deleteCartItem(product_id: string) {
  if (!confirm('Are you sure you want to remove this item from your cart?')) return;

  this.db.deleteCart(product_id).subscribe({
    next: (res: any) => {
      Swal.fire({
                title: 'Item has been removed',
                icon: 'success',
      
                background: document.documentElement.classList.contains('dark')
                  ? '#0c0a09'
                  : '#ffffff',
      
                color: document.documentElement.classList.contains('dark')
                  ? '#f5f5f4'
                  : '#111827',
      
                iconColor: document.documentElement.classList.contains('dark')
                  ? '#FFE135'
                  : '#4F46E5',
      
                confirmButtonColor: document.documentElement.classList.contains(
                  'dark'
                )
                  ? '#FFE135'
                  : '#4F46E5',
              });
      this.listCart();
    },
    error: (err) => {
      console.error('Error deleting item:', err);
      alert(err.error?.message || 'Failed to delete item');
    },
  });
}


  proceedToCheckout() {
    if (this.isLoading){
      return;
    } 
    if (!this.cartItems || this.cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    this.isLoading = true;

    // Step 1: Create order in DB
    this.db.createOrder().subscribe({
      next: (orderRes: any) => {
        console.log('Order created:', orderRes.order);

        const orderId = orderRes.order._id;

        // Step 2: Create Stripe checkout session
        this.db.createCheckoutSession(orderId).subscribe({
          next: (sessionRes: any) => {
            this.isLoading = false;
            if (sessionRes.url) {
              window.location.href = sessionRes.url;
            } else {
              alert('No checkout URL returned.');
            }
          },
          error: (err) => {
            this.isLoading = false;
            console.error('Error creating checkout session:', err);
            alert(err.error?.message || 'Checkout session failed');
          },
        });
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error creating order:', err);
        alert(err.error?.message || 'Failed to create order');
      },
    });
  }
}
