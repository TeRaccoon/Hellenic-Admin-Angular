import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsToReconcileComponent } from './documents-to-reconcile.component';

describe('DocumentsToReconcileComponent', () => {
  let component: DocumentsToReconcileComponent;
  let fixture: ComponentFixture<DocumentsToReconcileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentsToReconcileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DocumentsToReconcileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
