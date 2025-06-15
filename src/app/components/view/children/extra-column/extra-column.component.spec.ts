import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraColumnComponent } from './extra-column.component';

describe('ExtraColumnComponent', () => {
  let component: ExtraColumnComponent;
  let fixture: ComponentFixture<ExtraColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtraColumnComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExtraColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
