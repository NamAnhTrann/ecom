import { Injectable, signal } from '@angular/core';
import { DbService } from './db-service';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'http://localhost:3030';
  isLoggedIn = signal<boolean>(!!localStorage.getItem('access_token'));
  userRole = signal<string | null>(localStorage.getItem('user_role'));

  constructor(private db: DbService, private router: Router) {
    const token = localStorage.getItem('access_token');
    if (!token) {
      this.isLoggedIn.set(false);
      this.userRole.set(null);
    }
     window.addEventListener('storage', () => {
      this.userRole.set(localStorage.getItem('user_role'));
    });
    console.log('AuthService initialized — userRole:', this.userRole());

  }

  setUserRole(role: string) {
    localStorage.setItem('user_role', role);
    this.userRole.set(role);
  }

  register(userData: any) {
    return this.db.registerUser(userData);
  }

  loginWithGoogle(): void {
    window.location.href = `${this.apiUrl}/auth/google`;
  }
  //1. call backend to login
  //2. store the token in localStorage
  //3. update the signals
  login(credentials: any) {
    return this.db.loginUser(credentials).pipe(
      tap((res: any) => {
        localStorage.setItem('access_token', res.accessTokens);
        localStorage.setItem('user_role', res.user.user_role);
        this.isLoggedIn.set(true);
        this.userRole.set(res.user.user_role);
      })
    );
  }

  //1. logout user
  //2. calls the backend to clear cookie
  //3. removes token from localStorage
  //4. navigate to homepage
  logout() {
    this.db.logoutUser().subscribe(() => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_role');
      this.isLoggedIn.set(false);
      this.userRole.set(null);
      this.router.navigate(['/']);
    });
  }

  //return the current jwt from localStrorage
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  //return true if the user has a token
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  //return the user role
  getUserRole(): string | null {
    return localStorage.getItem('user_role');
  }
}
