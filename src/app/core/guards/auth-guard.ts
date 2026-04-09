import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  return authService.getCurrentUser().pipe(
    map((response) => {
      if (response.data.role?.toLowerCase() === 'admin') {
        return true;
      }

      authService.logout();
      return router.createUrlTree(['/login']);
    }),
    catchError(() => {
      authService.logout();
      return of(router.createUrlTree(['/login']) as boolean | UrlTree);
    }),
  );
};
