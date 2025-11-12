// forget-password.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DbService } from '../services/db-service';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.css',
})
export class ForgetPassword {
  email = '';
  message = '';
  isLoading = false;

  constructor(private db: DbService) {}

  onSubmit(): void {
    if (!this.email.trim()) return;

    this.isLoading = true;
    this.message = '';

    this.db.requestResetPassword(this.email).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.message = res.message || 'Check your email for a reset link.';
      },
      error: (err) => {
        this.isLoading = false;
        this.message = err.error?.message || 'Error sending reset email.';
      },
    });
  }
}
