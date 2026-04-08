import { inject, Injectable } from '@angular/core';
import { IUser } from '../models/services.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { env } from '../../../enviroment/.env';
import { API_ENDPOINTS } from '../Constants/api-endpoints';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  accessToken = 'token';
  private readonly authApiUrl = `${env.apiBaseUrl}/api${API_ENDPOINTS.auth.login}`;
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
    return this.http.post(this.authApiUrl, {
      email: creds.email,
      password: creds.password,
    });
  }
  logout(): void {
    localStorage.removeItem(this.accessToken);
    this.router.navigate(['/login']);
  }
}
