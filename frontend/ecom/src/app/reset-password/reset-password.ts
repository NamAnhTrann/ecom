import { Component, OnInit } from '@angular/core';
import { DbService } from '../services/db-service';
import { Auth } from '../services/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword implements OnInit {
  token!: string;
  newPassword = '';
  tokenValid = false;
  message = '';

  constructor(
    private db: DbService,
     private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token')!;
    this.verifyToken();
  }

  verifyToken(): void {
    this.db.verifyToken(this.token).subscribe({
      next: (res: any) => {
        this.tokenValid = true;
        this.message = res.message || 'Token valid.';
      },
      error: () => {
        this.tokenValid = false;
        this.message = 'Invalid or expired reset link.';
      },
    });
  }

  onSubmit(): void {
    if (!this.newPassword.trim()) return;

    this.db.resetPassword(this.token, this.newPassword).subscribe({
      next: () => {
        alert('Password reset successfully!');
        this.router.navigate(['/login']);
      },
      error: () => {
        alert('Error resetting password. Please try again.');
      },
    });
  }
}
