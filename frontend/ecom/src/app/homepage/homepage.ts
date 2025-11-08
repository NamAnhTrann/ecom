import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Skeleton } from "../skeleton/skeleton";

@Component({
  selector: 'app-homepage',
  imports: [Skeleton],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css'
})
export class Homepage {
  loading = true;

ngOnInit(): void {
  setTimeout(() => {
    this.loading = false;
  }, 800);
}

}
