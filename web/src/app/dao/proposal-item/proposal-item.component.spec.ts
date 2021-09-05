import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalItemComponent } from './proposal-item.component';

describe('ProposalItemComponent', () => {
  let component: ProposalItemComponent;
  let fixture: ComponentFixture<ProposalItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProposalItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
