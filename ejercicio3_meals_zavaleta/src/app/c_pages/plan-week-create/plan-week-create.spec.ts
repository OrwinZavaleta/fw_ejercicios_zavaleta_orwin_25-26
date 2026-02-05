import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanWeekCreate } from './plan-week-create';

describe('PlanWeekCreate', () => {
  let component: PlanWeekCreate;
  let fixture: ComponentFixture<PlanWeekCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanWeekCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanWeekCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
