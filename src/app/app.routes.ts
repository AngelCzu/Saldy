import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';
import { GuestGuard } from './core/auth/auth.guest-guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';



export const routes: Routes = [
 /* {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },*/
  {
    path: 'layout',
    component: MainLayoutComponent,
    children: [
      {
        path: 'home',
        canActivate: [AuthGuard],
        loadComponent: () => import('./features/home/ui/home.page').then( m => m.HomePage)
      },
      {
        path: 'analysis',
        canActivate: [AuthGuard],
        loadComponent: () => import('./features/analysis/ui/analysis.page').then( m => m.AnalysisPage)
      },
      {
        path: 'register-movement',
        loadComponent: () => import('./features/movements/ui/register-movement/register-movement.page').then( m => m.RegisterMovementPage)
      },
      {
        path: '',
        redirectTo: '/layout/home',
        pathMatch: 'full',
      },
    ]

  },
  {
    path: '',
    redirectTo: '/layout/home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    canActivate: [GuestGuard],
    loadComponent: () => import('./features/auth/login/ui/login.page').then( m => m.LoginPage)
  }
  



];
