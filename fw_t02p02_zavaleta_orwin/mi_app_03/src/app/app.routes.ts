import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Details } from './details/details';
import { Login } from './login/login';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: Login,
    title: 'Login',
  },
  {
    path: 'home',
    component: Home,
    title: 'Home page',
    canActivate: [authGuard],
  },
  {
    path: 'details/:id',
    component: Details,
    title: 'Home details',
    canActivate: [authGuard],
  },
];
