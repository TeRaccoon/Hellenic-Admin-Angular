import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { QuillModule } from 'ngx-quill';
import { DocumentUploadWidgetComponent } from '../document-upload-widget/document-upload-widget.component';
import { MessageFormComponent } from '../message-form/message-form.component';
import { NewsletterWidgetComponent } from '../newsletter-widget/newsletter-widget.component';
import { SettingsComponent } from './settings.component';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsComponent, NewsletterWidgetComponent, DocumentUploadWidgetComponent, MessageFormComponent],
      imports: [HttpClientTestingModule, QuillModule.forRoot(), FontAwesomeModule, FormsModule, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
