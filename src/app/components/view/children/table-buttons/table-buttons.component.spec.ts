import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TableButtonsComponent } from './table-buttons.component';

describe('TableButtonsComponent', () => {
  let component: TableButtonsComponent;
  let fixture: ComponentFixture<TableButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableButtonsComponent],
      imports: [HttpClientTestingModule, FontAwesomeModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TableButtonsComponent);
    component = fixture.componentInstance;

    component.selectedRows = [];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
