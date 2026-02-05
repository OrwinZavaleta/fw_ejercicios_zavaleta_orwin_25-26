import { Injectable } from '@angular/core';
import { MyMeal } from '../model/my-meal';
import { Category } from '../model/category';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private API_KEY: string = '1';
  private API_URL: string = 'https://www.themealdb.com/api/json/v1/' + this.API_KEY;

  private convertirApiToInterface(plato: any): MyMeal {
    let i = 1;
    const ingredientes: MyMeal['ingredients'] = [];
    while (plato['strIngredient' + i]) {
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

  public async pedirProductoRandom(): Promise<MyMeal> {
    const response: Response = await fetch(this.API_URL + '/random.php');
    const data = await response.json();

    return this.convertirApiToInterface(data.meals[0]);
  }

  public async pedirTodasCategorias(): Promise<Category[]> {
    const response: Response = await fetch(this.API_URL + '/categories.php');
    const data = await response.json();

    return data.categories.sort((a: Category, b: Category) =>
      a.strCategory.localeCompare(b.strCategory),
    );
  }

  public async pedirPlatosPorCategoria(categoria: string): Promise<MyMeal[]> {
    const response: Response = await fetch(this.API_URL + `/filter.php?c=${categoria}`);

    const data = await response.json();

    return data.meals;
  }

  public async pedirPlatoPorId(id: number): Promise<MyMeal> {
    const response: Response = await fetch(this.API_URL + `/lookup.php?i=${id}`);

    const data = await response.json();

    return this.convertirApiToInterface(data.meals[0]);
  }
}
