import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebpagesComponent } from './webpages.component';

describe('WebpagesComponent', () => {
  let component: WebpagesComponent;
  let fixture: ComponentFixture<WebpagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebpagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebpagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
