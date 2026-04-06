import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  //to skip the interceptor when on login page
  const isLoginRequest = req.url.includes('/auth/login');
  if (!token || isLoginRequest) {
    return next(req);
  }

  //since we cant mutate the request on the interceptors we clone them
  const clonedReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(clonedReq);
};
