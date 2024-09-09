import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { lastValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-table-widget',
  templateUrl: './table-widget.component.html',
  styleUrl: './table-widget.component.scss',
})
export class TableWidgetComponent {
  startDate: string = '';
  endDate: string = '';
  tableName: string = '';
  headers: any[] = [];
  columnTypes: string[] = [];
  alternativeData: any;
  query = '';

  vatReturnHistory: any[] = [];
  vatHistory: string[] = [];
  selectedVatGroup: string = '';

  displayDateRange = false;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.tableName = params['table'];
      this.selectTable();
    });
  }

  selectTable() {
    switch (this.tableName) {
      case 'vat-returns':
        this.loadVATData();
        break;
    }
  }

  async loadVATData() {
    this.headers = [
      'Total Sales',
      'Output VAT',
      'Total Expenses',
      'Input VAT',
      'VAT Liability',
    ];
    this.query = 'vat-data';
    this.displayDateRange = true;
    this.columnTypes = [
      'currency',
      'currency',
      'currency',
      'currency',
      'currency',
    ];
    this.alternativeData = {
      text: [
        'VAT due in this period on sales and other outputs',
        'VAT due in this period on intra-community acquisitions of goods made in Northern Ireland from EU Member States',
        'Total VAT due (the sum of boxes 1 and 2)',
        'VAT reclaimed in this period on purchases and other inputs (including acquisitions in the EC)',
        'Net VAT to be paid to HMRC or reclaimed by you (Difference between boxes 3 and 4)',
        'Total value of sales and all other outputs excluding any VAT (Include your box 8 figure)',
        'Total value of purchases and all other inputs excluding VAT (Include your box 9 figure)',
        'Total value of intra-community dispatches of goods and related costs (excluding VAT) from Northern Ireland to EU Member States',
        'Total value of intra-community acquisitions of goods and related costs (excluding VAT) made in Northern Ireland from EU Member States',
      ],
      altText: [
        'VAT due and other outputs',
        'VAT due on intra-community acquisitions of goods made in Northern Ireland from EU Member States',
        'Total VAT due',
        'VAT reclaimed on purchases and other inputs including EC acquisitions',
        'Net VAT due',
        'Total value of sales and other outputs including EC supplies',
        'Total value of purchases and other inputs including EC acquisitions',
        'Total value of intra-community dispatches from Northern Ireland to EU Member States',
        'Total value of intra-community acquisitions made in Northern Ireland from EU Member States',
      ],
    };

    this.loadVATGroups();
  }

  async loadVATGroups() {
    this.vatHistory = await this.dataService.processGet('vat-groups');
  }

  async loadVATReturns() {
    this.vatReturnHistory = await this.dataService.processGet(
      'vat-history-by-group-id',
      { filter: this.selectedVatGroup }
    );
  }

  async collectData() {
    if (this.startDate != '' && this.endDate != '') {
      let data = await this.dataService.processGet(
        this.query,
        {
          'start-date': this.startDate,
          'end-date': this.endDate,
        },
        true
      );

      if (this.tableName == 'vat-returns') {
        data = this.vatReturns(data);
      }

      this.alternativeData['values'] = [
        data[0].output_vat,
        0,
        data[0].output_vat,
        data[0].input_vat,
        data[0].output_vat - data[0].input_vat,
        data[0].output_total - data[0].output_vat,
        data[0].input_total - data[0].input_vat,
        0,
        0,
      ];
      this.alternativeData['period'] = this.getPeriod();
      this.alternativeData['date'] = this.startDate;

      this.dataService.storeData({
        Data: data,
        Headers: this.headers,
        columnTypes: this.columnTypes,
        alternativeData: this.alternativeData,
      });
    }
  }

  getPeriod() {
    const endDate = new Date(this.endDate);

    const month = endDate.toLocaleString('default', { month: 'long' });
    const year = endDate.getFullYear();

    return `${month}-${year}`;
  }

  vatReturns(vatData: any) {
    vatData.liability = vatData.output_vat - vatData.input_vat;
    return vatData;
  }
}
