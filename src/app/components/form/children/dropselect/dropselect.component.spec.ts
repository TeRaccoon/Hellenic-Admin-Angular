import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropselectComponent } from './dropselect.component';

describe('DropselectComponent', () => {
  let component: DropselectComponent;
  let fixture: ComponentFixture<DropselectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropselectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DropselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
