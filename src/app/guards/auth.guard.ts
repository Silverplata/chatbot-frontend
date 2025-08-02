import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { toast } from 'ngx-sonner';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('access_token');
  if (token) {
    return true;
  }
  toast.error('Por favor, inicia sesión para acceder.');
  router.navigate(['/login']);
  return false;
};