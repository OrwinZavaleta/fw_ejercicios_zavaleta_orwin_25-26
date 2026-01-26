import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-child',
  standalone: false,
  templateUrl: './child.html',
  styleUrl: './child.css',
})
export class Child {
  @Output() addItemChildEvent = new EventEmitter<string>();

  public addItemChild() {
    this.addItemChildEvent.emit('🐢');
  }
}
