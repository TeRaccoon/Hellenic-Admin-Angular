import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicedItemsWidgetComponent } from './invoiced-items-widget.component';

describe('InvoicedItemsWidgetComponent', () => {
  let component: InvoicedItemsWidgetComponent;
  let fixture: ComponentFixture<InvoicedItemsWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoicedItemsWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InvoicedItemsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
