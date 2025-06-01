import { ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FileUploadComponent } from './file-upload.component';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FileUploadComponent],
      imports: [FontAwesomeModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;

    component.file = new File(['file content'], 'test-file.txt', {
      type: 'text/plain',
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show warning if file is null', () => {
    component.file = null;

    fixture.detectChanges();

    const debugLabel = fixture.debugElement.query(By.css('.upload-size-warning'));
    expect(debugLabel).not.toBeNull();

    const label = debugLabel.nativeElement;
    expect(label).toBeTruthy();
  });
});
