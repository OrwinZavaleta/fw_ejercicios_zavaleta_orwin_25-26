import { Component } from '@angular/core';
import { LoginWidget } from '../login-widget/login-widget';

@Component({
  selector: 'app-header',
  imports: [LoginWidget],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

}
