import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  error = '';
  showPassword = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    if (this.authService.isLoggedIn) this.router.navigate(['/planning']);
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.error = '';
    this.authService.login(this.form.value).subscribe({
      next: () => this.router.navigate(['/planning']),
      error: (err) => {
        this.error = err.error?.message || 'Identifiants incorrects';
        this.loading = false;
      }
    });
  }

  field(name: string) { return this.form.get(name); }
  isInvalid(name: string) { return this.field(name)?.invalid && this.field(name)?.touched; }
}
