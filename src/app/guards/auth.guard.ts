import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('access_token'); // Cambiado de 'token' a 'access_token'
  if (token) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};