import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { VAT_RETURN } from '../../common/types/table-widget/const';
import { TableData, VatData } from '../../common/types/table-widget/types';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-table-widget',
  templateUrl: './table-widget.component.html',
  styleUrl: './table-widget.component.scss',
})
export class TableWidgetComponent implements OnInit, OnDestroy {
  private readonly subscriptions = new Subscription();

  startDate = '';
  endDate = '';
  tableName = '';
  tableData: TableData = {
    headers: [],
    query: '',
    displayDateRange: true,
    columnTypes: [],
    alternativeData: null,
  };

  vatReturnHistory: any[] = [];
  vatHistory: string[] = [];
  selectedVatGroup = '';

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.route.queryParams.subscribe((params) => {
        this.tableName = params['table'];
        this.selectTable();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  selectTable() {
    switch (this.tableName) {
      case 'vat-returns':
        this.loadVATData();
        break;
    }
  }

  async loadVATData() {
    this.tableData = VAT_RETURN;

    this.loadVATGroups();
  }

  async loadVATGroups() {
    this.vatHistory = await this.dataService.processGet('vat-groups');
  }

  async loadVATReturns() {
    this.vatReturnHistory = await this.dataService.processGet('vat-history-by-group-id', {
      filter: this.selectedVatGroup,
    });
  }

  async collectData() {
    if (this.startDate != '' && this.endDate != '') {
      let data: VatData[] = await this.dataService.processGet(
        this.tableData.query,
        {
          'start-date': this.startDate,
          'end-date': this.endDate,
        },
        true
      );

      if (this.tableName == 'vat-returns') {
        data = this.vatReturns(data);
      }

      this.tableData!.alternativeData['values'] = [
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
      this.tableData!.alternativeData['period'] = this.getPeriod();
      this.tableData!.alternativeData['date'] = this.startDate;

      this.dataService.storeData({
        Data: data,
        Headers: this.tableData.headers,
        columnTypes: this.tableData.columnTypes,
        alternativeData: this.tableData.alternativeData,
      });
    }
  }

  getPeriod() {
    const endDate = new Date(this.endDate);

    const month = endDate.toLocaleString('default', { month: 'long' });
    const year = endDate.getFullYear();

    return `${month}-${year}`;
  }

  vatReturns(vatData: VatData[]) {
    vatData[0].liability =
      Number(Number(vatData[0].output_vat).toFixed(2)) - Number(Number(vatData[0].input_vat).toFixed(2));
    return vatData;
  }
}
