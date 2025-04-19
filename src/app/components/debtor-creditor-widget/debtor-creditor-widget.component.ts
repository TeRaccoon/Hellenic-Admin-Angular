import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CREDITOR_HEADERS, DEBTOR_CREDITOR_CONFIG, DEBTOR_HEADERS } from './consts';

@Component({
  selector: 'app-debtor-creditor-widget',
  templateUrl: './debtor-creditor-widget.component.html',
  styleUrls: ['./debtor-creditor-widget.component.scss'],
})
export class DebtorCreditorWidgetComponent {
  config = DEBTOR_CREDITOR_CONFIG;

  constructor(private dataService: DataService) { }

  async submitQuery(type: string, startDay: number, endDay: number | null) {
    let debtorCreditorData = await this.dataService.processGet(
      type,
      {
        'start-day': startDay,
        'end-day': endDay,
      },
      true
    );

    this.dataService.storeData({
      Data: debtorCreditorData,
      headers: type === 'debtor' ? DEBTOR_HEADERS : CREDITOR_HEADERS,
      columnTypes: ['string', 'string', 'currency', 'date'],
    });
  }
}
