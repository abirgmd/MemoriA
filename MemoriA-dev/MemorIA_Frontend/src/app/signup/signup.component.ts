import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { SignupRequest } from '../models/signup.model';
import { AuthUser } from '../auth/auth.model';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  private readonly fb = inject(FormBuilder);

  signupForm = this.fb.nonNullable.group({
    nom: ['', [Validators.required, Validators.minLength(2)]],
    prenom: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    telephone: ['', [Validators.required, Validators.minLength(8)]],
    role: ['PATIENT' as 'PATIENT' | 'SOIGNANT' | 'ACCOMPAGNANT', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload: SignupRequest = this.signupForm.getRawValue();

    this.authService.signup(payload).subscribe({
      next: (_user: AuthUser) => {
        this.isSubmitting = false;
        // After creation, the user waits for admin activation then logs in.
        this.successMessage = 'Account created. Wait for administrator confirmation before login.';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (error) => {
        const status = error?.status;
        if (status === 409) {
          this.errorMessage = 'This email is already in use.';
        } else if (status === 403) {
          this.errorMessage = 'This role is not allowed to sign up.';
        } else if (status === 400) {
          this.errorMessage = 'Check the common fields and try again.';
        } else {
          this.errorMessage = 'Unable to create account. Check server and parameters.';
        }
        this.isSubmitting = false;
      }
    });
  }

  backToHome(): void {
    this.router.navigate(['/home']);
  }
}
