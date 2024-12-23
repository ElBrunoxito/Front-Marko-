import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../interceptors/storage.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const storageService = inject(StorageService)

  const token = storageService.getToken()
  const expiration = storageService.getExpirationDate();

  if (token && expiration) {
    const currentDate = new Date();
    const expirationDate = new Date(expiration);

    // Si el token existe y no ha expirado, redirigir a la página principal
    if (currentDate < expirationDate) {
      router.navigate(['/main']); // Redirigir a la ruta principal
      return false; // Bloquear el acceso a la ruta de login
    }
  }

  // Si el token no existe o la sesión ha expirado, permitir acceso al login
  return true;
};
