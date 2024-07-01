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
    let monthStart = this.selected.startDate.month();
    let monthEnd = this.selected.endDate.month();
    let year = this.selected.startDate.year();

    //Average order value
    let statisticsData = await this.statisticsService.buildChart(
      monthStart,
      monthEnd,
      year,
      this.selected,
      'average-invoice-value-per-day',
      'average-invoice-value-per-month',
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
      0.5,
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
      query: {
        dayQueries: ['average-invoice-value-per-day'],
        monthQueries: ['average-invoice-value-per-month'],
      },
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
    });

    //Total Orders
    statisticsData = await this.statisticsService.buildChart(
      monthStart,
      monthEnd,
      year,
      this.selected,
      'total-invoices-per-day',
      'total-invoices-per-month',
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
      0.5,
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
      query: {
        dayQueries: ['total-invoices-per-day'],
        monthQueries: ['total-invoices-per-month'],
      },
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
    });

    //Top Selling Products
    statisticsData = await this.statisticsService.buildChart(
      monthStart,
      monthEnd,
      year,
      this.selected,
      'top-selling-item-per-day',
      'top-selling-item-per-month',
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
      query: {
        dayQueries: ['top-selling-item-per-day'],
        monthQueries: ['top-selling-item-per-month'],
      },
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
    });

    //Total Invoice Value
    statisticsData = await this.statisticsService.buildChart(
      monthStart,
      monthEnd,
      year,
      this.selected,
      'total-invoice-value-per-day',
      'total-invoice-value-per-month',
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
      0.5,
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
      query: {
        dayQueries: ['total-invoice-value-per-day'],
        monthQueries: ['total-invoice-value-per-month'],
      },
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
    });

    //Recurring Customer
    let chartDatasetArray: any[] = [];
    let reportDatasetArray: any[] = [];
    statisticsData = await this.statisticsService.buildChart(
      monthStart,
      monthEnd,
      year,
      this.selected,
      'recurring-customers-day',
      'recurring-customers-month',
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
      monthStart,
      monthEnd,
      year,
      this.selected,
      'non-recurring-customers-day',
      'non-recurring-customers-month',
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
      0.5,
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
      query: {
        dayQueries: ['recurring-customers-day', 'non-recurring-customers-day'],
        monthQueries: [
          'recurring-customers-month',
          'non-recurring-customers-month',
        ],
      },
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

  getKeys(row: any) {
    let keys = Object.keys(row);
    keys.pop();
    return keys;
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
