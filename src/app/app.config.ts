import { ApplicationConfig, forwardRef, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FieldAutoCompleteComponent } from './components/widgets/field-auto-complete/field-auto-complete.component';
import { SocketIoModule } from 'ngx-socket-io';



export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor])),

  /*  provideNativeDateAdapter(),
  
    MatDatepickerModule,
    {
      provide:HTTP_INTERCEPTORS,
      //useClass:
      useValue:authInterceptor,
      multi:true
    },
    */
  ]
};
