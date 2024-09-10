import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';

type ProfitLossInput = {
  income: number;
  costs: number;
  expenses: number;
};

type ProfitLossData = ProfitLossInput & {
  grossProfit: number;
  netProfit: number;
};

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
      let profitLossInput: ProfitLossInput = await this.getData();
      let profitLossData: ProfitLossData = this.mapData(profitLossInput);
      this.dataService.storeData({
        Data: [profitLossData],
        Headers: [
          'Sales Revenue',
          'Cost of Sales',
          'Gross Profit',
          'Expenses',
          'Net Profit',
        ],
        columnTypes: [
          'currency',
          'currency',
          'currency',
          'currency',
          'currency',
        ],
      });
    }
  }

  async getData(): Promise<ProfitLossInput> {
    return await this.dataService.processGet('profit-loss', {
      'start-date': this.startDate,
      'end-date': this.endDate,
    });
  }

  mapData(profitLossData: ProfitLossInput): ProfitLossData {
    for (let key of Object.keys(profitLossData)) {
      profitLossData[key as keyof ProfitLossInput] =
        Number(profitLossData[key as keyof ProfitLossInput]) ?? 0;
    }

    return {
      income: profitLossData.income,
      costs: profitLossData.costs,
      grossProfit: profitLossData.income - profitLossData.costs,
      expenses: profitLossData.expenses,
      netProfit:
        profitLossData.income - profitLossData.costs - profitLossData.expenses,
    };
  }
}
