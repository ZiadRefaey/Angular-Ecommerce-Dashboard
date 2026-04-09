import { inject, Injectable } from '@angular/core';
import { IUser } from '../models/services.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { env } from '../../../enviroment/.env';
import { API_ENDPOINTS } from '../Constants/api-endpoints';

interface CurrentUser {
  _id: string;
  role: string;
  fullName: string;
  userName: string;
  age: number;
  phone: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface CurrentUserResponse {
  message: string;
  data: CurrentUser;
}

interface AppUser {
  _id: string;
  role: string;
  fullName: string;
  userName: string;
  age: number;
  phone: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface AllUsersResponse {
  message: string;
  data: AppUser[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  accessToken = 'token';
  private readonly authApiUrl = `${env.apiBaseUrl}/api${API_ENDPOINTS.auth.login}`;
  private readonly currentUserApiUrl = `${env.apiBaseUrl}/api${API_ENDPOINTS.auth.getCurrentUser}`;
  private readonly allUsersApiUrl = `${env.apiBaseUrl}/api${API_ENDPOINTS.auth.getAllUsers}`;
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
  getCurrentUser() {
    return this.http.get<CurrentUserResponse>(this.currentUserApiUrl);
  }
  getAllUsers() {
    return this.http.get<AllUsersResponse>(this.allUsersApiUrl);
  }
  logout(): void {
    localStorage.removeItem(this.accessToken);
    this.router.navigate(['/login']);
  }
}
