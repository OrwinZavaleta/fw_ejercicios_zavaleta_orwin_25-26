import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { LocalStorageService } from '../services/localstorage.service';

export const authGuard: CanActivateFn = (route, state) => {
 const localStorageService = inject(LocalStorageService);
 const router = inject(Router);

 if (localStorageService.isAuthenticated()) {
   return true; // Allow access
 }

 // Redirect to login
 router.navigate(['/']);
 return false; // Block access
};
