import { AfterViewInit, Component } from '@angular/core';
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
export class Signup implements AfterViewInit{
  user_creds = {
    user_email: '',
    user_password: '',
    user_first_name: '',
    user_last_name: '',
    user_phone_number: '',
    user_role: 'buyer',
  }

  constructor(private auth: Auth, private router: Router) {}

  ngAfterViewInit(): void {
    const words = ['and Join the Marketplace', 'and Start Selling', 'and Grow with Scrappy'];
    let i = 0;
    const el = document.getElementById('typewriter');
    const type = () => {
      if (!el) return;
      el.textContent = '';
      const word = words[i];
      [...word].forEach((char, index) => {
        setTimeout(() => (el.textContent += char), index * 60);
      });
      i = (i + 1) % words.length;
      setTimeout(type, word.length * 60 + 1200);
    };
    type();
  }
  
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
