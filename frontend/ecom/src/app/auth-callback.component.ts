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
    const userRaw = params['user']; // backend sends this encoded

    console.log('Google OAuth callback params:', { token, role, userRaw });

    if (token && role && userRaw) {

  const user = JSON.parse(userRaw);

  localStorage.setItem('access_token', token);
  localStorage.setItem('user_role', role);
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('user_id', user._id);  

  this.auth.isLoggedIn.set(true);
  this.auth.userRole.set(role);

  if (role === 'seller') {
    this.router.navigate(['/seller-dashboard']);
  } else {
    this.router.navigate(['/marketplace-page']);
  }
}
  });
}
}
