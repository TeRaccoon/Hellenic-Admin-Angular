import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { DataService } from '../../services/data.service';
import { MessageFormComponent } from '../message-form/message-form.component';
import { TablelessViewComponent } from './tableless-view.component';

describe('TablelessViewComponent', () => {
  let component: TablelessViewComponent;
  let fixture: ComponentFixture<TablelessViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TablelessViewComponent, MessageFormComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ table: 'testTable' }),
          },
        },
        {
          provide: DataService,
          useValue: {
            getDataObservable: () =>
              of({
                Data: [{ id: 1 }],
                Headers: ['id'],
                columnTypes: { id: 'number' },
                alternativeData: null,
              }),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablelessViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
