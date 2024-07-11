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
  comparison: selectedDate = {
    startDate: null,
    endDate: null,
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

  constructor(private statisticsService: StatisticsService) { }

  ngOnInit() {
    // this.buildCharts(this.selected);
  }

  updateDateRange() {
    if (this.selected.startDate && this.selected.endDate) {
      this.reset();
      this.buildCharts(this.selected);
      
      if (this.comparison && this.comparison.startDate && this.comparison.endDate) {
        this.buildCharts(this.comparison);
      }
    }
  }

  updateComparisonRange() {
    if (this.comparison && this.comparison.startDate && this.comparison.endDate) {
      this.reset();
      this.buildCharts(this.comparison);
    }
  }

  reset() {
    this.charts = [];
    this.reports = [];
    this.reportChart = null;
  }

  async buildCharts(date: selectedDate) {
    //Average order value
    const averageOrderHeading = 'Average Order Value';
    const averageOrderLabel = 'Total Value';
    const averageOrderAxisLabels = {x: 'Date', y: 'Order Value (£)'}
    const averageOrderHeaders = ['Date', 'Gross Sales', 'Discounts', 'Orders', 'Average Order Value'];
    const averageOrderDataTypes = ['text', 'currency', 'percentage', 'int', 'currency'];
    const averageOrderQuery = 'average-invoice-value';
    const averageOrderFilters = [
      { name: 'Hide Empty Rows', predicate: (value: any) => !value.empty },
      { name: 'Show Only Empty Rows', predicate: (value: any) => value.empty,}
    ];
    const averageOrderKeys = ['dateKey', 'total', 'discounts', 'orders', 'average'];

    let statisticsData = await this.statisticsService.buildChart(date, averageOrderQuery, false);

    let chartDataset = this.statisticsService.getLineChartData(
      statisticsData.chart.data,
      averageOrderLabel,
      true
    );

    let chartOptions = this.statisticsService.getLineChartOptions(
      0.3,
      averageOrderAxisLabels.y,
      averageOrderAxisLabels.x,
      false,
      true,
      true,
      false,
      statisticsData.chart.labels
    );

    let filteredData = statisticsData.chart.data.filter((data) => data !== 0);

    let average =
      filteredData.length > 0
        ? filteredData.reduce((sum, data) => sum + data, 0) /
        filteredData.length
        : 0;

    let subheading = `£${average.toFixed(2)}`;

    this.charts.push({
      data: {
        datasets: [chartDataset.datasets],
        labels: statisticsData.chart.labels,
      },
      options: chartOptions,
      type: 'line',
      heading: averageOrderHeading,
      subheading: subheading,
      queries: averageOrderQuery,
    });

    this.reports.push({
      data: statisticsData.report.data,
      headers: averageOrderHeaders,
      dataTypes: averageOrderDataTypes,
      formatted: false,
      filters: averageOrderFilters,
      keys: averageOrderKeys,
    });

    //Total Orders
    const totalOrdersHeading = 'Total Orders';
    const totalOrdersQuery = 'total-invoices';
    const totalOrdersAxisLabels = {x: 'Date', y: 'Order Amount'};
    const totalOrdersHeaders = ['Date', 'Orders', 'Average Units Ordered', 'Average Order Value'];
    const totalOrdersDataTypes = ['text', 'int', 'number', 'currency'];
    const totalOrdersFilters = [
      { name: 'Hide Empty Rows', predicate: (value: any) => !value.empty },
      { name: 'Show Only Empty Rows', predicate: (value: any) => value.empty }
    ]
    const totalOrdersKeys = ['dateKey', 'total_orders', 'average_units_ordered', 'average_order_value'];

    statisticsData = await this.statisticsService.buildChart(
      this.selected,
      totalOrdersQuery,
      false
    );
    chartDataset = this.statisticsService.getLineChartData(
      statisticsData.chart.data,
      totalOrdersHeading,
      true
    );

    chartOptions = this.statisticsService.getLineChartOptions(
      0.3,
      totalOrdersAxisLabels.y,
      totalOrdersAxisLabels.x,
      false,
      false,
      true,
      false,
      statisticsData.chart.labels
    );

    filteredData = statisticsData.chart.data.filter((data) => data !== 0);
    let total =
      filteredData.length > 0
        ? statisticsData.chart.data.reduce((sum, data) => (sum += data))
        : 0;

    this.charts.push({
      data: {
        datasets: [chartDataset.datasets],
        labels: statisticsData.chart.labels,
      },
      options: chartOptions,
      type: 'line',
      heading: totalOrdersHeading,
      subheading: total,
      queries: totalOrdersQuery,
    });

    this.reports.push({
      data: statisticsData.report.data,
      headers: totalOrdersHeaders,
      dataTypes: totalOrdersDataTypes,
      formatted: false,
      filters: totalOrdersFilters,
      keys: totalOrdersKeys,
    });

    //Top Selling Products
    const topSellingHeading = 'Top Selling Products';
    const topSellingLabel = 'Total Sales';
    const topSellingQuery = 'top-selling-item';
    const topSellingAxisLabels = {x: 'Item Name', y: 'Total Sales'};
    const topSellingHeaders = ['Item Name', 'Product Vendor', 'Product Type', 'Net Quantity', 'Gross Sales','Discounts','Net Sales','VAT','Total Sales'];
    const topSellingDataTypes = ['text', 'text', 'text', 'int', 'int', 'percentage', 'currency', 'currency', 'currency'];
    const topSellingFilters = [
      { name: 'Hide Empty Rows', predicate: (value: any) => !value.empty },
      { name: 'Show Only Empty Rows', predicate: (value: any) => value.empty }
    ];
    const topSellingKeys = ['dateKey', 'brand', 'category', 'net_quantity', 'gross_sales_before_discount', 'total_discount', 'net_sales', 'vat', 'total_sales'];

    statisticsData = await this.statisticsService.buildChart(
      this.selected,
      topSellingQuery,
      true
    );
    let barChartDataset = this.statisticsService.getBarChartData(
      statisticsData.chart.data,
      topSellingLabel,
      10
    );

    let barChartConfigData = {
      labels: statisticsData.chart.labels,
      datasets: [barChartDataset.datasets],
    };
    chartOptions = this.statisticsService.getBarChartOptions(
      topSellingAxisLabels.y,
      topSellingAxisLabels.x,
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
      heading: topSellingHeading,
      subheading: statisticsData.chart.labels[0],
      queries: topSellingQuery,
    });

    this.reports.push({
      data: statisticsData.report.data,
      headers: topSellingHeaders,
      dataTypes: topSellingDataTypes,
      formatted: false,
      filters: topSellingFilters,
      keys: topSellingKeys,
    });

    //Total Invoice Value
    const totalInvoiceValueHeading = 'Total Invoices Value';
    const totalInvoiceValueLabel = 'Total Value';
    const totalInvoiceValueQuery = 'total-invoice-value';
    const totalInvoiceValueAxisLabels = {x: 'Date', y: 'Total Value'};
    const totalInvoiceValueHeaders = ['Date', 'Orders', 'Discounts', 'Net Sales', 'Tax', 'Gross Sales'];
    const totalInvoiceValueDataTypes = ['text', 'int', 'currency', 'currency', 'currency', 'currency'];
    const totalInvoiceValueFilters = [
      { name: 'Hide Empty Rows', predicate: (value: any) => !value.empty },
      { name: 'Show Only Empty Rows', predicate: (value: any) => value.empty }
    ];
    const totalInvoiceValueKeys = ['dateKey', 'total_orders', 'discounts', 'net', 'tax', 'total'];

    statisticsData = await this.statisticsService.buildChart(
      this.selected,
      totalInvoiceValueQuery,
      false
    );

    chartDataset = this.statisticsService.getLineChartData(
      statisticsData.chart.data,
      totalInvoiceValueLabel,
      true
    );

    chartOptions = this.statisticsService.getLineChartOptions(
      0.3,
      totalInvoiceValueAxisLabels.y,
      totalInvoiceValueAxisLabels.x,
      false,
      true,
      true,
      false,
      statisticsData.chart.labels
    );

    filteredData = statisticsData.chart.data.filter((data) => data !== 0);
    total =
      filteredData.length > 0
        ? statisticsData.chart.data
          .reduce((sum, data) => (sum += data))
          .toFixed(2)
        : 0;

    this.charts.push({
      data: { 
        datasets: [chartDataset.datasets],
        labels: statisticsData.chart.labels,
      },
      options: chartOptions,
      type: 'line',
      heading: totalInvoiceValueHeading,
      subheading: `£${total}`,
      queries: totalInvoiceValueQuery,
    });

    this.reports.push({
      data: statisticsData.report.data,
      headers: totalInvoiceValueHeaders,
      dataTypes: totalInvoiceValueDataTypes,
      formatted: false,
      filters: totalInvoiceValueFilters,
      keys: totalInvoiceValueKeys
    });

    //Store / Cart Conversion Rate
    const storeConversionHeading = 'Online Store Conversion Rate';
    const storeConversionLabel = 'Total';
    const storeConversionQuery = 'store-conversion-rate';
    const storeConversionHeaders = ['Date', 'Reached checkout', 'Added to cart', 'Payments made', 'Total sessions'];
    const storeConversionDataTypes = ['text', 'int', 'int', 'int', 'int'];
    const storeConversionFilters = [
      { name: 'Hide Empty Rows', predicate: (value: any) => !value.empty },
      { name: 'Show Only Empty Rows', predicate: (value: any) => value.empty }
    ];
    const storeConversionKeys = ['dateKey', 'Reached checkout', 'Added to cart', 'Payments made', 'Total sessions'];
    
    statisticsData = await this.statisticsService.buildChart(
      this.selected,
      storeConversionQuery,
      false,
      'pie'
    );
    let pieChartDataset = this.statisticsService.getPieChartData(
      statisticsData.chart.data.flat(),
      storeConversionLabel,
      [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 205, 86, 0.5)',
      ],
      ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)']
    );

    const pieChartConfigData = {
      datasets: [pieChartDataset.datasets],
      labels: statisticsData.chart.labels,
    };

    chartOptions = this.statisticsService.getPieChartOptions(true, false);

    let totalSessions = pieChartDataset.datasets.data.reduce(
      (sum, n) => (sum += n)
    );

    const totalPaymentsMade = statisticsData.report.data.reduce(
      (sum: number, current: any) => {
        return sum + (current['Payments made'] || 0);
      },
      0
    );

    let sessionPercentage = ((totalPaymentsMade / totalSessions) * 100)
      .toFixed(2)
      .toString();

    this.charts.push({
      data: pieChartConfigData,
      options: chartOptions,
      type: 'pie',
      heading: storeConversionHeading,
      subheading: sessionPercentage + '%',
      queries: 'total-invoices',
    });

    this.reports.push({
      data: statisticsData.report.data,
      headers: storeConversionHeaders,
      dataTypes: storeConversionDataTypes,
      formatted: false,
      filters: storeConversionFilters,
      keys: storeConversionKeys,
    });

    //Recurring Customer
    const recurringCustomersHeading = 'Recurring Customers';
    const recurringCustomersLabel = ['Recurring', 'First Time'];
    const recurringCustomersQuery = ['recurring-customers', 'non-recurring-customers'];
    const recurringCustomersAxisLabels = {x: '', y: 'Total Sales'};
    const recurringCustomersHeaders = ['Date', 'Customers', 'Customer Type'];
    const recurringCustomersDataTypes = ['text', 'int', 'text'];
    const recurringCustomersFilters = [
      { name: 'Hide Empty Rows', predicate: (value: any) => !value.empty },
      { name: 'Show Only Empty Rows', predicate: (value: any) => value.empty },
      { name: 'Recurring Only', predicate: (value: any) => value.customer_type == 'First Time' },
      { name: 'First Time Only', predicate: (value: any) => value.customer_type == 'Recurring' }
    ];
    const recurringCustomersKeys = ['dateKey', 'total'];

    let chartDatasetArray: any[] = [];
    let reportDatasetArray: any[] = [];
    statisticsData = await this.statisticsService.buildChart(
      this.selected,
      recurringCustomersQuery[0],
      false
    );
    chartDataset = this.statisticsService.getLineChartData(
      statisticsData.chart.data,
      recurringCustomersLabel[0],
      true
    );
    chartDatasetArray.push(chartDataset);
    reportDatasetArray = statisticsData.report.data;

    let recurringTotal = statisticsData.chart.data.reduce(
      (sum, data) => (sum += data)
    );

    statisticsData = await this.statisticsService.buildChart(
      this.selected,
      recurringCustomersQuery[1],
      false
    );
    chartDataset = this.statisticsService.getLineChartData(
      statisticsData.chart.data,
      recurringCustomersLabel[1],
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

    let percentage =
      filteredData.length > 0
        ? ((recurringTotal / (firstTimeTotal + recurringTotal)) * 100).toFixed(
          2
        )
        : 0;

    chartOptions = this.statisticsService.getLineChartOptions(
      0.3,
      recurringCustomersAxisLabels.y,
      recurringCustomersAxisLabels.x,
      true,
      false,
      true,
      false,
      statisticsData.chart.labels
    );

    this.charts.push({
      data: {
        datasets: chartDatasetArray.map(({ datasets }) => datasets),
        labels: statisticsData.chart.labels,
      },
      options: chartOptions,
      type: 'line',
      heading: recurringCustomersHeading,
      subheading: `${percentage}%`,
      queries: recurringCustomersQuery,
    });

    reportDatasetArray.forEach((row: any) => {
      row.customer_type = row.total == 1 ? 'First Time' : 'Recurring';
    });

    this.reports.push({
      data: reportDatasetArray,
      headers: recurringCustomersHeaders,
      dataTypes: recurringCustomersDataTypes,
      formatted: false,
      filters: recurringCustomersFilters,
      keys: recurringCustomersKeys,
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
            this.stripAndConvert(a[this.headerToSort.field]) -
            this.stripAndConvert(b[this.headerToSort.field])
        )
        : this.filteredReportData.sort(
          (a: any, b: any) =>
            this.stripAndConvert(b[this.headerToSort.field]) -
            this.stripAndConvert(a[this.headerToSort.field])
        );
  }

  stripAndConvert(value: string): any {
    if (typeof value === 'string') {
      return parseFloat(value.replace(/[£,]/g, ''));
    }
    return value;
  }
}
