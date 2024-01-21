import { Component } from '@angular/core';
import {Chart, ChartConfiguration, ChartItem, registerables} from 'chart.js';
import { DataService } from '../../services/data.service';
import { faWarning } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-item-breakdown-widget',
  templateUrl: './item-breakdown-widget.component.html',
  styleUrls: ['./item-breakdown-widget.component.scss']
})
export class ItemBreakdownWidgetComponent {
  faWarning = faWarning;

  itemData: { [key: string]: any }[] = [];
  
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
    this.dataService.collectData("top-selling-item").subscribe((data: any) => {
      this.itemData[0] = data;
    });
  }
  async getLeastPurchased() {
    this.dataService.collectData("least-purchased-item").subscribe((data: any) => {
      this.itemData[1] = data;
    });
  }
  async getMostIncome() {
    this.dataService.collectData("most-income-item").subscribe((data: any) => {
      this.itemData[2] = data;
    });
  }
  async getLeastIncome() {
    this.dataService.collectData("least-income-item").subscribe((data: any) => {
      this.itemData[3] = data;
    });
  }
}
