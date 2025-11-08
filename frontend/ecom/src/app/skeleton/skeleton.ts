import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  imports: [CommonModule],
  templateUrl: './skeleton.html',
  styleUrl: './skeleton.css'
})
export class Skeleton {
 @Input() width = '100%';
  @Input() height = '1rem';
  @Input() rounded = '0.375rem'; // Tailwind's rounded-md
}
