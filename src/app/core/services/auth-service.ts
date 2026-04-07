import { inject, Injectable } from '@angular/core';
import { IUser } from '../models/services.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  accessToken = 'token';
  private http = inject(HttpClient);
  router = inject(Router);
  getToken() {
    return localStorage.getItem(this.accessToken);
  }
  setToken(token: string) {
    localStorage.setItem(this.accessToken, token);
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.accessToken);
  }
  login(creds: IUser) {
    return this.http.post('http://localhost:3000/api/auth/login', {
      email: creds.email,
      password: creds.password,
    });
  }
  logout(): void {
    localStorage.removeItem(this.accessToken);
    this.router.navigate(['/login']);
  }
}
