import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DataService } from '../../services/data.service';
import { VatViewComponent } from './vat-view.component';

describe('VatViewComponent', () => {
  let component: VatViewComponent;
  let fixture: ComponentFixture<VatViewComponent>;
  let mockDataService: jasmine.SpyObj<DataService>;

  beforeEach(async () => {
    mockDataService = jasmine.createSpyObj('DataService', ['getData']);
    mockDataService.getData.and.returnValue({
      labels: ['label'],
      originalValues: [1],
      previousAdjustments: [1],
      newAdjustments: [1],
      fuelScaleCharge: [1],
      total: [3],
    });

    await TestBed.configureTestingModule({
      declarations: [VatViewComponent],
      imports: [HttpClientTestingModule, FontAwesomeModule],
      providers: [{ provide: DataService, useValue: mockDataService }],
    }).compileComponents();

    fixture = TestBed.createComponent(VatViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
