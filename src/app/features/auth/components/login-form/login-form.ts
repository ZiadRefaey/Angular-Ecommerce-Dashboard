import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';

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
  serverErrMessage = '';
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
      password: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(6)]),
    });
  }

  get emailControl(): FormControl<string> {
    return this.form.controls.email;
  }

  get passwordControl(): FormControl<string> {
    return this.form.controls.password;
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
    console.log(this.form.getRawValue());
    this.authService
      .login({
        email,
        password,
      })
      .subscribe({
        next: (res: any) => {
          console.log(res.data.accessToken);
          this.authService.setToken(res.data.accessToken);
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1000);
        },
        error: (err) => {
          this.loginFail = true;
          this.serverErrMessage = err.error.error;
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
          this.loginFail = false;
        },
      });
  }
}
