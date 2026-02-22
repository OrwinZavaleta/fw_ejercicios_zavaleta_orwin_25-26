import { Injectable, signal } from '@angular/core';
import { User } from '../model/user';
import { AuthSession } from '../model/auth-session';
import { MyMeal } from '../model/my-meal';
import { UserMeal } from '../model/user-meal';
import { WeeklyPlan } from '../model/weekly-plan';
import { Util } from '../model/util';
import { UserMiniMeal } from '../model/user-mini-meal';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private USER_KEY_ITEM: string = 'users';
  private AUTH_SESSION_KEY_ITEM: string = 'session';
  private USER_MEAL_KEY_ITEM: string = 'userMeals_';
  private USER_WEEKLY_KEY_ITEM: string = 'weeklyPlans_';
  private USER_CACHE_KEY_ITEM: string = 'userMiniMeal_';

  public cambios = signal<boolean>(false);
  public cambiosPlanSemanal = signal<boolean>(false);

  public guardarAgregarUsuario(nuevoUsuario: User): boolean {
    try {
      const users: User[] = JSON.parse(localStorage.getItem(this.USER_KEY_ITEM) ?? '[]');

      users.push(nuevoUsuario);

      localStorage.setItem(this.USER_KEY_ITEM, JSON.stringify(users));
      // this.setUsuarioActual(nuevoUsuario);
      return true;
    } catch (error) {
      return false;
    }
  }

  public setUsuarioActual(usuario: User): void {
    const usuarioAGuardar = new AuthSession(usuario.id, usuario.name, new Date());
    localStorage.setItem(this.AUTH_SESSION_KEY_ITEM, JSON.stringify(usuarioAGuardar));
  }

  public getUsuarioActual(): User | null {
    const usersinProcesar: string | null = localStorage.getItem(this.AUTH_SESSION_KEY_ITEM);

    if (usersinProcesar === null) return null;

    const usuarioProcesado: AuthSession = AuthSession.fromJSON(usersinProcesar);

    return this.buscarUsuarioPorId(usuarioProcesado.getId());
  }

  public removeUsuarioActual(): void {
    localStorage.removeItem(this.AUTH_SESSION_KEY_ITEM);
  }

  public buscarUsuarioPorCorreo(correo: string) {
    const users: User[] = JSON.parse(localStorage.getItem(this.USER_KEY_ITEM) ?? '[]');

    const usuarioEncontrado = users.find((us) => us.email === correo);

    if (usuarioEncontrado === undefined) return null;

    return usuarioEncontrado;
  }

  private buscarUsuarioPorId(id: User['id']) {
    const users: User[] = JSON.parse(localStorage.getItem(this.USER_KEY_ITEM) ?? '[]');

    const usuarioEncontrado = users.find((us) => us.id === id);

    if (usuarioEncontrado === undefined) return null;

    return usuarioEncontrado;
  }

  public existeUsuarioPorId(id: User['id']) {
    const user = this.buscarUsuarioPorId(id);

    return user ? true : false;
  }

  public actualizarFavoritoUsuarioActual(categoriaFavorita: string | undefined = undefined) {
    const users: User[] = JSON.parse(localStorage.getItem(this.USER_KEY_ITEM) ?? '[]');

    const usuarioActual = this.getUsuarioActual();

    if (usuarioActual) {
      const usuarioEncontrado = users.find((us) => us.id === usuarioActual.id);
      if (usuarioEncontrado) {
        usuarioEncontrado.favoriteCategory = categoriaFavorita;
      }

      localStorage.setItem(this.USER_KEY_ITEM, JSON.stringify(users));
    } else {
      throw new Error('El usuario no existe');
    }
  }

  public obtenerProximoIdUser(): User['id'] {
    const users: User[] = JSON.parse(localStorage.getItem(this.USER_KEY_ITEM) ?? '[]');

    let ultimoId = 0;

    users.forEach((us) => {
      if (us.id > ultimoId) ultimoId = us.id;
    });

    return ultimoId + 1;
  }

  public getPlatosFavoritos(): UserMeal[] {
    const idUser = this.getUsuarioActual()?.id;
    if (!idUser) throw 'No hay sesión activa.';

    const favoritosUserSinProcesar = localStorage.getItem(this.USER_MEAL_KEY_ITEM + idUser) ?? '[]';
    const favoritosUserProcesados: UserMeal[] = JSON.parse(favoritosUserSinProcesar);

    return favoritosUserProcesados;
  }
  public guardarPlatoFavorito(platoGuardar: UserMeal): void {
    const idUser = this.getUsuarioActual()?.id;
    if (!idUser) throw 'No hay sesión activa.';

    const favoritosUserProcesados: UserMeal[] = this.getPlatosFavoritos();

    favoritosUserProcesados.push(platoGuardar);

    localStorage.setItem(this.USER_MEAL_KEY_ITEM + idUser, JSON.stringify(favoritosUserProcesados));
    this.cambios.set(!this.cambios());
  }
  public buscarPlatoFavoritoPorId(platoId: MyMeal['idMeal']): UserMeal | undefined {
    const favoritosUserProcesados: UserMeal[] = this.getPlatosFavoritos();

    return favoritosUserProcesados.find((plato) => plato.mealId === platoId);
  }

  public quitarPlatoFavorito(platoId: MyMeal['idMeal']): void {
    const idUser = this.getUsuarioActual()?.id;
    if (!idUser) throw 'No hay sesión activa.';

    const favoritosUserProcesados: UserMeal[] = this.getPlatosFavoritos();

    const indexPlato = favoritosUserProcesados.findIndex((plato) => plato.mealId === platoId);
    favoritosUserProcesados.splice(indexPlato, 1);

    localStorage.setItem(this.USER_MEAL_KEY_ITEM + idUser, JSON.stringify(favoritosUserProcesados));
    this.cambios.set(!this.cambios());
  }

  public actualizarPlatoFavorito(platoActualizar: UserMeal) {
    const idUser = this.getUsuarioActual()?.id;
    if (!idUser) throw 'No hay sesión activa.';

    const favoritosUserProcesados: UserMeal[] = this.getPlatosFavoritos();

    const indexPlato = favoritosUserProcesados.findIndex(
      (plato) => plato.mealId === platoActualizar.mealId,
    );

    favoritosUserProcesados[indexPlato].status = platoActualizar.status;
    favoritosUserProcesados[indexPlato].notes = platoActualizar.notes;
    favoritosUserProcesados[indexPlato].rating = platoActualizar.rating;

    localStorage.setItem(this.USER_MEAL_KEY_ITEM + idUser, JSON.stringify(favoritosUserProcesados));
  }

  public guardarPlanSemanal(planSemanal: WeeklyPlan) {
    const idUser = this.getUsuarioActual()?.id;
    if (!idUser) throw 'No hay sesión activa.';

    const planesSemanales: WeeklyPlan[] = JSON.parse(
      localStorage.getItem(this.USER_WEEKLY_KEY_ITEM + idUser) ?? '[]',
    );

    planesSemanales.push(planSemanal);

    localStorage.setItem(this.USER_WEEKLY_KEY_ITEM + idUser, JSON.stringify(planesSemanales));
    this.cambiosPlanSemanal.set(!this.cambiosPlanSemanal());
  }

  public getPlanesSemanales() {
    const idUser = this.getUsuarioActual()?.id;
    if (!idUser) throw 'No hay sesión activa.';

    const planesSemanales: WeeklyPlan[] = JSON.parse(
      localStorage.getItem(this.USER_WEEKLY_KEY_ITEM + idUser) ?? '[]',
    );

    return planesSemanales;
  }
  public getPlanSemanalActual() {
    const idUser = this.getUsuarioActual()?.id;
    if (!idUser) throw 'No hay sesión activa.';

    const planesSemanales: WeeklyPlan[] = JSON.parse(
      localStorage.getItem(this.USER_WEEKLY_KEY_ITEM + idUser) ?? '[]',
    );

    const fechaActual = Util.getISOWeek(new Date());

    return planesSemanales.find((e) => e.id === fechaActual);
  }

  public borrarPlanSemanalPorId(id: WeeklyPlan['id']) {
    const idUser = this.getUsuarioActual()?.id;
    if (!idUser) throw 'No hay sesión activa.';

    const planesSemanales: WeeklyPlan[] = JSON.parse(
      localStorage.getItem(this.USER_WEEKLY_KEY_ITEM + idUser) ?? '[]',
    );

    planesSemanales.splice(
      planesSemanales.findIndex((e) => e.id === id),
      1,
    );
    localStorage.setItem(this.USER_WEEKLY_KEY_ITEM + idUser, JSON.stringify(planesSemanales));
    this.cambiosPlanSemanal.set(!this.cambiosPlanSemanal());
  }

  public existePlanSemanalPorId(id: WeeklyPlan['id']) {
    const idUser = this.getUsuarioActual()?.id;
    if (!idUser) throw 'No hay sesión activa.';

    const planesSemanales: WeeklyPlan[] = JSON.parse(
      localStorage.getItem(this.USER_WEEKLY_KEY_ITEM + idUser) ?? '[]',
    );

    return planesSemanales.some((e) => e.id === id);
  }

  public cachearMyMeal(meal: MyMeal) {
    const idUser = this.getUsuarioActual()?.id;
    if (!idUser) throw 'No hay sesión activa.';

    const caches: UserMiniMeal[] = JSON.parse(
      localStorage.getItem(this.USER_CACHE_KEY_ITEM + idUser) ?? '[]',
    );

    caches.push(Util.transformarMyMealAMiniMeal(meal));

    localStorage.setItem(this.USER_CACHE_KEY_ITEM + idUser, JSON.stringify(caches));
  }

  public cachearMiniMeal(meal: UserMiniMeal) {
    const idUser = this.getUsuarioActual()?.id;
    if (!idUser) throw 'No hay sesión activa.';

    const caches: UserMiniMeal[] = JSON.parse(
      localStorage.getItem(this.USER_CACHE_KEY_ITEM + idUser) ?? '[]',
    );

    caches.push(meal);
    localStorage.setItem(this.USER_CACHE_KEY_ITEM + idUser, JSON.stringify(caches));
  }

  public getCachePorId(id: UserMiniMeal['id']) {
    const idUser = this.getUsuarioActual()?.id;
    if (!idUser) throw 'No hay sesión activa.';

    const caches: UserMiniMeal[] = JSON.parse(
      localStorage.getItem(this.USER_CACHE_KEY_ITEM + idUser) ?? '[]',
    );

    return caches.find((e) => e.id === id);
  }
}
