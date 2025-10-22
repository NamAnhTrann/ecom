import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
 scrolled = false;
  mobileOpen= false;

  constructor(private router: Router) {}

  signUpButton() {
    this.router.navigate(['/signup']);
  }

  loginButton() {
    this.router.navigate(['/login']);
  }

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled = window.scrollY > 20;
  }

toggleMobile() {
  this.mobileOpen = !this.mobileOpen;
  if (typeof document !== 'undefined') {
    document.body.classList.toggle('overflow-hidden', this.mobileOpen);
  }
}

closeMobile() {
  this.mobileOpen = false;
  if (typeof document !== 'undefined') {
    document.body.classList.remove('overflow-hidden');
  }
}

}



