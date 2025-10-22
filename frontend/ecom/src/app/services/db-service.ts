import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
  providedIn: 'root'
})
export class DbService {

  private localUrl = 'http://localhost:3030';

  constructor(private http: HttpClient) {}

  registerUser(userData:any){
    return this.http.post(`${this.localUrl}/register`, userData, httpOptions);
  };

  loginUser(credentials:any){
    return this.http.post(`${this.localUrl}/login`, credentials, httpOptions);
  }

  logoutUser(){
    return this.http.post(`${this.localUrl}/logout`, {}, httpOptions);
  }

  refreshAccessToken(){
    return this.http.post(`${this.localUrl}/refresh`, {}, httpOptions);
  }

}
