import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemBreakdownWidgetComponent } from './item-breakdown-widget.component';

describe('ItemBreakdownWidgetComponent', () => {
  let component: ItemBreakdownWidgetComponent;
  let fixture: ComponentFixture<ItemBreakdownWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemBreakdownWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ItemBreakdownWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
