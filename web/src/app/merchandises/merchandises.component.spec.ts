import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchandisesComponent } from './merchandises.component';

describe('MerchandisesComponent', () => {
  let component: MerchandisesComponent;
  let fixture: ComponentFixture<MerchandisesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchandisesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchandisesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
