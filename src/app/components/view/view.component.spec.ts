import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { of } from 'rxjs';
import { ChangePasswordFormComponent } from '../change-password-form/change-password-form.component';
import { DeleteFormComponent } from '../delete-form/delete-form.component';
import { FilterFormComponent } from '../filter-form/filter-form.component';
import { AddFormComponent } from '../form/add-form/add-form.component';
import { EditFormComponent } from '../form/edit-form/edit-form.component';
import { MessageFormComponent } from '../message-form/message-form.component';
import { WidgetComponent } from '../widget/widget.component';
import { ViewComponent } from './view.component';

describe('ViewComponent', () => {
  let component: ViewComponent;
  let fixture: ComponentFixture<ViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ViewComponent,
        EditFormComponent,
        AddFormComponent,
        DeleteFormComponent,
        MessageFormComponent,
        FilterFormComponent,
        ChangePasswordFormComponent,
        WidgetComponent,
      ],
      imports: [HttpClientTestingModule, FormsModule, FontAwesomeModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of([{ id: 1 }]),
            queryParamMap: of({
              get: (key: string) => {
                if (key === 'someQueryParam') return 'someValue';
                return null;
              },
            }),
            snapshot: {
              queryParamMap: {
                get: (key: string) => {
                  if (key === 'someQueryParam') return 'someValue';
                  return null;
                },
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
