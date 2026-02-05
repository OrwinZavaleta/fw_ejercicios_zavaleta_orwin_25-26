import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealsSave } from './meals-save';

describe('MealsSave', () => {
  let component: MealsSave;
  let fixture: ComponentFixture<MealsSave>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealsSave]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MealsSave);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
