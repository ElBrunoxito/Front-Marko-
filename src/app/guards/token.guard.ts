import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../interceptors/storage.service';

export const tokenGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const storageService = inject(StorageService)
  
  const token = storageService.getToken()
  const expiration = storageService.getExpirationDate();

  if(token && expiration){
    const currentDate = new Date()
    console.warn(currentDate)
    const expirationDate = new Date(expiration)

    if (currentDate < expirationDate) {
      return true; 
    }else{
      router.navigate(['auth/login']);
      return false;
    }
  }

  router.navigate(['auth/login']);

  return false;
};
