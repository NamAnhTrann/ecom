import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Header } from "./header/header";
import { Footer } from "./footer/footer";

import 'preline/dist/preline';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ecom');

  constructor(private router:Router){

  }
  hideHeader(): boolean {
    const hiddenRoutes = ['/seller-dashboard'];
    return hiddenRoutes.includes(this.router.url);
  }


}
