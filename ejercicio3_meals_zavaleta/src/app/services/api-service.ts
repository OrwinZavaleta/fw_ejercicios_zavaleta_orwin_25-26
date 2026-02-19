import { Injectable } from '@angular/core';
import { MyMeal } from '../model/my-meal';
import { Category } from '../model/category';
import { Util } from '../model/util';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private API_KEY: string = '1';
  private API_URL: string = 'https://www.themealdb.com/api/json/v1/' + this.API_KEY;
  private CANTIDAD_PLATOS_ALEATORIAS: number = 8;

  private convertirApiToInterface(plato: any): MyMeal {
    let i = 1;
    const ingredientes: MyMeal['ingredients'] = [];
    while (plato['strIngredient' + i]) {
      if (ingredientes.some((e) => e.name === plato['strIngredient' + i])) {
        i++;
        continue;
      }
      ingredientes.push({
        name: plato['strIngredient' + i],
        measure: plato['strMeasure' + i],
      });
      i++;
    }
    return {
      idMeal: plato.idMeal,
      strMeal: plato.strMeal,
      strCategory: plato.strCategory,
      strArea: plato.strArea,
      strMealThumb: plato.strMealThumb,
      ingredients: ingredientes,
    };
  }

  public async pedirProductoRandom(): Promise<MyMeal | null> {
    try {
      const response: Response = await fetch(this.API_URL + '/random.php');
      const data = await response.json();

      return this.convertirApiToInterface(data.meals[0]);
    } catch (error) {
      return null;
    }
  }

  public async pedirNPlatosRamdon(): Promise<MyMeal[] | null> {
    try {
      const todosAleatorios: MyMeal[] = [];
      for (let i = 0; i < this.CANTIDAD_PLATOS_ALEATORIAS; i++) {
        const plato = await this.pedirProductoRandom();

        if (!plato) return null;

        todosAleatorios.push(plato);
      }
      return todosAleatorios;
    } catch (error) {
      return null;
    }
  }

  public async pedirTodasCategorias(): Promise<Category[] | null> {
    try {
      const response: Response = await fetch(this.API_URL + '/categories.php');
      const data = await response.json();

      return data.categories.sort((a: Category, b: Category) =>
        a.strCategory.localeCompare(b.strCategory),
      );
    } catch (error) {
      return null;
    }
  }

  public async pedirPlatosPorCategoria(categoria: string): Promise<MyMeal[] | null> {
    try {
      const response: Response = await fetch(this.API_URL + `/filter.php?c=${categoria}`);

      const data = await response.json();

      return data.meals;
    } catch (error) {
      return null;
    }
  }

  public async pedirNporCategoria(categoria: string): Promise<MyMeal[] | null> {
    try {
      const platosPedidos = await this.pedirPlatosPorCategoria(categoria);

      if (!platosPedidos) return null;

      const numAleatorios = Util.pedirNAleatorios(
        this.CANTIDAD_PLATOS_ALEATORIAS,
        platosPedidos.length,
      );

      const categoriaPlatos: MyMeal[] = [];
      for (let i = 0; i < platosPedidos.length && i < this.CANTIDAD_PLATOS_ALEATORIAS; i++) {
        const plato = platosPedidos[numAleatorios[i]];

        const platoPedido = await this.pedirPlatoPorId(plato.idMeal);

        if (!platoPedido) return null;

        categoriaPlatos.push(platoPedido);
      }

      return categoriaPlatos;
    } catch (error) {
      return null;
    }
  }

  public async pedirPlatoPorId(id: number): Promise<MyMeal | null> {
    try {
      const response: Response = await fetch(this.API_URL + `/lookup.php?i=${id}`);

      const data = await response.json();

      return this.convertirApiToInterface(data.meals[0]);
    } catch (error) {
      return null;
    }
  }
}
