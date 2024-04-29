import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { lastValueFrom } from 'rxjs';
import { FormService } from '../../services/form.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-table-widget',
  templateUrl: './table-widget.component.html',
  styleUrl: './table-widget.component.scss'
})
export class TableWidgetComponent {
  startDate: string = '';
  endDate: string = '';
  tableName: string = '';
  headers: any[] = [];
  query = "";

  displayDateRange = false;

  constructor(private dataService: DataService, private formService: FormService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.tableName = params['table'];
      this.selectTable();
    });
  }

  selectTable() {
    switch(this.tableName) {
      case "vat-returns":
        this.headers = ["Total Sales", "Output VAT", "Total Expenses", "Input VAT", "VAT Liability"];
        this.query = "vat-data";
        this.displayDateRange = true;
        break;
    }
  }

  async collectData() {
    if (this.startDate != '' && this.endDate != '') {
      let data = await lastValueFrom(this.dataService.collectDataComplex(this.query, {'start-date': this.startDate, 'end-date': this.endDate}));

      if (this.tableName == "vat-returns") {
        data = this.vatReturns(data);
      }

      data = Array.isArray(data) ? data : [data];

      data.forEach((item: any) => {
        for (const key in item) {
          if (item[key] == null) {
            item[key] = 0;
          }
          item[key] = item[key].toLocaleString('en-US', { style: 'currency', currency: 'GBP' });
        }
      });
      
      this.dataService.storeData({'Data': data,
      'Headers': this.headers});
    }
  }

  vatReturns(vatData: any) {
    vatData.liability = vatData.output_vat - vatData.input_vat;
    return vatData;
  }
}
