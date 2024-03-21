import { Component } from '@angular/core';
import {Chart, ChartConfiguration, ChartItem, registerables} from 'chart.js';
import { DataService } from '../../services/data.service';
import { faWarning } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-item-breakdown-widget',
  templateUrl: './item-breakdown-widget.component.html',
  styleUrls: ['./item-breakdown-widget.component.scss']
})
export class ItemBreakdownWidgetComponent {
  faWarning = faWarning;

  itemDataRowA: { [key: string]: any }[] = [];
  itemDataRowB: { [key: string]: any }[] = [];
  
  headers = ["Top Selling", "Least Purchased", "Most Income", "Least Income"];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.getData();
  }

  async getData() {
    await this.getTopSelling();
    await this.getLeastPurchased();
    await this.getMostIncome();
    await this.getLeastIncome();
  }

  async getTopSelling() {
    let topSellingItem = await lastValueFrom(this.dataService.collectData("top-selling-item"));
    if (topSellingItem != null) {
      this.itemDataRowA[0] = topSellingItem;
    }
  }
  async getLeastPurchased() {
    let leastPurchasedItem = await lastValueFrom(this.dataService.collectData("least-purchased-item"));
    if (leastPurchasedItem != null) {
      this.itemDataRowA[1] = leastPurchasedItem;
    }
  }
  async getMostIncome() {
    let mostIncomeItem = await lastValueFrom(this.dataService.collectData("most-income-item"));
    if (mostIncomeItem != null) {
      this.itemDataRowB[1] = mostIncomeItem;
    }
  }
  async getLeastIncome() {
    let leastIncomeItem = await lastValueFrom(this.dataService.collectData("least-income-item"));
    if (leastIncomeItem != null) {
      this.itemDataRowB[1] = leastIncomeItem;
    }
  }
}
