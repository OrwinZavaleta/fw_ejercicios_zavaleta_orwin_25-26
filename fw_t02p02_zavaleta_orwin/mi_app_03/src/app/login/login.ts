import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../services/localstorage.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private localstorageService = inject(LocalStorageService);
  private router = inject(Router);

  login(username: string, password: string): void {
    if (this.localstorageService.verifyUser(username, password)) {
      this.localstorageService.saveAuthenticatedUser(username);
      this.router.navigate(['/home']);
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  }

  ngOnInit(): void {
    // Si ya está autenticado, redirigir a home
    if (this.localstorageService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
  }
}
