import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true,
};

@Injectable({
  providedIn: 'root',
})
export class DbService {
  private baseUrl: string;

  constructor(private http: HttpClient) {
    const hostname = window.location.hostname;

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      this.baseUrl = 'http://localhost:3030';
    } else {
      this.baseUrl = 'http://3.25.169.180:3030';
    }

    console.log('DbService using backend:', this.baseUrl);
  }

  private authHeader() {
    const token = localStorage.getItem('access_token');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
      withCredentials: true,
    };
  }

  // USER AUTH APIs
  registerUser(userData: any) {
    return this.http.post(`${this.baseUrl}/register`, userData, httpOptions);
  }

  loginUser(credentials: any) {
    return this.http.post(`${this.baseUrl}/login`, credentials, httpOptions);
  }

  logoutUser() {
    return this.http.post(`${this.baseUrl}/logout`, {}, httpOptions);
  }

  refreshAccessToken() {
    return this.http.get(`${this.baseUrl}/refresh`, { withCredentials: true });
  }

  // CONTACT APIs
  addContact(contactData: any) {
    return this.http.post(
      `${this.baseUrl}/post/contact/api`,
      contactData,
      httpOptions
    );
  }

  listAllContacts() {
    return this.http.get(`${this.baseUrl}/get/all/contact/api`, httpOptions);
  }

  listSingleContact(contactId: string) {
    return this.http.get(
      `${this.baseUrl}/get/single/contact/api/${contactId}`,
      httpOptions
    );
  }

  // PRODUCT APIs
  addProduct(product_data: any) {
    return this.http.post(
      `${this.baseUrl}/post/product/api`,
      product_data,
      this.authHeader()
    );
  }

  listAllProducts() {
    return this.http.get(`${this.baseUrl}/get/all/product/api`);
  }

  listSingleProduct(product_id: string) {
    return this.http.get(
      `${this.baseUrl}/get/single/product/api/${product_id}`,
      this.authHeader()
    );
  }

  deleteSingleProduct(product_id: string) {
    return this.http.delete(
      `${this.baseUrl}/delete/single/product/api/${product_id}`,
      this.authHeader()
    );
  }

  updateSingleProduct(product_id: string, product_data: any) {
    return this.http.put(
      `${this.baseUrl}/update/single/product/api/${product_id}`,
      product_data,
      this.authHeader()
    );
  }

  // MEDIA APIs
  toggleLike(productId: string) {
    return this.http.post(
      `${this.baseUrl}/like/api/${productId}`,
      {},
      this.authHeader()
    );
  }

  addComment(product_id: string, comment_data: any) {
    return this.http.post(
      `${this.baseUrl}/add/comment/api/${product_id}`,
      comment_data,
      this.authHeader()
    );
  }

  listComment(product_id: string) {
    return this.http.get(
      `${this.baseUrl}/list/comments/api/${product_id}`,
      this.authHeader()
    );
  }

  // CART APIs
  addToCart(product_id: string, quantity: number) {
    return this.http.post(
      `${this.baseUrl}/cart/add/api`,
      { product_id, quantity },
      this.authHeader()
    );
  }

  listCart() {
    return this.http.get(
      `${this.baseUrl}/get/single/cart/api/`,
      this.authHeader()
    );
  }

  deleteCart(product_id: string) {
    return this.http.delete(
      `${this.baseUrl}/delete/single/cart/item/api/${product_id}`,
      this.authHeader()
    );
  }

  createOrder() {
    return this.http.post(
      `${this.baseUrl}/order/create/api`,
      {},
      this.authHeader()
    );
  }

  createCheckoutSession(order_id: string) {
    return this.http.post(
      `${this.baseUrl}/order/create-checkout-session`,
      { order_id },
      this.authHeader()
    );
  }

  fetchingSingleOrder() {
    return this.http.get(
      `${this.baseUrl}/list/single/order/api/`,
      this.authHeader()
    );
  }

  // RESET PASSWORD
  requestResetPassword(email: string) {
    return this.http.post(`${this.baseUrl}/send/reset/password/api`, {
      email,
    });
  }

  verifyToken(token: string) {
    return this.http.get(`${this.baseUrl}/reset/password/verify/${token}`);
  }

  resetPassword(token: string, newPassword: string) {
    return this.http.post(`${this.baseUrl}/reset/password/${token}`, {
      newPassword,
    });
  }
}
