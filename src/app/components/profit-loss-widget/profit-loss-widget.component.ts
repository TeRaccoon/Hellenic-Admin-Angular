import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-profit-loss-widget',
  templateUrl: './profit-loss-widget.component.html',
  styleUrls: ['./profit-loss-widget.component.scss']
})
export class ProfitLossWidgetComponent {
  startDate: string = '';
  endDate: string = '';

  constructor(private dataService: DataService) {}

  async calculateProfitLoss() {
    if (this.startDate != '' && this.endDate != '') {
      let profitLossData = await lastValueFrom(this.dataService.collectDataComplex('profit-loss', {'start-date': this.startDate, 'end-date': this.endDate}));
      profitLossData = Array.isArray(profitLossData) ? profitLossData : [profitLossData];

      profitLossData.forEach((item: any) => {
        for (const key in item) {
          item[key] = item[key].toLocaleString('en-US', { style: 'currency', currency: 'GBP' });
        }
      });
      
      this.dataService.storeData({'Data': profitLossData,
      'Headers': ['Sales Revenue', 'Cost of Sales', 'Gross Profit', 'Expenses', 'Net Profit']});
    }
  }
}
