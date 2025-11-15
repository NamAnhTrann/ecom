import { Injectable, signal } from '@angular/core';
import { DbService } from './db-service';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl: string;

  isLoggedIn = signal<boolean>(!!localStorage.getItem('access_token'));
  userRole = signal<string | null>(localStorage.getItem('user_role'));

  constructor(private db: DbService, private router: Router) {
    
    // Auto-select backend based on environment
    const hostname = window.location.hostname;

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      // Local development
      this.apiUrl = 'http://localhost:3030';
    } else {
      // Production (EC2)
      this.apiUrl = 'http://3.25.169.180:3030';
    }

    console.log('API URL in use:', this.apiUrl);

    // existing logic
    const token = localStorage.getItem('access_token');
    if (!token) {
      this.isLoggedIn.set(false);
      this.userRole.set(null);
    }

    window.addEventListener('storage', () => {
      this.userRole.set(localStorage.getItem('user_role'));
    });

    this.logActiveUserFromToken();
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

  logout() {
    this.db.logoutUser().subscribe({
      next: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_role');
        document.cookie = 'refreshTokens=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        this.isLoggedIn.set(false);
        this.userRole.set(null);
        this.router.navigate(['/']);
      },
      error: () => {
        localStorage.clear();
        document.cookie = 'refreshTokens=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        this.router.navigate(['/']);
      }
    });
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getUserRole(): string | null {
    return localStorage.getItem('user_role');
  }

  private logActiveUserFromToken() {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Active user (from JWT):', payload);
    } catch (e) {
      console.log('Failed to decode JWT:', e);
    }
  }
}
