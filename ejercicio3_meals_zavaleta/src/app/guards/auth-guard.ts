import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../services/storage-service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const storage = inject(StorageService);
  const router = inject(Router);

  if (storage.getUsuarioActual()) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
