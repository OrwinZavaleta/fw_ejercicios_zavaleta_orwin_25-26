import { Component, input, inject, computed, signal } from '@angular/core';
import { DetailsMeal } from '../details-meal/details-meal';
import { DetailsSave } from '../details-save/details-save';
import { AuthService } from '../../services/auth-service';
//import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-details',
  imports: [DetailsMeal, DetailsSave],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details {

  // private route = inject(ActivatedRoute);

  // id = this.route.snapshot.paramMap.get('id');

  // // O si el ID puede cambiar sin que el componente se destruya:
  // id$ = this.route.paramMap.pipe(map(params => params.get('id')));

  readonly id = input.required<number>();
  protected authService = inject(AuthService);

  public isAuthenticated = computed(this.authService.isAuthenticated);
  public isFavorite = signal<boolean>(false);

  handleFavClick($event: boolean) {
    console.log('llego el clidk');
    console.log('Ha llegado un: ' + $event);

    this.isFavorite.set($event);
  }
}
