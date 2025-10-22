import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  user_creds = {
    user_email: '',
    user_password: '',
    user_first_name: '',
    user_last_name: '',
    user_phone_number: '',
    user_role: 'buyer',
  }

  constructor(private auth: Auth, private router: Router) {}

  onRegister(){
    this.auth.register(this.user_creds).subscribe({
      next: (res:any) => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Registration failed:', err);
        alert('Registration failed. Please try again.');
      }
    });
  }

  onGoogleSignUp(){
    this.auth.loginWithGoogle();
  }

}
