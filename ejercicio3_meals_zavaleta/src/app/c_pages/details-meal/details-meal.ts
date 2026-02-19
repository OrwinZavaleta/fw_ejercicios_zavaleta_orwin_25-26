import { Component, computed, inject, input, output, resource, signal } from '@angular/core';
import { ApiService } from '../../services/api-service';
import { NgOptimizedImage } from '@angular/common';
import { MyMeal } from '../../model/my-meal';
import { AuthService } from '../../services/auth-service';
import { StorageService } from '../../services/storage-service';
import { Util } from '../../model/util';

@Component({
  selector: 'app-details-meal',
  imports: [NgOptimizedImage],
  templateUrl: './details-meal.html',
  styleUrl: './details-meal.css',
})
export class DetailsMeal {
  private readonly api = inject(ApiService);
  private readonly storage = inject(StorageService);
  readonly id = input.required<number>();
  public favClicked = output<boolean>();
  public favButton = signal<boolean>(false);

  public estadoApp = signal<{ tipo: string; mensaje: string } | null>(null);

  protected authService = inject(AuthService);

  public isAuthenticated = computed(this.authService.isAuthenticated);

  // protected platoSeleccionado = resource({
  //   params: () => this.id(),
  //   loader: async ({ params: id }) => await this.api.pedirPlatoPorId(id),
  // });

  // Solo es un plato de prueba
  public platoSeleccionado = signal<MyMeal>({
    idMeal: -12,
    strMeal: '',
    strCategory: '',
    strArea: '',
    strMealThumb: '',
    ingredients: [],
  });

  ngOnInit() {
    this.cargarSiFavoritos();
    this.cargarPlatoSeleccionado();
  }

  cargarSiFavoritos() {
    if (!!this.storage.buscarPlatoFavoritoPorId(this.id())) {
      this.favButton.set(true);
      this.favClicked.emit(true);
    } else {
      this.favButton.set(false);
      this.favClicked.emit(false);
    }
  }

  async cargarPlatoSeleccionado() {
    const plato = await this.api.pedirPlatoPorId(this.id());
    if (!plato) {
      this.mensajeEstadoApp('error', 'Fallo al cargar los datos de la api.');
      return;
    }
    this.platoSeleccionado.set(plato);
  }

  handleFavClick(button: HTMLButtonElement) {
    this.favClicked.emit(!button.classList.contains('active'));

    const plato = this.platoSeleccionado();

    const idUser = this.authService.currentUser()?.id;
    if (!idUser) {
      this.mensajeEstadoApp('error', 'No sesion activa.');
      return;
    }

    if (this.storage.buscarPlatoFavoritoPorId(plato.idMeal)) {
      this.storage.quitarPlatoFavorito(plato.idMeal);
      this.favButton.set(false);
    } else {
      this.storage.guardarPlatoFavorito(Util.transformarMyMealAUserMeal(plato.idMeal, idUser));
      this.favButton.set(true);
    }
  }

  mensajeEstadoApp(tipo: string, mensaje: string) {
    this.estadoApp.set({ tipo: tipo, mensaje: mensaje });

    setTimeout(() => {
      this.estadoApp.set(null);
    }, 5000);
  }
}
