import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';

type LoginFormType = FormGroup<{
  email: FormControl<string>;
  password: FormControl<string>;
}>;
@Component({
  selector: 'app-login-form',
  standalone: false,
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  authService = inject(AuthService);
  router = inject(Router);
  form: LoginFormType;
  showPassword = false;
  isSubmitting = false;
  loginFail: null | boolean = null;
  loginSuccess = false;
  serverErrMessage = '';
  private readonly passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{6,}$/;
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
      password: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(this.passwordPattern),
      ]),
    });
  }

  get emailControl(): FormControl<string> {
    return this.form.controls.email;
  }

  get passwordControl(): FormControl<string> {
    return this.form.controls.password;
  }

  get passwordErrorMessage(): string {
    const passwordControl = this.passwordControl;
    const passwordValue = passwordControl.value ?? '';

    if (!(passwordControl.dirty || passwordControl.touched) || !passwordControl.errors) {
      return '';
    }

    if (passwordControl.errors['required']) {
      return 'Password is required.';
    }

    if (passwordControl.errors['minlength']) {
      return 'Password must be at least 6 characters long.';
    }

    if (!/[A-Z]/.test(passwordValue)) {
      return 'Password must include at least one uppercase letter.';
    }

    if (!/[a-z]/.test(passwordValue)) {
      return 'Password must include at least one lowercase letter.';
    }

    if (!/[^A-Za-z0-9]/.test(passwordValue)) {
      return 'Password must include at least one special character.';
    }

    return 'Please enter a valid password.';
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  isFieldInvalid(control: FormControl<unknown>): boolean {
    return control.invalid && (control.dirty || control.touched);
  }

  onSubmit(): void {
    const { email, password } = this.form.getRawValue();
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.loginFail = null;
    this.loginSuccess = false;
    this.serverErrMessage = '';

    this.authService
      .login({
        email,
        password,
      })
      .pipe(
        switchMap((res: any) => {
          this.authService.setToken(res.data.accessToken);
          return this.authService.getCurrentUser();
        }),
      )
      .subscribe({
        next: (response) => {
          if (response.data.role?.toLowerCase() !== 'admin') {
            this.authService.logout();
            this.loginFail = true;
            this.serverErrMessage = 'This dashboard is only available for admin accounts.';
            this.isSubmitting = false;
            return;
          }

          this.loginSuccess = true;
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1000);
        },
        error: (err) => {
          this.loginFail = true;
          this.loginSuccess = false;
          this.serverErrMessage = err.error?.error || err.error?.message || 'Unable to sign in right now.';
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        },
      });
  }
}
