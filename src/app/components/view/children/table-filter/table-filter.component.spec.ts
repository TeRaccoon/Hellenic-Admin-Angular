import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TableFilterComponent } from './table-filter.component';

describe('TableFilterComponent', () => {
  let component: TableFilterComponent;
  let fixture: ComponentFixture<TableFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableFilterComponent],
      imports: [HttpClientTestingModule, FontAwesomeModule, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TableFilterComponent);
    component = fixture.componentInstance;

    component.filter = {
      displayColumn: ['Test1', 'Test2'],
      column: [
        {
          column: 'test1',
          filter: 'test',
          caseSensitive: false,
        },
      ],
      columnDate: [],
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
