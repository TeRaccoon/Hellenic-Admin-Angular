import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-ledger-widget',
  templateUrl: './ledger-widget.component.html',
  styleUrls: ['./ledger-widget.component.scss']
})
export class LedgerWidgetComponent {
  startDate: string = '';
  endDate: string = '';

  constructor(private dataService: DataService) {}

  calculateTrialBalance() {
    if (this.startDate != '' && this.endDate != '') {
      this.dataService.collectData('account-balances', {'start-date': this.startDate, 'end-date': this.endDate}).subscribe((data: any) => {
      });
    }
  }
}
