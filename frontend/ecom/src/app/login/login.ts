import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../services/auth';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  creds = {
    user_email: '',
    user_password: '',
  };

  constructor(private auth: Auth, private router: Router) {}

  onLogin() {
    this.auth.login(this.creds).subscribe({
      next: (res: any) => {
        localStorage.setItem('user_id', res.user.id);
        const role = res.user.user_role;

        if (role === 'seller') {
          this.router.navigate(['/marketplace-page']);
        } else if (role === 'admin') {
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.router.navigate(['/marketplace-page']);
        }
      },
      error: (err) => {
        console.error('Login failed:', err);
      },
    });
  }
}
