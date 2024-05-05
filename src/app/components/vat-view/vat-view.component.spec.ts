import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VatViewComponent } from './vat-view.component';

describe('VatViewComponent', () => {
  let component: VatViewComponent;
  let fixture: ComponentFixture<VatViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VatViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VatViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
