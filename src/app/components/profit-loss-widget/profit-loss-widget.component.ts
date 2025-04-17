import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import {
  Cost,
  ProfitLossInput,
  Totals,
} from '../../common/types/profit-loss/types';
import { faPrint } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-profit-loss-widget',
  templateUrl: './profit-loss-widget.component.html',
  styleUrls: ['./profit-loss-widget.component.scss'],
})
export class ProfitLossWidgetComponent {
  faPrint = faPrint;

  startDate: Date | null = null;
  endDate: Date | null = null;

  income: Cost = {
    cost: [],
    total: 0,
  };

  costs: Cost = {
    cost: [],
    total: 0,
  };

  expenses: Cost = {
    cost: [],
    total: 0,
  };

  tax: Cost = {
    cost: [],
    total: 0,
  };

  totals: Totals = {
    income: 0,
    costs: 0,
    expenses: 0,
    tax: 0,
  };

  documentVisible = false;

  year = new Date().getFullYear();

  constructor(private dataService: DataService) { }

  async calculateProfitLoss() {
    if (this.startDate != null && this.endDate != null) {
      await this.loadAccount();

      this.documentVisible = true;
    }
  }

  async getData(): Promise<ProfitLossInput> {
    return await this.dataService.processGet('profit-loss', {
      'start-date': this.startDate,
      'end-date': this.endDate,
    });
  }

  async loadAccount() {
    await this.loadIncome();
    await this.loadCosts();
    await this.loadExpenses();
    await this.loadTax();
  }

  async loadIncome() {
    this.income.cost = await this.dataService.processGet(
      'income',
      {
        'start-date': this.startDate,
        'end-date': this.endDate,
      },
      true
    );
    this.income.total = this.income.cost.reduce(
      (sum, current) => sum + current.total,
      0
    );

    this.totals.income = this.income.total;
  }

  async loadCosts() {
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

    this.totals.costs = this.income.total - this.costs.total;
  }

  async loadExpenses() {
    this.expenses.cost = await this.dataService.processGet(
      'expenses',
      {
        'start-date': this.startDate,
        'end-date': this.endDate,
      },
      true
    );
    this.expenses.total = this.expenses.cost.reduce(
      (sum, current) => sum + current.total,
      0
    );

    this.totals.expenses = this.totals.costs - this.expenses.total;
  }

  async loadTax() {
    this.tax.cost = await this.dataService.processGet(
      'tax',
      {
        'start-date': this.startDate,
        'end-date': this.endDate,
      },
      true
    );
    this.tax.total = this.tax.cost.reduce(
      (sum, current) => sum + current.total,
      0
    );

    this.totals.tax = this.totals.expenses - this.tax.total;
  }

  print() {
    window.print();
  }
}
