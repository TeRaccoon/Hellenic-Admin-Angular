import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-ledger-widget',
  templateUrl: './ledger-widget.component.html',
  styleUrls: ['./ledger-widget.component.scss'],
})
export class LedgerWidgetComponent {
  startDate: string = '';
  endDate: string = '';
  searched = false;
  hasError = false;

  balanceData: any[] = [];

  constructor(private dataService: DataService) {}

  async calculateTrialBalance() {
    if (this.startDate != '' && this.endDate != '') {
      let accountBalanceData = await this.dataService.processGet(
        'account-balances',
        {
          'start-date': this.startDate,
          'end-date': this.endDate,
        }
      );
      this.balanceData = accountBalanceData;
      this.searched = true;
    } else {
      this.hasError = true;
    }
  }
}
