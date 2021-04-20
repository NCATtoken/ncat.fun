import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoldComponent } from './fold.component';

describe('FoldComponent', () => {
  let component: FoldComponent;
  let fixture: ComponentFixture<FoldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FoldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
