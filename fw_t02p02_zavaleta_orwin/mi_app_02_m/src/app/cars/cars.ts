import { Component, inject } from '@angular/core';
import { CarService } from '../services/car.service';

@Component({
  selector: 'app-cars',
  standalone: false,
  templateUrl: './cars.html',
  styleUrl: './cars.css',
})
export class Cars {
  public titleComp = 'Cars';
  public carService = inject(CarService);
}
