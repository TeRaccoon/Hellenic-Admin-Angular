import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockedItemsWidgetComponent } from './stocked-items-widget.component';

describe('StockedItemsWidgetComponent', () => {
  let component: StockedItemsWidgetComponent;
  let fixture: ComponentFixture<StockedItemsWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockedItemsWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StockedItemsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
