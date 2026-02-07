import { Component, inject, resource, signal } from '@angular/core';
import { ApiService } from '../../services/api-service';
import { MyMeal } from '../../model/my-meal';
import { CardMeal } from '../card-meal/card-meal';
import { Category } from '../../model/category';
import { StorageService } from '../../services/storage-service';

@Component({
  selector: 'app-meals-category',
  imports: [CardMeal],
  templateUrl: './meals-category.html',
  styleUrl: './meals-category.css',
})
export class MealsCategory {
  protected api = inject(ApiService);
  protected storage = inject(StorageService);

  public categorias = signal<Category[]>([]);
  public categoriasLoading = signal<boolean>(false);

  public categoriaSeleccionada = signal<string>('');
  public categoriaSeleccionadaFavorita = signal<boolean>(false);

  constructor() {
    // TODO: con sesion, cargar el favorito del user y boton como activo
    this.cargarCategorias();
  }

  public platosAleatorios = resource({
    params: () => this.categoriaSeleccionada(),

    loader: async ({ params: categoria }) => {
      if (!categoria || categoria === '') {
        return await this.api.pedirNPlatosRamdon();
      }

      const platosCompletos: MyMeal[] = [];

      const listaPlatos = await this.api.pedirNporCategoria(categoria);

      for (let i = 0; i < listaPlatos.length; i++) {
        platosCompletos.push(await this.api.pedirPlatoPorId(listaPlatos[i].idMeal));
      }
      return platosCompletos;
    },
  });

  private async cargarCategorias() {
    this.categoriasLoading.set(true);
    try {
      this.categorias.set(await this.api.pedirTodasCategorias());
    } catch (error) {
      console.error('Fallo al cargar las categorias.');
    } finally {
      this.categoriasLoading.set(false);
    }
  }

  onFavoriteClick(categoriaSelect: string) {
    console.log('se ha hecho click fav ' + categoriaSelect);
    const usuarioActual = this.storage.getUsuarioActual();

    if (usuarioActual && usuarioActual.favoriteCategory === categoriaSelect) { // TODO: comprobarlo cuando tenga las sesiones
      this.categoriaSeleccionadaFavorita.set(false);
      this.storage.actualizarFavoritoUsuarioActual();
    } else if (!usuarioActual) {
      this.categoriaSeleccionadaFavorita.set(false);
    } else {
      this.categoriaSeleccionadaFavorita.set(true);
      this.storage.actualizarFavoritoUsuarioActual(categoriaSelect);
    }
  }

  onCategoryChange(categoriaSelect: string) {
    console.log('se ha seleccionado  ' + categoriaSelect);
    this.categoriaSeleccionada.set(categoriaSelect);
    if (this.storage.getUsuarioActual()?.favoriteCategory === categoriaSelect) {
      this.categoriaSeleccionadaFavorita.set(true);
    }
  }
}
