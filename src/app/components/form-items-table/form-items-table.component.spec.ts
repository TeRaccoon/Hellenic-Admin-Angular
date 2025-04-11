import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormItemsTableComponent } from './form-items-table.component';

describe('FormItemsTableComponent', () => {
  let component: FormItemsTableComponent;
  let fixture: ComponentFixture<FormItemsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormItemsTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormItemsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
