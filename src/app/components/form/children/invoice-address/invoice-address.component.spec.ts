import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceAddressComponent } from './invoice-address.component';

describe('InvoiceAddressComponent', () => {
  let component: InvoiceAddressComponent;
  let fixture: ComponentFixture<InvoiceAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvoiceAddressComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InvoiceAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
