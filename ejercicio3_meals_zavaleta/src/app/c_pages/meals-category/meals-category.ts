import { Component, inject, resource, signal } from '@angular/core';
import { ApiService } from '../../services/api-service';
import { MyMeal } from '../../model/my-meal';
import { CardMeal } from '../card-meal/card-meal';

@Component({
  selector: 'app-meals-category',
  imports: [CardMeal],
  templateUrl: './meals-category.html',
  styleUrl: './meals-category.css',
})
export class MealsCategory {
  CANTIDAD_PLATOS_ALEATORIAS: number = 8;
  protected api = inject(ApiService);
  private categoriaSeleccionada = signal<string>('');

  public platosAleatorios = resource({
    params: () => this.categoriaSeleccionada(), // TODO: revisarlo y repasarlo

    loader: async ({ params: categoria }) => {
      if (!categoria) {
        return await this.pedirTodosAleatorio();
      }

      const listaPlatos = await this.api.pedirPlatosPorCategoria(categoria);

      const promesasDetalles = listaPlatos.map(p => this.api.pedirPlatoPorId(p.idMeal));

      return await Promise.all(promesasDetalles);
    }
  });
  categorias = resource({
    loader: () => this.api.pedirTodasCategorias(),
  });

  onFavoriteClick(categoriaSelect: string) {
    console.log('se ha hecho click ' + categoriaSelect); // TODO: guardar el favorito
  }

  onCategoryChange(categoriaSelect: string) {
    console.log('se ha seleccionado  ' + categoriaSelect); // TODO: actualizar los aleatorios
    // this.platosAleatorios = resource({
    //   loader: () => {
    //     const platosCate = this.api.pedirPlatosPorCategoria(categoriaSelect);
    //     return platosCate.map((platoCat) => this.api.pedirPlatoPorId(platoCat.idMeal));
    //   },
    // });
    this.categoriaSeleccionada.set(categoriaSelect);
  }

  async pedirTodosAleatorio(): Promise<MyMeal[]> {
    const todosAleatorios: MyMeal[] = [];
    for (let i = 0; i < this.CANTIDAD_PLATOS_ALEATORIAS; i++) {
      todosAleatorios.push(await this.api.pedirProductoRandom());
    }
    return todosAleatorios;
  }
}
