import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPage } from './pages/login-page/login-page';
import { LoginForm } from './components/login-form/login-form';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing';

@NgModule({
  declarations: [LoginPage, LoginForm],
  imports: [ReactiveFormsModule, CommonModule, AuthRoutingModule],
})
export class AuthModule {}
