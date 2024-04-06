import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AverageOrderWidgetComponent } from './average-order-widget.component';

describe('AverageOrderWidgetComponent', () => {
  let component: AverageOrderWidgetComponent;
  let fixture: ComponentFixture<AverageOrderWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AverageOrderWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AverageOrderWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
