import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebtorCreditorWidgetComponent } from './debtor-creditor-widget.component';

describe('DebtorCreditorWidgetComponent', () => {
  let component: DebtorCreditorWidgetComponent;
  let fixture: ComponentFixture<DebtorCreditorWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DebtorCreditorWidgetComponent],
      imports: [HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DebtorCreditorWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
