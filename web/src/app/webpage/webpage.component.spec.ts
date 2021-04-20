import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebpageComponent } from './webpage.component';

describe('WebpageComponent', () => {
  let component: WebpageComponent;
  let fixture: ComponentFixture<WebpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebpageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
