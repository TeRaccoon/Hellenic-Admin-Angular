import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from '../../services/form.service';

@Component({
  selector: 'app-tableless-view',
  templateUrl: './tableless-view.component.html',
  styleUrls: ['./tableless-view.component.scss']
})
export class TablelessViewComponent {
  tableName = '';
  tableData: any[] | null = null;
  tableHeaders: any[] = [];
  columnTypes: any[] = [];
  alternativeData: any;
  dataCollected = false;

  //VAT Return
  page = 1;
  vatReturnForm: FormGroup;
  controlIndex = -1;

  constructor(private formService: FormService, private route: ActivatedRoute, private dataService: DataService, private fb: FormBuilder, private router: Router) {
    this.vatReturnForm = this.fb.group({
      'vat-due-previous': ['0.00'],
      'vat-due-new': ['0.00'],
      'vat-due-fuel': ['0.00'],
      'vat-reclaimed-previous': ['0.00'],
      'vat-reclaimed-new': ['0.00'],
      'total-sales-previous': ['0.00'],
      'total-sales-new': ['0.00'],
      'total-sales-fuel': ['0.00'],
      'total-purchases-previous': ['0.00'],
      'total-purchases-new': ['0.00'],
      'notes': ['', Validators.required]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.tableName = params['table'];
      this.tableData = null;
      this.tableHeaders = [];
      this.alternativeData = null;
    });

    this.dataService.getDataObservable().subscribe((data: any) => {
      this.tableData = data.Data;
      this.tableHeaders = data.Headers;
      this.columnTypes = data.columnTypes;
      this.alternativeData = data.alternativeData;
      this.dataCollected = true;
    });
  }
  
  getObjectKeys(obj: object): string[] {
    return Object.keys(obj);
  }

  shouldDisplayInput(column: number, row: number) {
    if (row == 0 && column == 0) {
      this.controlIndex = -1;
    }

    if (row == 0) {
      this.controlIndex++;
      return true;
    }

    if (row == 3 && (column == 0 || column == 1)) {
      this.controlIndex++;
      return true
    }

    if (row == 5) {
      this.controlIndex++;
      return true;
    }

    if (row == 6 && (column == 0 || column == 1)) {
      this.controlIndex++;
      return true;
    }

    return false;
  }

  getFormControlName() {
    let controlIndex = this.controlIndex;
    return Object.keys(this.vatReturnForm.controls)[controlIndex];
  }
  
  getTimes(n: number): number[] {
    return Array(n);
  }

  getRowTotal(row: number) {
    if (row == 0) {
      return Number(this.alternativeData.values[row]) + Number(this.vatReturnForm.controls[Object.keys(this.vatReturnForm.controls)[0]]?.value) + Number(this.vatReturnForm.controls[Object.keys(this.vatReturnForm.controls)[1]]?.value) + Number(this.vatReturnForm.controls[Object.keys(this.vatReturnForm.controls)[2]]?.value); 
    }

    if (row == 3) {
      return Number(this.alternativeData.values[row]) + Number(this.vatReturnForm.controls[Object.keys(this.vatReturnForm.controls)[3]]?.value) + Number(this.vatReturnForm.controls[Object.keys(this.vatReturnForm.controls)[4]]?.value);
    }

    if (row == 5) {
      return Number(this.alternativeData.values[row]) + Number(this.vatReturnForm.controls[Object.keys(this.vatReturnForm.controls)[5]]?.value) + Number(this.vatReturnForm.controls[Object.keys(this.vatReturnForm.controls)[6]]?.value) + Number(this.vatReturnForm.controls[Object.keys(this.vatReturnForm.controls)[7]]?.value);
    }

    if (row == 6) {
      return Number(this.alternativeData.values[row]) + Number(this.vatReturnForm.controls[Object.keys(this.vatReturnForm.controls)[8]]?.value) + Number(this.vatReturnForm.controls[Object.keys(this.vatReturnForm.controls)[9]]?.value);
    }

    return Number(this.alternativeData.values[row]);
  }

  submitVATReturn() {
    if (this.vatReturnForm.valid) {
      this.dataService.storeData(
        {
          labels: this.alternativeData.altText,
          originalValues: this.alternativeData.values,
          previousAdjustments: [this.vatReturnForm.get('vat-due-previous')?.value, 0, 0, this.vatReturnForm.get('vat-reclaimed-previous')?.value, 0, this.vatReturnForm.get('total-sales-previous')?.value, this.vatReturnForm.get('total-purchases-previous')?.value, '', ''],
          newAdjustments: [this.vatReturnForm.get('vat-due-new')?.value, 0, 0, this.vatReturnForm.get('vat-reclaimed-new')?.value, 0, this.vatReturnForm.get('total-sales-new')?.value, this.vatReturnForm.get('vat-purchases-new')?.value, '', ''],
          fuelScaleCharge: [this.vatReturnForm.get('vat-due-fuel')?.value, 0, 0, 0, 0, this.vatReturnForm.get('total-sales-fuel')?.value, 0, 0, 0],
          total: Array.from({ length: 9 }, (_, row) => this.getRowTotal(row)),
          notes: this.vatReturnForm.get('notes')?.value,
          period: this.alternativeData.period
        }
      );
      this.router.navigate(['/print/vat']);
    } else {
      this.formService.setMessageFormData({ title: 'Warning', message: 'Please fill out all the required fields before continuing'});
      this.formService.showMessageForm();
    }
  }
}

