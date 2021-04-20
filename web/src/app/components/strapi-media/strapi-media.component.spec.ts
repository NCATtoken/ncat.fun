import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrapiMediaComponent } from './strapi-media.component';

describe('StrapiMediaComponent', () => {
  let component: StrapiMediaComponent;
  let fixture: ComponentFixture<StrapiMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrapiMediaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrapiMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
