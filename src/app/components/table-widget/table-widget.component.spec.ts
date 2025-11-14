import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Routes } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { FormsModule } from '@angular/forms';
import { TableWidgetComponent } from './table-widget.component';

describe('TableWidgetComponent', () => {
  let fixture: ComponentFixture<TableWidgetComponent>;

  const routes: Routes = [{ path: '', component: TableWidgetComponent }];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableWidgetComponent],
      imports: [FormsModule],
      providers: [provideHttpClient(), provideRouter(routes)],
    }).compileComponents();

    fixture = TestBed.createComponent(TableWidgetComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should navigate to component route', async () => {
    const harness = await RouterTestingHarness.create();
    const instance = await harness.navigateByUrl('/');
    expect(instance).toBeTruthy();
  });
});
