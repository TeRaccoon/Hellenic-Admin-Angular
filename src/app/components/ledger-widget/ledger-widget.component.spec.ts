import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerWidgetComponent } from './ledger-widget.component';

describe('LedgerWidgetComponent', () => {
  let component: LedgerWidgetComponent;
  let fixture: ComponentFixture<LedgerWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LedgerWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LedgerWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
