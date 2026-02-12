import { Component, computed, inject } from '@angular/core';
import { LoginWidget } from '../login-widget/login-widget';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-header',
  imports: [LoginWidget],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  protected authService = inject(AuthService);

  public isAuthenticated = computed(this.authService.isAuthenticated);

  handleLogOut(){
    console.log("deslogueas");
    this.authService.logout()
  }
}
