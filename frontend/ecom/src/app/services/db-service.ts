import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})
export class DbService {

  private localUrl = 'http://localhost:3030';

  constructor(private http: HttpClient) {}

  private authHeader(){
    const token = localStorage.getItem('access_token');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
      withCredentials: true,
    }
  }

// User Auth APIs//
  registerUser(userData:any){
    return this.http.post(`${this.localUrl}/register`, userData, httpOptions);
  };

  loginUser(credentials:any){
    return this.http.post(`${this.localUrl}/login`, credentials, httpOptions);
  }

  logoutUser(){
    return this.http.post(`${this.localUrl}/logout`, {}, httpOptions);
  }

  refreshAccessToken() {
    return this.http.get(`${this.localUrl}/refresh`, { withCredentials: true });
  }

  //Contact Us API//
  addContact(contactData:any){
    return this.http.post(`${this.localUrl}/post/contact/api`, contactData, httpOptions);
  }

  listAllContacts(){
    return this.http.get(`${this.localUrl}/get/all/contact/api`, httpOptions);
  }

  listSingleContact(contactId: string){
    return this.http.get(`${this.localUrl}/get/single/contact/api/${contactId}`, httpOptions);
  }

  //add Product
  addProduct(product_data:any){
    return this.http.post(`${this.localUrl}/post/product/api`, product_data, this.authHeader())
  }

  //list all products that being to that user
  listAllProducts(){
    return this.http.get(`${this.localUrl}/get/all/product/api`, this.authHeader())
  }

  //--MEDIA--//

  //toggleLikes
  toggleLike(productId: string){
    return this.http.post(`${this.localUrl}/like/api/${productId}`, this.authHeader, {})

  }



}
