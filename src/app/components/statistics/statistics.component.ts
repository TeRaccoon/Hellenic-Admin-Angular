import { Component } from '@angular/core';
import { StatisticsService } from '../../services/statistics.service';
import dayjs, { Dayjs } from 'dayjs';
import utcPlugin from 'dayjs/plugin/utc';
import { ChartConfiguration, ChartType } from 'chart.js';
dayjs.extend(utcPlugin);

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent {
  averageOrderValueChartData: ChartConfiguration['data'] = {datasets: []};
  averageOrderValueChartOptions: ChartConfiguration['options'];
  averageOrderValueChartType: ChartType = 'line';

  totalOrdersChartData: ChartConfiguration['data'] = {datasets: []};
  totalOrdersChartOptions: ChartConfiguration['options'];
  totalOrdersChartType: ChartType = 'line';

  topSellingProductsChartData: ChartConfiguration['data'] = {datasets: []};
  topSellingProductsChartOptions: ChartConfiguration['options'];
  topSellingProductsChartType: ChartType = 'bar';

  selected: { startDate: Dayjs; endDate: Dayjs; } = {
    startDate: dayjs().startOf('month'),
    endDate: dayjs().endOf('month')
  };

  ranges: any = {
    'Last 7 Days': [dayjs().subtract(6, 'days'), dayjs()],
    'Last 30 Days': [dayjs().subtract(29, 'days'), dayjs()],
    'This Month': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Last Month': [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')],
    'This Year': [dayjs().startOf('year'), dayjs().endOf('year')],
  }

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit() {
    this.buildCharts();
  }

  updateDateRange() {
    this.statisticsService.setDateRange(this.selected);
    this.buildCharts();
  }

  async buildCharts() {
    let monthStart = this.selected.startDate.month();
    let monthEnd = this.selected.endDate.month();
    let year = this.selected.startDate.year();

    //Average order value
    let chartData = await this.statisticsService.buildChart(monthStart, monthEnd, year, this.selected, "average-invoice-value-per-day", "average-invoice-value-per-month", false);
    console.log("🚀 ~ StatisticsComponent ~ buildCharts ~ chartData:", chartData)
    let chartDataset = this.statisticsService.getLineChartData(chartData.data, "Total Value", ['rgb(0, 140, 255)'], chartData.labels);

    this.averageOrderValueChartData = {datasets: [chartDataset.datasets], labels: chartData.labels};
    this.averageOrderValueChartOptions = this.statisticsService.getLineChartOptions(0.5, "Order Value (£)", "Date", false, true, true, chartDataset.labels);

    //Total Orders
    chartData = await this.statisticsService.buildChart(monthStart, monthEnd, year, this.selected, "total-invoices-per-day", "total-invoices-per-month", false);
    chartDataset = this.statisticsService.getLineChartData(chartData.data, "Total Orders", ['rgb(0, 140, 255)'], chartData.labels);

    this.totalOrdersChartData = {datasets: [chartDataset.datasets], labels: chartData.labels};
    this.totalOrdersChartOptions = this.statisticsService.getLineChartOptions(0.5, "Order Amount", "Date", false, false, true, chartData.labels);

    //Top selling products
    chartData = await this.statisticsService.buildChart(monthStart, monthEnd, year, this.selected, "top-selling-item-per-day", "top-selling-item-per-month", true);
    let barChartDataset = this.statisticsService.getBarChartData(chartData.data, "Total Sales", ['rgb(0, 140, 255)'], 10, chartData.labels);
    
    this.topSellingProductsChartData = {labels: barChartDataset.labels, datasets: [barChartDataset.datasets]};
    this.topSellingProductsChartOptions = this.statisticsService.getBarChartOptions("Total Sales", "Item Name", false, false, false, barChartDataset.labels);
  }
}
