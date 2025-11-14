import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { TableTypeMap } from '../../../../common/types/tables';
import { TableDataComponent } from './table-data.component';

describe('TableDataComponent', () => {
  let component: TableDataComponent<keyof TableTypeMap>;
  let fixture: ComponentFixture<TableDataComponent<keyof TableTypeMap>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableDataComponent],
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of([{ id: 1 }]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TableDataComponent);
    component = fixture.componentInstance;

    component.item = { id: 1, status: 'Complete' };
    component.column = 'id';
    component.dataTypes = ['text', 'file', 'date', "enum('No','Yes')"];
    component.columnIndex = 0;
    component.imageUrlBase = '/assets/images/';
    component.tableName = 'invoices';

    fixture.detectChanges();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
