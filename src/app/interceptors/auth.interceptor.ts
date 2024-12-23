import { HttpInterceptorFn } from '@angular/common/http';
import { enviorement } from '../enviorement/config';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { StorageService } from './storage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const allowedEndpoints = enviorement.allowed;


  const isAllowedEndpoint = allowedEndpoints.some(url => req.url.includes(url));

  if (isAllowedEndpoint) {
    return next(req);
  }

  const storageService = inject(StorageService)

  const authToken = storageService.getToken();
  
  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${authToken}`
    }
  });

  return next(clonedRequest);
};
