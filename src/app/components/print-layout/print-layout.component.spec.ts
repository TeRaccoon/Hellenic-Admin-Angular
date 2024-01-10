import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintLayoutComponent } from './print-layout.component';

describe('PrintLayoutComponent', () => {
  let component: PrintLayoutComponent;
  let fixture: ComponentFixture<PrintLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrintLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
