import { inject, Injectable } from '@angular/core';
import { IUser } from '../models/services.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  getToken() {
    return localStorage.getItem('token');
  }
  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  login(creds: IUser) {
    return this.http.post('http://localhost:3000/api/auth/login', {
      email: creds.email,
      password: creds.password,
    });
  }
}
