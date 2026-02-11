import { Component, input } from '@angular/core';
import { DetailsMeal } from '../details-meal/details-meal';
import { DetailsSave } from '../details-save/details-save';
@Component({
  selector: 'app-details',
  imports: [DetailsMeal, DetailsSave],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details {
  readonly id = input.required<number>();
  public isAuthenticated = false; // TODO: más adelante vendrá de un AuthService
}
