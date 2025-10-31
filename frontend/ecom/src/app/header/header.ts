import { CommonModule } from '@angular/common';
import { Component, effect, HostListener } from '@angular/core';
import { Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  scrolled = false;
  mobileOpen = false;
  isLoggedIn: any;
  userRole: any;

  constructor(private router: Router, public auth: Auth) {
    this.isLoggedIn = this.auth.isLoggedIn;
    this.userRole = this.auth.userRole;

    // debug listener for auth changes willl remove after this is done
    effect(() => {
      console.log('Auth changed:', this.isLoggedIn(), this.userRole());
    });

    // Reinitialize Preline dropdowns after every route change
    //preline stuff that i have no idea about (chatgpt)
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        setTimeout(() => {
          // Reset mobile state
          this.mobileOpen = false;
          document.body.classList.remove('overflow-hidden');

          // Reinitialize Preline components
          if ((window as any).HSStaticMethods) {
            (window as any).HSStaticMethods.autoInit();
          }
        }, 50);
      });
  }

  signUpButton() {
    this.router.navigate(['/signup']);
  }

  loginButton() {
    this.router.navigate(['/login']);
  }

  logoutButton() {
    this.auth.logout();
  }

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled = window.scrollY > 20;
  }

  toggleMobile() {
    this.mobileOpen = !this.mobileOpen;
    document.body.classList.toggle('overflow-hidden', this.mobileOpen);
  }

  closeMobile() {
    this.mobileOpen = false;
    document.body.classList.remove('overflow-hidden');
  }
}
