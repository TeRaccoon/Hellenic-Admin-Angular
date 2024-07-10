import { Component } from '@angular/core';
import { StatisticsService } from '../../services/statistics.service';
import dayjs from 'dayjs';
import utcPlugin from 'dayjs/plugin/utc';
import {
  chart,
  report,
  filter,
  selectedDate,
} from '../../common/types/statistics/types';
import { chartIcons } from '../../common/icons/chart-icons';
import _ from 'lodash';

dayjs.extend(utcPlugin);

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent {
  icons = chartIcons;

  reportChart: { chart: chart; report: report } | null = null;

  selected: selectedDate = {
    startDate: dayjs().startOf('month'),
    endDate: dayjs().endOf('month'),
  };

  reports: report[] = [];
  charts: chart[] = [];

  ranges: any = {
    'Last 7 Days': [dayjs().subtract(6, 'days'), dayjs()],
    'Last 30 Days': [dayjs().subtract(29, 'days'), dayjs()],
    'This Month': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Last Month': [
      dayjs().subtract(1, 'month').startOf('month'),
      dayjs().subtract(1, 'month').endOf('month'),
    ],
    'This Year': [dayjs().startOf('year'), dayjs().endOf('year')],
  };

  optionsShown: string | boolean = false;
  filters: filter[] = [];
  filteredReportData: any = null;
  headerToSort = { name: '', field: '' };

  constructor(private statisticsService: StatisticsService) {}

  updateDateRange() {
    this.reset();
    this.buildCharts();
  }

  reset() {
    this.charts = [];
    this.reports = [];
    this.reportChart = null;
  }

  async buildCharts() {

    //Average order value
    let statisticsData = await this.statisticsService.buildChart(
      this.selected,
      'average-invoice-value',
      false
    );
    let chartDataset = this.statisticsService.getLineChartData(
      statisticsData.chart.data,
      'Total Value',
      true
    );

    let chartConfigData = {
      datasets: [chartDataset.datasets],
      labels: statisticsData.chart.labels,
    };
    let chartOptions = this.statisticsService.getLineChartOptions(
      0.3,
      'Order Value (£)',
      'Date',
      false,
      true,
      true,
      false,
      statisticsData.chart.labels
    );

    let filteredData = statisticsData.chart.data.filter((data) => data !== 0);

    let average =
    filteredData.length > 0
      ? filteredData.reduce((sum, data) => sum + data, 0) / filteredData.length
      : 0;  

    let subheading = `£${average.toFixed(2)}`;

    this.charts.push({
      data: chartConfigData,
      options: chartOptions,
      type: 'line',
      heading: 'Average Order Value',
      subheading: subheading,
      queries: 'average-invoice-value'
    });

    this.reports.push({
      data: statisticsData.report.data,
      headers: [
        'Date',
        'Gross Sales',
        'Discounts',
        'Orders',
        'Average Order Value',
      ],
      dataTypes: ['text', 'currency', 'percentage', 'int', 'currency'],
      formatted: false,
      filters: [
        { name: 'Hide Empty Rows', predicate: (value: any) => !value.empty },
        {
          name: 'Show Only Empty Rows',
          predicate: (value: any) => value.empty,
        },
      ],
      keys: [
        'dateKey',
        'total',
        'discounts',
        'orders',
        'average',
      ]
    });

    //Total Orders
    statisticsData = await this.statisticsService.buildChart(
      this.selected,
      'total-invoices',
      false
    );
    chartDataset = this.statisticsService.getLineChartData(
      statisticsData.chart.data,
      'Total Orders',
      true
    );

    chartConfigData = {
      datasets: [chartDataset.datasets],
      labels: statisticsData.chart.labels,
    };
    chartOptions = this.statisticsService.getLineChartOptions(
      0.3,
      'Order Amount',
      'Date',
      false,
      false,
      true,
      false,
      statisticsData.chart.labels
    );

    filteredData = statisticsData.chart.data.filter((data) => data !== 0);
    let total = filteredData.length > 0 ? statisticsData.chart.data.reduce((sum, data) => (sum += data)) : 0;

    this.charts.push({
      data: chartConfigData,
      options: chartOptions,
      type: 'line',
      heading: 'Total Orders',
      subheading: total,
      queries: 'total-invoices'
    });

    this.reports.push({
      data: statisticsData.report.data,
      headers: [
        'Date',
        'Orders',
        'Average Units Ordered',
        'Average Order Value',
      ],
      dataTypes: ['text', 'int', 'number', 'currency'],
      formatted: false,
      filters: [
        { name: 'Hide Empty Rows', predicate: (value: any) => !value.empty },
        {
          name: 'Show Only Empty Rows',
          predicate: (value: any) => value.empty,
        },
      ],
      keys: [
        'dateKey',
        'total_orders',
        'average_units_ordered',
        'average_order_value'
      ]
    });

    //Top Selling Products
    statisticsData = await this.statisticsService.buildChart(
      this.selected,
      'top-selling-item',
      true
    );
    let barChartDataset = this.statisticsService.getBarChartData(
      statisticsData.chart.data,
      'Total Sales',
      10
    );

    let barChartConfigData = {
      labels: statisticsData.chart.labels,
      datasets: [barChartDataset.datasets],
    };
    chartOptions = this.statisticsService.getBarChartOptions(
      'Total Sales',
      'Item Name',
      false,
      false,
      false,
      true,
      statisticsData.chart.labels
    );

    this.charts.push({
      data: barChartConfigData,
      options: chartOptions,
      type: 'bar',
      heading: 'Top Selling Products',
      subheading: statisticsData.chart.labels[0],
      queries: 'top-selling-item'
    });

    this.reports.push({
      data: statisticsData.report.data,
      headers: [
        'Item Name',
        'Product Vendor',
        'Product Type',
        'Net Quantity',
        'Gross Sales',
        'Discounts',
        'Net Sales',
        'VAT',
        'Total Sales',
      ],
      dataTypes: [
        'text',
        'text',
        'text',
        'int',
        'int',
        'percentage',
        'currency',
        'currency',
        'currency',
      ],
      formatted: false,
      filters: [
        { name: 'Hide Empty Rows', predicate: (value: any) => !value.empty },
        {
          name: 'Show Only Empty Rows',
          predicate: (value: any) => value.empty,
        },
      ],
      keys: [
        'dateKey',
        'brand',
        'category',
        'net_quantity',
        'gross_sales_before_discount',
        'total_discount',
        'net_sales',
        'vat',
        'total_sales',
      ]
    });

    //Total Invoice Value
    statisticsData = await this.statisticsService.buildChart(
      this.selected,
      'total-invoice-value',
      false
    );
    chartDataset = this.statisticsService.getLineChartData(
      statisticsData.chart.data,
      'Total Value',
      true
    );

    chartConfigData = {
      datasets: [chartDataset.datasets],
      labels: statisticsData.chart.labels,
    };
    chartOptions = this.statisticsService.getLineChartOptions(
      0.3,
      'Total Value',
      'Date',
      false,
      true,
      true,
      false,
      statisticsData.chart.labels
    );

    filteredData = statisticsData.chart.data.filter((data) => data !== 0);
    total = filteredData.length > 0 ? statisticsData.chart.data
      .reduce((sum, data) => (sum += data))
      .toFixed(2) : 0;

    this.charts.push({
      data: chartConfigData,
      options: chartOptions,
      type: 'line',
      heading: 'Total Invoices Value',
      subheading: `£${total}`,
      queries: 'total-invoice-value'
    });
    
    this.reports.push({
      data: statisticsData.report.data,
      headers: [
        'Date',
        'Orders',
        'Discounts',
        'Net Sales',
        'Tax',
        'Gross Sales',
      ],
      dataTypes: [
        'text',
        'int',
        'currency',
        'currency',
        'currency',
        'currency',
      ],
      formatted: false,
      filters: [
        { name: 'Hide Empty Rows', predicate: (value: any) => !value.empty },
        {
          name: 'Show Only Empty Rows',
          predicate: (value: any) => value.empty,
        },
      ],
      keys: [
        'dateKey',
        'total_orders',
        'discounts',
        'net',
        'tax',
        'total'
      ]
    });

    //Store / Cart Conversion Rate
    statisticsData = await this.statisticsService.buildChart(
      this.selected,
      'store-conversion-rate',
      false,
      'pie'
    );
    let pieChartDataset = this.statisticsService.getPieChartData(
      statisticsData.chart.data.flat(),
      'Total',
      ['rgba(255, 99, 132, 0.5)','rgba(54, 162, 235, 0.5)','rgba(255, 205, 86, 0.5)'],
      ['rgb(255, 99, 132)','rgb(54, 162, 235)','rgb(255, 205, 86)']
    );
    
    const pieChartConfigData = {
      datasets: [pieChartDataset.datasets],
      labels: statisticsData.chart.labels,
    };
    
    chartOptions = this.statisticsService.getPieChartOptions(
      true,
      false,
    );

    let sum = pieChartDataset.datasets.data.reduce((sum, n) => sum += n);

    this.charts.push({
      data: pieChartConfigData,
      options: chartOptions,
      type: 'pie',
      heading: 'Online Store Conversion Rate',
      subheading: total,
      queries: 'total-invoices'
    });

    this.reports.push({
      data: statisticsData.report.data,
      headers: [
        'Date',
        'Reached checkout',
        'Added to cart',
        'Payments made',
        'Total sessions'
      ],
      dataTypes: [
        'text',
        'int',
        'int',
        'int',
        'int'
      ],
      formatted: false,
      filters: [
        { name: 'Hide Empty Rows', predicate: (value: any) => !value.empty },
        {
          name: 'Show Only Empty Rows',
          predicate: (value: any) => value.empty,
        },
      ],
      keys: [
        'dateKey',
        'Reached checkout',
        'Added to cart',
        'Payments made',
        'Total sessions',
      ]
    });

    //Recurring Customer
    let chartDatasetArray: any[] = [];
    let reportDatasetArray: any[] = [];
    statisticsData = await this.statisticsService.buildChart(
      this.selected,
      'recurring-customers',
      false
    );
    chartDataset = this.statisticsService.getLineChartData(
      statisticsData.chart.data,
      'Recurring',
      true
    );
    chartDatasetArray.push(chartDataset);
    reportDatasetArray = statisticsData.report.data;

    let recurringTotal = statisticsData.chart.data.reduce(
      (sum, data) => (sum += data)
    );

    statisticsData = await this.statisticsService.buildChart(
      this.selected,
      'non-recurring-customers',
      false
    );
    chartDataset = this.statisticsService.getLineChartData(
      statisticsData.chart.data,
      'First Time',
      true,
      'rgb(255, 97, 18)',
      'rgb(255, 97, 18, 0.4)'
    );
    chartDatasetArray.push(chartDataset);
    reportDatasetArray = reportDatasetArray.concat(statisticsData.report.data);

    let firstTimeTotal = statisticsData.chart.data.reduce(
      (sum, data) => (sum += data)
    );

    filteredData = statisticsData.chart.data.filter((data) => data !== 0);

    let percentage = filteredData.length > 0 ? (
      (recurringTotal / (firstTimeTotal + recurringTotal)) *
      100
    ).toFixed(2) : 0;

    chartConfigData = {
      datasets: chartDatasetArray.map(({ datasets }) => datasets),
      labels: statisticsData.chart.labels,
    };
    chartOptions = this.statisticsService.getLineChartOptions(
      0.3,
      'Total Sales',
      '',
      true,
      false,
      true,
      false,
      statisticsData.chart.labels
    );

    this.charts.push({
      data: chartConfigData,
      options: chartOptions,
      type: 'line',
      heading: 'Recurring Customers',
      subheading: `${percentage}%`,
      queries: ['recurring-customers', 'non-recurring-customers']
    });

    reportDatasetArray.forEach((row: any) => {
      row.customer_type = row.total == 1 ? 'First Time' : 'Recurring';
    });

    this.reports.push({
      data: reportDatasetArray,
      headers: ['Date', 'Customers', 'Customer Type'],
      dataTypes: ['text', 'int', 'text'],
      formatted: false,
      filters: [
        { name: 'Hide Empty Rows', predicate: (value: any) => !value.empty },
        {
          name: 'Show Only Empty Rows',
          predicate: (value: any) => value.empty,
        },
        {
          name: 'Recurring Only',
          predicate: (value: any) => value.customer_type == 'First Time',
        },
        {
          name: 'First Time Only',
          predicate: (value: any) => value.customer_type == 'Recurring',
        },
      ],
      keys: [
        'dateKey',
        'total',
      ]
    });
  }

  async setReportChart(chart: chart | null, index?: number) {
    if (chart != null && index != null) {
      this.filteredReportData = null;
      this.headerToSort = { name: '', field: '' };
      this.optionsShown = false;

      let report: report = this.reports[index];
      if (report.data.length > 0) {
        if (!report.formatted) {
          report = this.statisticsService.formatReport(report, this.selected);
        }
  
        this.filteredReportData = report.data;
        this.headerToSort = {
          name: report.headers ? report.headers[0] : '',
          field: Object.keys(report.data[0])[0],
        };
      }

      this.reportChart = { chart, report };
    } else {
      this.reportChart = null;
    }
  }

  hasKey(row: any, key: any) {
    return row[key] != undefined;
  }

  toggleTableOptions(option: string) {
    this.optionsShown = this.optionsShown == option ? false : option;
  }

  setFilter(filter: filter) {
    if (this.filters.includes(filter)) {
      this.removeFilter(filter, true);
    } else {
      if (this.reportChart?.report) {
        this.applyFilter(filter.predicate);
        this.filters.push(filter);
      }
    }
  }

  applyFilter(predicate: Function, reset = true) {
    reset && this.resetFilter();
    this.filteredReportData = this.filteredReportData.filter(predicate);
  }

  removeFilter(filter: filter, checked = false, reapply = true) {
    if (checked || (!checked && this.filters.includes(filter))) {
      this.filters.splice(this.filters.indexOf(filter), 1);
      reapply && this.redoFilters();
    }
  }

  resetFilter() {
    this.filters = [];
    this.filteredReportData = this.reportChart?.report.data;
  }

  redoFilters() {
    this.filteredReportData = this.reportChart?.report.data;
    this.filters.forEach((filter: filter) => this.setFilter(filter));
  }

  filterActive(filter: filter) {
    return this.filters.includes(filter);
  }

  selectHeaderToSort(event: Event) {
    const index = (event.target as HTMLSelectElement).value;
    this.headerToSort = {
      name: this.reportChart?.report.headers
        ? this.reportChart.report.headers[Number(index)]
        : '',
      field: Object.keys(this.reportChart!.report.data[0])[Number(index)],
    };
  }

  sortTable(direction: string) {
    this.filteredReportData =
      direction == 'down'
        ? this.filteredReportData.sort(
            (a: any, b: any) =>
              this.stripAndConvert(a[this.headerToSort.field]) - this.stripAndConvert(b[this.headerToSort.field])
          )
        : this.filteredReportData.sort(
            (a: any, b: any) =>
              this.stripAndConvert(b[this.headerToSort.field]) - this.stripAndConvert(a[this.headerToSort.field])
          );
  }

  stripAndConvert(value: string): any {
    if (typeof value === 'string') {
      return parseFloat(value.replace(/[£,]/g, ''));
    }
    return value;
  }
}
