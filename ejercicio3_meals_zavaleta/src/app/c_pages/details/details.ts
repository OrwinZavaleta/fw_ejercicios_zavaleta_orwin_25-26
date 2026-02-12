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
  readonly id = input.required<number>();
  protected authService = inject(AuthService);

  public isAuthenticated = computed(this.authService.isAuthenticated);
}
