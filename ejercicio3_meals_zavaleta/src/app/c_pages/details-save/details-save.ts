import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-details-save',
  imports: [],
  templateUrl: './details-save.html',
  styleUrl: './details-save.css',
})
export class DetailsSave {
  public platoFavorito = signal(false);


}
