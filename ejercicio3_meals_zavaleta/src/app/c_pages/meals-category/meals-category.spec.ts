import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealsCategory } from './meals-category';

describe('MealsCategory', () => {
  let component: MealsCategory;
  let fixture: ComponentFixture<MealsCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealsCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MealsCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
