import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanWeekList } from './plan-week-list';

describe('PlanWeekList', () => {
  let component: PlanWeekList;
  let fixture: ComponentFixture<PlanWeekList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanWeekList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanWeekList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
