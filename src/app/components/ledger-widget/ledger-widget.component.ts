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
  searched = false;
  hasError = false;

  balanceData: any[] = [];

  constructor(private dataService: DataService) {}

  calculateTrialBalance() {
    if (this.startDate != '' && this.endDate != '') {
      this.dataService.collectDataComplex('account-balances', {'start-date': this.startDate, 'end-date': this.endDate}).subscribe((data: any) => {
        this.balanceData = data;
        this.searched = true;
      });
    }
    else {
      this.hasError = true;
    }
  }
}
