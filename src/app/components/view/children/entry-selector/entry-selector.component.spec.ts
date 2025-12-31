import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrySelectorComponent } from './entry-selector.component';

describe('EntrySelectorComponent', () => {
  let component: EntrySelectorComponent;
  let fixture: ComponentFixture<EntrySelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntrySelectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EntrySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
