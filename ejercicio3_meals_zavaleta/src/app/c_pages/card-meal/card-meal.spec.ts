import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardMeal } from './card-meal';

describe('CardMeal', () => {
  let component: CardMeal;
  let fixture: ComponentFixture<CardMeal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardMeal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardMeal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
