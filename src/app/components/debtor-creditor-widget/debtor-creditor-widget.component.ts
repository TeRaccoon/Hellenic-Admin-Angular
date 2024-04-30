import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-debtor-creditor-widget',
  templateUrl: './debtor-creditor-widget.component.html',
  styleUrls: ['./debtor-creditor-widget.component.scss']
})
export class DebtorCreditorWidgetComponent {
  tableData: any[] = [];

  constructor(private dataService: DataService) {}

  async submitQuery(type: string, startDay: number, endDay: number | null) {
    let debtorCreditorData = await lastValueFrom(this.dataService.collectDataComplex(type, {'start-day': startDay, 'end-day': endDay}));
    debtorCreditorData = Array.isArray(debtorCreditorData) ? debtorCreditorData : [debtorCreditorData];
    this.dataService.storeData({'Data': debtorCreditorData, 
    'Headers': ['Reference', 'Account Name', type == 'debtor' ? 'Total Debt' : 'Total Credit', 'Last Transaction'], 'columnType': ['string', 'string', 'currency', 'date']});
  }
}
