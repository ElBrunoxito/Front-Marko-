import { Routes } from '@angular/router';
import { MainManagerComponent } from './components/main/main-manager/main-manager.component';
import { tokenGuard } from './guards/token.guard';
import { authGuard } from './guards/auth.guard';
import { NoPermissionComponent } from './components/no-permission/no-permission.component';

export const routes: Routes = [
    {
        path:'',redirectTo:'auth',pathMatch:'full'
    },
    {
        path:'auth', 
        canActivate:[authGuard],
        loadChildren:()=>import('./components/auth/auth.routes').then(a=>a.AUTH_ROUTES)
    },
    {
        path:'main',
        canActivate:[tokenGuard],
        component:MainManagerComponent, 
        loadChildren:()=>import('./components/main/main.routes').then(p=>p.MAIN_ROUTES)
    },

    {
        path:'No-Authorizated',
        component:NoPermissionComponent

    }
    /*,
    {
        path:'Not-Found',
        component:NotFoundComponent
    },
    {
        path:'**',
        redirectTo:'Not-Found   '

    }
    */
];
