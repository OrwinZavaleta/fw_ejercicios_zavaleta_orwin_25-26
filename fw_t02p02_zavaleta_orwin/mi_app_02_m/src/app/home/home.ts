import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  public isServerRunning = false;
  public characters = [
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

  public itemsParent: string[] = [];
  public addItemParent(newItem: string) {
    this.itemsParent.push(newItem);
  }
  public titleComp = 'HOME';
}
