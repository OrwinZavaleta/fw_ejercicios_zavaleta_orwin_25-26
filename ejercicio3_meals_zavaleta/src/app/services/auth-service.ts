import { computed, inject, Injectable, signal } from '@angular/core';
import { StorageService } from './storage-service';
import { User } from '../model/user';
import { Login } from '../c_pages/login/login';

/* No representa datos, gestiona estado y comportamiento
iniciar sesión
cerrar sesión
comprobar si hay un usuario autenticado
recuperar la sesión almacenada
*/

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private storage = inject(StorageService);

  public currentUser = signal<User | null>(this.storage.getUsuarioActual());

  public isAuthenticated = computed(() => !!this.currentUser());

  public register(user: User) {
    if (
      this.storage.existeUsuarioPorId(user.id) ||
      !!this.storage.buscarUsuarioPorCorreo(user.email)
    ) {
      // throw 'El usuario ya existe';
      return false;
    }

    this.storage.guardarAgregarUsuario(user);
    // this.currentUser.set(user); // Correccion del error en la autenticacion
    return true;
  }

  public login(user: User) {
    if (
      !this.storage.existeUsuarioPorId(user.id) &&
      !this.storage.buscarUsuarioPorCorreo(user.email)
    ) {
      // throw 'El usuario no existe';
      return false;
    }

    this.storage.setUsuarioActual(user);
    this.currentUser.set(user);
    return true;
  }

  public logout() {
    if (!this.currentUser()) {
      // throw 'No existe usuario actual';
      return false;
    }

    this.storage.removeUsuarioActual();
    this.currentUser.set(null);
    return true;
  }
}
