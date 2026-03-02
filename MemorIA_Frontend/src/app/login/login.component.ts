import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (user) => {
        this.isLoading = false;
        if (user.role === 'DOCTOR') {
          this.router.navigate(['/dashboard_diagnostic']);
        } else if (user.role === 'PATIENT') {
          this.router.navigate(['/diagnostic']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Invalid email or password.';
      }
    });
  }
}
