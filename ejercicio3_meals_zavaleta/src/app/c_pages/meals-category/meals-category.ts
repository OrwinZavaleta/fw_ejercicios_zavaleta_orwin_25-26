import { Component, computed, inject, resource, signal } from '@angular/core';
import { ApiService } from '../../services/api-service';
import { MyMeal } from '../../model/my-meal';
import { CardMeal } from '../card-meal/card-meal';
import { Category } from '../../model/category';
import { StorageService } from '../../services/storage-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-meals-category',
  imports: [CardMeal],
  templateUrl: './meals-category.html',
  styleUrl: './meals-category.css',
})
export class MealsCategory { //TODO: agregar el guardar a favoritos aqui
  protected api = inject(ApiService);
  protected storage = inject(StorageService);
  protected authService = inject(AuthService);

  public isAuthorized = computed(this.authService.isAuthenticated);

  public categorias = signal<Category[]>([]);
  public categoriasLoading = signal<boolean>(false);

  public categoriaSeleccionada = signal<string>('');
  public categoriaSeleccionadaFavorita = signal<boolean>(false);
  public platosAleatorios;

  constructor() {
    this.platosAleatorios = resource({
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
  }

  ngOnInit() {
    this.cargarCategorias();
    this.cargarCategoriaFavorita();
  }

  cargarCategoriaFavorita() {
    const usuario = this.storage.getUsuarioActual();
    if (usuario && usuario?.favoriteCategory) {
      this.categoriaSeleccionada.set(usuario.favoriteCategory);

    }
  }

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

    if (this.isAuthorized() && categoriaSelect !== '') {
      console.log(usuarioActual);
      console.log(categoriaSelect);
      if (usuarioActual && usuarioActual.favoriteCategory === categoriaSelect) {
        this.categoriaSeleccionadaFavorita.set(false);
        this.storage.actualizarFavoritoUsuarioActual();
      } else if (!usuarioActual) {
        this.categoriaSeleccionadaFavorita.set(false);
      } else {
        this.categoriaSeleccionadaFavorita.set(true);
        this.storage.actualizarFavoritoUsuarioActual(categoriaSelect);
      }
    }
  }

  onCategoryChange(categoriaSelect: string) {
    console.log('se ha seleccionado  ' + categoriaSelect);
    this.categoriaSeleccionada.set(categoriaSelect);

    console.log(this.storage.getUsuarioActual()?.favoriteCategory);

    if (this.storage.getUsuarioActual()?.favoriteCategory === categoriaSelect) {
      this.categoriaSeleccionadaFavorita.set(true);
    } else {
      this.categoriaSeleccionadaFavorita.set(false);
    }
  }
}
