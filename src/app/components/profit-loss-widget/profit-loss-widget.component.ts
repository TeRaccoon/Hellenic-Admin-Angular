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

  costs: { cost: { category: string; total: number }[]; total: number } = {
    cost: [],
    total: 0,
  };

  year = new Date().getFullYear();

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

      await this.loadAccount();
    }
  }

  async getData(): Promise<ProfitLossInput> {
    return await this.dataService.processGet('profit-loss', {
      'start-date': this.startDate,
      'end-date': this.endDate,
    });
  }

  async loadAccount() {
    this.costs.cost = await this.dataService.processGet(
      'costs',
      {
        'start-date': this.startDate,
        'end-date': this.endDate,
      },
      true
    );
    this.costs.total = this.costs.cost.reduce(
      (sum, current) => sum + current.total,
      0
    );
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
