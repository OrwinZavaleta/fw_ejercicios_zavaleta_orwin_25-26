import { Component, input } from '@angular/core';
import { HousingLocationInfo } from '../interfaces/housinglocation';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-housing-location',
  imports: [RouterLink],
  templateUrl: './housing-location.html',
  styleUrl: './housing-location.css',
})
export class HousingLocation {
  housingLocation = input.required<HousingLocationInfo>();
  //No es una variable normal. Es una función.
}
