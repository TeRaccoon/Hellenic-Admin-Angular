import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericSearcherComponent } from './generic-searcher.component';

describe('GenericSearcherComponent', () => {
  let component: GenericSearcherComponent;
  let fixture: ComponentFixture<GenericSearcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericSearcherComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenericSearcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
