import { Component, inject, resource } from '@angular/core';
import { StorageService } from '../../services/storage-service';
import { MyMeal } from '../../model/my-meal';
import { ApiService } from '../../services/api-service';
import { CardMeal } from '../card-meal/card-meal';

@Component({
  selector: 'app-meals-save',
  imports: [CardMeal],
  templateUrl: './meals-save.html',
  styleUrl: './meals-save.css',
})
export class MealsSave {
  private storage = inject(StorageService);
  private api = inject(ApiService);

  public platosGuardados = resource({
    params: () => this.storage.cambios(),
    loader: async () => {
      const guardados = this.storage.getPlatosFavoritos().reverse();
      const platosProcesados: MyMeal[] = [];

      for (let i = 0; i < guardados.length && i < 4; i++) {
        const plato = await this.api.pedirPlatoPorId(guardados[i].mealId);
        if (!plato) continue;
        platosProcesados.push(plato);
        console.log(guardados);
        console.log(guardados[i]);
      }
      return platosProcesados;
    },
  });
}
