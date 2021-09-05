import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposeComponent } from './propose.component';

describe('ProposeComponent', () => {
  let component: ProposeComponent;
  let fixture: ComponentFixture<ProposeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProposeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
