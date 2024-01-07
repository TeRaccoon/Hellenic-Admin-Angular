import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceBreakdownWidgetComponent } from './invoice-breakdown-widget.component';

describe('InvoiceBreakdownWidgetComponent', () => {
  let component: InvoiceBreakdownWidgetComponent;
  let fixture: ComponentFixture<InvoiceBreakdownWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceBreakdownWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InvoiceBreakdownWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
