import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { DocumentUploadWidgetComponent } from './document-upload-widget.component';

describe('DocumentUploadWidgetComponent', () => {
  let component: DocumentUploadWidgetComponent;
  let fixture: ComponentFixture<DocumentUploadWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentUploadWidgetComponent],
      imports: [HttpClientTestingModule, FormsModule, QuillModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentUploadWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
