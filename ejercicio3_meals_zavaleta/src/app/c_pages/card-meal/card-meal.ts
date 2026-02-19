import { Component, computed, inject, input } from '@angular/core';
import { MyMeal } from '../../model/my-meal';
import { NgOptimizedImage } from '@angular/common';
import { StorageService } from '../../services/storage-service';
import { Util } from '../../model/util';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-card-meal',
  imports: [NgOptimizedImage],
  templateUrl: './card-meal.html',
  styleUrl: './card-meal.css',
})
export class CardMeal {
  private storage = inject(StorageService);
  plato = input.required<MyMeal>();
  optimizar = input<boolean>(true);
  protected authService = inject(AuthService);

  public isAuthorized = computed(this.authService.isAuthenticated);

  handleGuardar() {
    const user = this.authService.currentUser();
    if (!user) return;

    if (this.isPlatoFavorito()) {
      this.storage.quitarPlatoFavorito(this.plato().idMeal);
    } else {
      this.storage.guardarPlatoFavorito(
        Util.transformarMyMealAUserMeal(this.plato().idMeal, user.id),
      );
    }
  }

  isPlatoFavorito() {
    return !!this.storage.buscarPlatoFavoritoPorId(this.plato().idMeal);
  }
}
