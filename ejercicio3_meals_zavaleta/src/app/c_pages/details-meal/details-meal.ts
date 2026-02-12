import { Component, computed, inject, input, output, resource, signal } from '@angular/core';
import { ApiService } from '../../services/api-service';
import { NgOptimizedImage } from '@angular/common';
import { MyMeal } from '../../model/my-meal';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-details-meal',
  imports: [NgOptimizedImage],
  templateUrl: './details-meal.html',
  styleUrl: './details-meal.css',
})
export class DetailsMeal {
  private readonly api = inject(ApiService);
  readonly id = input.required<number>();
  public favClicked = output<boolean>();

  protected authService = inject(AuthService);

  public isAuthenticated = computed(this.authService.isAuthenticated);

  // protected platoSeleccionado = resource({
  //   params: () => this.id(),
  //   loader: async ({ params: id }) => await this.api.pedirPlatoPorId(id),
  // });

  public platoSeleccionado = signal<MyMeal | null>(null);

  ngOnInit() {
    this.cargarPlatoSeleccionado();
  }

  async cargarPlatoSeleccionado() {
    this.platoSeleccionado.set(await this.api.pedirPlatoPorId(this.id()));
  }

  handleFavClick() {
    this.favClicked.emit(false); // TODO: enviar el valor invertido del boton
  }
}
