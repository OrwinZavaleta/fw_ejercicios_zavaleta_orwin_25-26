import { Component, input } from '@angular/core';
import { MyMeal } from '../../model/my-meal';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-card-meal',
  imports: [NgOptimizedImage],
  templateUrl: './card-meal.html',
  styleUrl: './card-meal.css',
})
export class CardMeal {
  plato = input.required<MyMeal>();
}
