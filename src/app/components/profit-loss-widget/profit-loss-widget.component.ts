import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-profit-loss-widget',
  templateUrl: './profit-loss-widget.component.html',
  styleUrls: ['./profit-loss-widget.component.scss']
})
export class ProfitLossWidgetComponent {
  startDate: string = '';
  endDate: string = '';

  constructor(private dataService: DataService) {}

  calculateProfitLoss() {
    if (this.startDate != '' && this.endDate != '') {
      this.dataService.collectDataComplex('profit-loss', {'start-date': this.startDate, 'end-date': this.endDate}).subscribe((data: any) => {
        var retrievedData = data;
        if (!Array.isArray(retrievedData)) {
          retrievedData = [retrievedData];
        }
        console.log(retrievedData);
        retrievedData.forEach((item: any) => {
          for (const key in item) {
            item[key] = item[key].toLocaleString('en-US', { style: 'currency', currency: 'GBP' });
          }
        });
        console.log(retrievedData);
        this.dataService.storeData({'Data': retrievedData,
        'Headers': ['Sales Revenue', 'Cost of Sales', 'Gross Profit', 'Expenses', 'Net Profit']});
      });
    }
  }
}
