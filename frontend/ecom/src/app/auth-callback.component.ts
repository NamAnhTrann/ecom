import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from './services/auth';

@Component({
  selector: 'app-auth-callback',
  standalone: true, 
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.css'] 
})
export class AuthCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: Auth
  ) {
      console.log(' AuthCallbackComponent constructed');

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['access_token'];
      const role  = params['user_role'];

      console.log(' Google OAuth callback params:', { token, role });

      if (token && role) {
        // Save token + role
        localStorage.setItem('access_token', token);
        localStorage.setItem('user_role', role);

        // Log before updating signal
        console.log('Before set → userRole():', this.auth.userRole());

        // Update signals immediately
        this.auth.isLoggedIn.set(true);
        this.auth.userRole.set(role);

        // Log after updating signal
        console.log('After set → userRole():', this.auth.userRole());

        // Navigate based on role
        if (role === 'seller') {
          this.router.navigate(['/seller-dashboard']);
        } else {
          this.router.navigate(['/']);
        }
      } else {
        this.router.navigate(['/']);
      }
    });
  }
}
