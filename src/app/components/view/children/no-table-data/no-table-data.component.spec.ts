import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NoTableDataComponent } from './no-table-data.component';

describe('NoTableDataComponent', () => {
  let component: NoTableDataComponent;
  let fixture: ComponentFixture<NoTableDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NoTableDataComponent],
      imports: [FontAwesomeModule],
    }).compileComponents();

    fixture = TestBed.createComponent(NoTableDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
