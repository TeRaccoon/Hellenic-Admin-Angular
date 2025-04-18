import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierInvoiceItemFormControlsComponent } from './supplier-invoice-item-form-controls.component';

describe('SupplierInvoiceItemFormControlsComponent', () => {
  let component: SupplierInvoiceItemFormControlsComponent;
  let fixture: ComponentFixture<SupplierInvoiceItemFormControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierInvoiceItemFormControlsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupplierInvoiceItemFormControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
