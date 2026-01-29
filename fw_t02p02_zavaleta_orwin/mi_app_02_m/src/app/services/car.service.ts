import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  private _cars = ['Sunflower GT', 'Flexus Sport', 'Sprout Mach One'];

  public get cars(): string[] {
    return this._cars;
  }

  public set cars(newCars: string[]) {
    this._cars = newCars;
  }

  public addCar(car: string): void {
    this._cars.push(car);
  }

  public removeCar(id: number): void {
    this._cars.splice(id, 1);
  }
}
