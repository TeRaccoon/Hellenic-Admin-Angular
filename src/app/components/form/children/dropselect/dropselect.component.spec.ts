import { ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DropselectComponent } from './dropselect.component';

describe('DropselectComponent', () => {
  let component: DropselectComponent;
  let fixture: ComponentFixture<DropselectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DropselectComponent],
      imports: [FontAwesomeModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DropselectComponent);
    component = fixture.componentInstance;

    component.replacementData = [
      { id: 1, replacement: 'Test 1' },
      { id: 2, replacement: 'Test 2' },
    ];
    component.selectData = '';
    component.disabled = false;
    component.class = 'input-class';
    component.field = 'name';
    component.key = 'id';
    component.alternative = false;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter data and emit if only one result matches', (done) => {
    const mockData = [
      { id: 1, replacement: 'THEBIGCHEESE' },
      { id: 2, replacement: 'Martin' },
    ];

    component.replacementData = mockData;
    component.text = false;
    component.field = 'name';
    component.key = 'productId';
    component.alternative = false;

    fixture.detectChanges();
    component.ngOnInit();

    spyOn(component, 'updateSelectedReplacementDataFromKey');

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
    inputEl.value = 'THE';
    inputEl.dispatchEvent(new Event('input'));

    setTimeout(() => {
      expect(component.updateSelectedReplacementDataFromKey).toHaveBeenCalledWith(
        1,
        'THEBIGCHEESE',
        'productId',
        'name',
        false
      );
      done();
    }, 800);
  });
});
