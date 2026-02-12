import { Component, inject } from '@angular/core';
import { ApplyService } from '../services/apply.service';
import { WeekDay } from '../enums/week-day';

@Component({
  selector: 'app-apply',
  imports: [],
  templateUrl: './apply.html',
  styleUrl: './apply.css',
})
export class Apply {
  public applyService = inject(ApplyService);

  public weekDays: WeekDay[] = [
    WeekDay.Monday,
    WeekDay.Tuesday,
    WeekDay.Wednesday,
    WeekDay.Thursday,
    WeekDay.Friday,
  ];

  constructor() {
    this.applyService.load();
  }
}
