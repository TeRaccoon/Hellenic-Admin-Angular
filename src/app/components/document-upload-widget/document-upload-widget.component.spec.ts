import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentUploadWidgetComponent } from './document-upload-widget.component';

describe('DocumentUploadWidgetComponent', () => {
  let component: DocumentUploadWidgetComponent;
  let fixture: ComponentFixture<DocumentUploadWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentUploadWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DocumentUploadWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
