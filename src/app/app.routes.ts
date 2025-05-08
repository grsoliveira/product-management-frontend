import { Routes } from '@angular/router';
import {AuthGuard} from './guards/AuthGuardService';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/LoginComponent').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./app.component').then(m => m.AppComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
