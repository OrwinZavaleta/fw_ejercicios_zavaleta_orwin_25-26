import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Home } from './home/home';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('mi_app_03');
  public subTitle = signal('');
  public year = 2025;
  public clicks = 0;

  public auxStyle: Record<string, string> = {
    textAlign: 'center',
    marginTop: '100px',
  };

  constructor() {
    this.subTitle.set('DWEC & Frameworks');
    this.year = new Date().getFullYear();
  }

  public showTitleAndsubTitle() {
    return `${this.title()} - ${this.subTitle()} [${this.year}]`;
  }

  public incrementClicks(inc: number = 1) {
    this.clicks = this.clicks + inc;
  }
}
