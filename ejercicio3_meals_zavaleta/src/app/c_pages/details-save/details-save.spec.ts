import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsSave } from './details-save';

describe('DetailsSave', () => {
  let component: DetailsSave;
  let fixture: ComponentFixture<DetailsSave>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsSave]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsSave);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
