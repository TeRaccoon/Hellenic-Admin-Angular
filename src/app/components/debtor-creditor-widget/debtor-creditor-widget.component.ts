import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { COLUMN_TYPES, CONFIG, CREDITOR_HEADERS, DEBTOR_HEADERS } from './consts';

@Component({
  selector: 'app-debtor-creditor-widget',
  templateUrl: './debtor-creditor-widget.component.html',
  styleUrls: ['./debtor-creditor-widget.component.scss'],
})
export class DebtorCreditorWidgetComponent {
  config = CONFIG;

  constructor(private dataService: DataService) {}

  async submitQuery(type: string, startDay: number, endDay: number | null) {
    const debtorCreditorData = await this.dataService.processGet(
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
      columnTypes: COLUMN_TYPES,
    });
  }
}
