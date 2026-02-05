import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsMeal } from './details-meal';

describe('DetailsMeal', () => {
  let component: DetailsMeal;
  let fixture: ComponentFixture<DetailsMeal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsMeal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsMeal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
