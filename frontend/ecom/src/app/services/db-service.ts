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
  private localUrl = 'http://localhost:3030';

  constructor(private http: HttpClient) {}

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

  // User Auth APIs//
  registerUser(userData: any) {
    return this.http.post(`${this.localUrl}/register`, userData, httpOptions);
  }

  loginUser(credentials: any) {
    return this.http.post(`${this.localUrl}/login`, credentials, httpOptions);
  }

  logoutUser() {
    return this.http.post(`${this.localUrl}/logout`, {}, httpOptions);
  }

  refreshAccessToken() {
    return this.http.get(`${this.localUrl}/refresh`, { withCredentials: true });
  }

  //Contact Us API//
  addContact(contactData: any) {
    return this.http.post(
      `${this.localUrl}/post/contact/api`,
      contactData,
      httpOptions
    );
  }

  listAllContacts() {
    return this.http.get(`${this.localUrl}/get/all/contact/api`, httpOptions);
  }

  listSingleContact(contactId: string) {
    return this.http.get(
      `${this.localUrl}/get/single/contact/api/${contactId}`,
      httpOptions
    );
  }

  //--PRODUCT--//
  //add Product
  addProduct(product_data: any) {
    return this.http.post(
      `${this.localUrl}/post/product/api`,
      product_data,
      this.authHeader()
    );
  }

  //list all products that being to that user
  listAllProducts() {
    return this.http.get(
      `${this.localUrl}/get/all/product/api`,
      
    );
  }

  listSingleProduct(product_id: string) {
    return this.http.get(
      `${this.localUrl}/get/single/product/api/${product_id}`,
      this.authHeader()
    );
  }

  //delete single product internal api
  deleteSingleProduct(product_id: string) {
    return this.http.delete(
      `${this.localUrl}/delete/single/product/api/${product_id}`,
      this.authHeader()
    );
  }

  //update single product
  updateSingleProduct(product_id: string, product_data: any) {
    return this.http.put(
      `${this.localUrl}/update/single/product/api/${product_id}`,
      product_data,
      this.authHeader()
    );
  }

  //--MEDIA--//
  //toggleLikes
  toggleLike(productId: string) {
    return this.http.post(
      `${this.localUrl}/like/api/${productId}`,
      {},
      this.authHeader()
    );
  }

  //add comments
  addComment(product_id: string, comment_data: any) {
    return this.http.post(
      `${this.localUrl}/add/comment/api/${product_id}`,
      comment_data,
      this.authHeader()
    );
  }

  listComment(product_id: string) {
    return this.http.get(
      `${this.localUrl}/list/comments/api/${product_id}`,
      this.authHeader()
    );
  }

  //--Carts Apis--//
  addToCart(product_id: string, quantity: number) {
    return this.http.post(
      `${this.localUrl}/cart/add/api`,
      { product_id, quantity },
      this.authHeader()
    );
  }

  listCart() {
    return this.http.get(
      `${this.localUrl}/get/single/cart/api/`,
      this.authHeader()
    );
  }

  deleteCart(product_id: string) {
    return this.http.delete(
      `${this.localUrl}/delete/single/cart/item/api/${product_id}`,
      this.authHeader()
    );
  }


  createOrder() {
    return this.http.post(
      `${this.localUrl}/order/create/api`,
      {},
      this.authHeader()
    );
  }


  createCheckoutSession(order_id: string) {
  return this.http.post(
    `${this.localUrl}/order/create-checkout-session`,
    { order_id },
    this.authHeader()
  );
}

fetchingSingleOrder(){
  return this.http.get(`${this.localUrl}/list/single/order/api/`, this.authHeader())
}



}
