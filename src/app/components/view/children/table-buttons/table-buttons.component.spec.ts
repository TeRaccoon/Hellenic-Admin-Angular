import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableButtonsComponent } from './table-buttons.component';

describe('TableButtonsComponent', () => {
  let component: TableButtonsComponent;
  let fixture: ComponentFixture<TableButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableButtonsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
