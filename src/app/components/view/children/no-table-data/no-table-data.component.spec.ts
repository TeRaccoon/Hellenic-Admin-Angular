import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoTableDataComponent } from './no-table-data.component';

describe('NoTableDataComponent', () => {
  let component: NoTableDataComponent;
  let fixture: ComponentFixture<NoTableDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoTableDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NoTableDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
