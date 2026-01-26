import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user',
  standalone: false,
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User {
  public username = 'yoda';
  @Input() name = '';
  public logoUrl = '/imgs/logo.svg';
  public logoAlt = 'Angular logo';
  public titleComp = 'USER';
}
