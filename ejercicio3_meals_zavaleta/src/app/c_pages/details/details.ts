import { Component, input, inject, computed } from '@angular/core';
import { DetailsMeal } from '../details-meal/details-meal';
import { DetailsSave } from '../details-save/details-save';
import { AuthService } from '../../services/auth-service';
@Component({
  selector: 'app-details',
  imports: [DetailsMeal, DetailsSave],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details {
  readonly id = input.required<number>(); // TODO: revisar como hacerlo sin esa directiva en el app.config.ts
  protected authService = inject(AuthService);

  public isAuthenticated = computed(this.authService.isAuthenticated);

  handleFavClick() {
    console.log('llego el clidk'); // TODO: revisar porque no funciona
  }
}
