import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('mi_app_02_m');
  public isServerRunning = false;
  public characters: { id: number; name: string }[] = [
    { id: 0, name: 'Rachel' },
    { id: 1, name: 'Monica' },
    { id: 2, name: 'Phoebe' },
    { id: 3, name: 'Ross' },
    { id: 4, name: 'Chandler' },
    { id: 5, name: 'Joey' },
  ];
  public isEditable = true;
  public message = '';
  public boxClass = 'box-class';
  public onMouseOverAction() {
    this.message = "Let's go!";
  }
  public onMouseOutAction() {
    this.message = '';
  }
}
