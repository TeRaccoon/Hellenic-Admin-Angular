import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-profit-loss-widget',
  templateUrl: './profit-loss-widget.component.html',
  styleUrls: ['./profit-loss-widget.component.scss'],
})
export class ProfitLossWidgetComponent {
  startDate: Date | null = null;
  endDate: Date | null = null;

  constructor(private dataService: DataService) {}

  async calculateProfitLoss() {
    if (this.startDate != null && this.endDate != null) {
      let profitLossData = await this.dataService.processGet(
        'profit-loss',
        {
          'start-date': this.startDate,
          'end-date': this.endDate,
        },
        true
      );

      profitLossData.forEach((item: any) => {
        for (const key in item) {
          if (item[key] == null) {
            item[key] = 0;
          }
          item[key] = item[key].toLocaleString('en-US', {
            style: 'currency',
            currency: 'GBP',
          });
        }
      });

      this.dataService.storeData({
        Data: profitLossData,
        Headers: [
          'Sales Revenue',
          'Cost of Sales',
          'Gross Profit',
          'Expenses',
          'Net Profit',
        ],
      });
    }
  }
}
