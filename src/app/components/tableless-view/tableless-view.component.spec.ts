import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablelessViewComponent } from './tableless-view.component';

describe('TablelessViewComponent', () => {
  let component: TablelessViewComponent;
  let fixture: ComponentFixture<TablelessViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablelessViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TablelessViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
