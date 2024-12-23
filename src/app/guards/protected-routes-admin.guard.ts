import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../interceptors/storage.service';

export const protectedRoutesAdminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const storageService = inject(StorageService)
  
  const userRole =  storageService.getRoles(); 

  if (userRole.includes('ADMIN')) {
    return true; 
  }

  router.navigate(['main/No-Authorizated']);
  return false; 
};
