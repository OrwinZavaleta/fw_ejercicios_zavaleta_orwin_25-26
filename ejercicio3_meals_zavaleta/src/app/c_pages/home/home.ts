import { Component } from '@angular/core';
import { MealsCategory } from '../meals-category/meals-category';
import { MealsSave } from '../meals-save/meals-save';

@Component({
  selector: 'app-home',
  imports: [MealsCategory, MealsSave],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  public isAuthenticated = false; // más adelante vendrá de un AuthService
}
