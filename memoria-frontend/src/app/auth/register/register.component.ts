import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  form: FormGroup;
  loading = false;
  error = '';
  showPassword = false;
  showConfirm = false;

  roles = [
    { value: 'soignant', label: 'Soignant (médecin, infirmier...)' },
    { value: 'accompagnant', label: 'Accompagnant (aidant, famille...)' },
    { value: 'patient', label: 'Patient' }
  ];

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.pattern(/^[0-9+\s\-().]{8,20}$/)]],
      role: ['soignant', Validators.required]
    }, { validators: this.passwordsMatch });
  }

  passwordsMatch(group: AbstractControl) {
    const pwd = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pwd === confirm ? null : { passwordMismatch: true };
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.error = '';
    const { confirmPassword, ...data } = this.form.value;
    this.authService.register(data).subscribe({
      next: () => this.router.navigate(['/planning']),
      error: (err) => {
        this.error = err.error?.message || 'Erreur lors de l\'inscription';
        this.loading = false;
      }
    });
  }

  field(name: string) { return this.form.get(name); }
  isInvalid(name: string) { return this.field(name)?.invalid && this.field(name)?.touched; }
  get passwordMismatch() {
    return this.form.hasError('passwordMismatch') && this.field('confirmPassword')?.touched;
  }
}
