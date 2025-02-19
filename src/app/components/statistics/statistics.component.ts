import { Component } from '@angular/core';
import { StatisticsService } from '../../services/statistics.service';
import dayjs from 'dayjs';
import utcPlugin from 'dayjs/plugin/utc';
import {
  Chart,
  Report,
  Filter,
  SelectedDate,
  LineChartOptions,
  SubheadingOptions,
  ReportOptions,
  SubheadingType,
} from '../../common/types/statistics/types';
import { chartIcons } from '../../common/icons/chart-icons';
import _ from 'lodash';
import { DataService } from '../../services/data.service';

dayjs.extend(utcPlugin);

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent {
  icons = chartIcons;

  selectedItem = '';
  items = [];

  selectedCustomer = '';
  customers = [];

  reportChart: { chart: Chart; report: Report } | null = null;

  initialDate: SelectedDate = {
    startDate: dayjs().startOf('month'),
    endDate: dayjs().endOf('month'),
  };
  comparison: SelectedDate = {
    startDate: null,
    endDate: null,
  };

  reports: Report[] = [];
  charts: Chart[] = [];

  ranges: any = {
    Yesterday: [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
    Today: [dayjs(), dayjs()],
    'Last 3 Days': [dayjs().subtract(3, 'days'), dayjs()],
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
  filters: Filter[] = [];
  filteredReportData: any = null;
  headerToSort = { name: '', field: '' };

  loaded: boolean | null = null;
  error = '';

  constructor(
    private statisticsService: StatisticsService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.loadOptions();
  }

  async loadOptions() {
    this.items = await this.dataService.processGet('item-names', {}, true);
    this.customers = await this.dataService.processGet(
      'customer-names',
      {},
      true
    );
  }

  search() {
    this.reset();
    this.build(this.comparison);
  }

  clearCompareDate() {
    this.comparison = {
      startDate: null,
      endDate: null,
    };

    this.search();
  }

  build(compareDate: SelectedDate) {
    if (this.selectedItem != '') {
      this.selectItem(this.selectedItem);
    } else if (this.selectedCustomer != '') {
      this.selectCustomer(this.selectedCustomer);
    } else {
      this.buildCharts(this.initialDate, compareDate);
    }
  }

  reset() {
    this.charts = [];
    this.reports = [];
    this.reportChart = null;
  }

  hasMonthYearMismatch(dateA: SelectedDate, dateB: SelectedDate): boolean {
    const dateAMonthCheck = dateA.endDate?.get('year') == dateA.startDate?.get('year');
    const dateBMonthCheck = dateB.endDate?.get('year') == dateB.startDate?.get('year');

    return dateAMonthCheck !== dateBMonthCheck;
  }

  async buildCharts(
    date: SelectedDate,
    compareDate: SelectedDate | null
  ) {
    if (compareDate && this.hasMonthYearMismatch(date, compareDate)) {
      this.error = 'Can only compare between months or years. Please make sure the range for both is one or the other, not both';
      this.loaded = true;
      return;
    }

    if (compareDate?.endDate == null && compareDate?.startDate == null) {
      compareDate = null;
    }

    this.error = '';
    this.loaded = false;

    const lineChartConfig = this.statisticsService.getDefaultLineChartConfig(date, compareDate!);

    for (const config of lineChartConfig) {
      await this.constructLineChart(config.lineChartOptions, config.subheadingOptions, config.reportOptions, config.heading, config.filter);
    }

    //Top Selling Products
    const topSellingHeading = 'Top Selling Products';
    const topSellingLabel = 'Total Sales';
    const topSellingQuery = 'top-selling-item';
    const topSellingAxisLabels = { x: 'Item Name', y: 'Total Sales' };
    const topSellingHeaders = [
      'Item Name',
      'Product Vendor',
      'Product Type',
      'Net Quantity',
      'Gross Sales',
      'Discounts',
      'Net Sales',
      'VAT',
      'Total Sales',
    ];
    const topSellingDataTypes = [
      'text',
      'text',
      'text',
      'int',
      'int',
      'percentage',
      'currency',
      'currency',
      'currency',
    ];
    const topSellingFilters = [
      { name: 'Hide Empty Rows', predicate: (value: any) => !value.empty },
      { name: 'Show Only Empty Rows', predicate: (value: any) => value.empty },
    ];
    const topSellingKeys = [
      'dateKey',
      'brand',
      'category',
      'net_quantity',
      'gross_sales_before_discount',
      'total_discount',
      'net_sales',
      'vat',
      'total_sales',
    ];

    let statisticsData = await this.statisticsService.buildChart(
      this.initialDate,
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
    let chartOptions = this.statisticsService.getBarChartOptions(
      topSellingAxisLabels.y,
      topSellingAxisLabels.x,
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

    //Store / Cart Conversion Rate
    const storeConversionHeading = 'Online Store Conversion Rate';
    const storeConversionLabel = 'Total';
    const storeConversionQuery = 'store-conversion-rate';
    const storeConversionHeaders = [
      'Date',
      'Reached checkout',
      'Added to cart',
      'Payments made',
      'Total sessions',
    ];
    const storeConversionDataTypes = ['text', 'int', 'int', 'int', 'int'];
    const storeConversionFilters = [
      { name: 'Hide Empty Rows', predicate: (value: any) => !value.empty },
      { name: 'Show Only Empty Rows', predicate: (value: any) => value.empty },
    ];
    const storeConversionKeys = [
      'dateKey',
      'Reached checkout',
      'Added to cart',
      'Payments made',
      'Total sessions',
    ];

    statisticsData = await this.statisticsService.buildChart(
      this.initialDate,
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

    let sessionPercentage =
      totalPaymentsMade == 0 && totalSessions == 0
        ? 0
        : ((totalPaymentsMade / totalSessions) * 100).toFixed(2).toString();

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

    this.loaded = true;
  }

  async constructLineChart(
    options: LineChartOptions,
    subheadingOptions: SubheadingOptions,
    reportOptions: ReportOptions,
    heading: string,
    filter?: string
  ) {
    let lineChartData = await this.statisticsService.constructLineChart(options, subheadingOptions, reportOptions, heading, filter)

    this.charts.push(lineChartData.chart);
    this.reports.push(lineChartData.report);
  }

  async setReportChart(chart: Chart | null, index?: number) {
    if (chart != null && index != null) {
      this.filteredReportData = null;
      this.headerToSort = { name: '', field: '' };
      this.optionsShown = false;

      let report: Report = this.reports[index];
      if (report.data.length > 0) {
        if (!report.formatted) {
          report = this.statisticsService.formatReport(report, this.initialDate);
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

  setFilter(filter: Filter) {
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

  removeFilter(filter: Filter, checked = false, reapply = true) {
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
    this.filters.forEach((filter: Filter) => this.setFilter(filter));
  }

  filterActive(filter: Filter) {
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
            this.statisticsService.stripAndConvert(a[this.headerToSort.field]) -
            this.statisticsService.stripAndConvert(b[this.headerToSort.field])
        )
        : this.filteredReportData.sort(
          (a: any, b: any) =>
            this.statisticsService.stripAndConvert(b[this.headerToSort.field]) -
            this.statisticsService.stripAndConvert(a[this.headerToSort.field])
        );
  }

  async selectCustomer(customer: string) {
    this.reset();

    let date = this.initialDate;
    let compareDate: SelectedDate | null = null;

    if (
      this.comparison &&
      this.comparison.startDate &&
      this.comparison.endDate
    ) {
      compareDate = this.comparison;
    }

    const dateLabel = {
      primary:
        date.startDate!.format('DD MMM').toString() +
        ' to ' +
        date.endDate!.format('DD MMM').toString(),
      secondary:
        compareDate?.startDate!.format('DD MMM').toString() +
        ' to ' +
        compareDate?.endDate!.format('DD MMM').toString(),
    };

    this.selectedCustomer = customer;
    this.selectedItem = '';

    //Top Purchased Items
    const topPurchasedHeading = 'Top Purchased Items';
    const topPurchasedLabel = 'Total Sales';
    const topPurchasedQuery = 'top-purchased-item-by-customer-name';
    const topPurchasedAxisLabels = { x: 'Item Name', y: 'Total Sales' };

    let statisticsData = await this.statisticsService.buildChart(
      this.initialDate,
      topPurchasedQuery,
      true,
      undefined,
      this.selectedCustomer
    );

    let barChartDataset = this.statisticsService.getBarChartData(
      statisticsData.chart.data,
      topPurchasedLabel,
      10
    );

    let barChartConfigData = {
      labels: statisticsData.chart.labels,
      datasets: [barChartDataset.datasets],
    };

    let chartOptions = this.statisticsService.getBarChartOptions(
      topPurchasedAxisLabels.y,
      topPurchasedAxisLabels.x,
      statisticsData.chart.labels
    );

    this.charts.push({
      data: barChartConfigData,
      options: chartOptions,
      type: 'bar',
      heading: topPurchasedHeading,
      subheading: statisticsData.chart.labels[0],
      queries: topPurchasedQuery,
    });

    //Average Order Value
    const averageOrderHeading = 'Average Order Value';
    const averageOrderAxisLabels = { x: 'Date', y: 'Order Value (£)' };
    const averageOrderHeaders = [
      'Date',
      'Gross Sales',
      'Discounts',
      'Orders',
      'Average Order Value',
    ];
    const averageOrderDataTypes = [
      'text',
      'currency',
      'currency',
      'int',
      'currency',
    ];
    const averageOrderQuery = 'average-invoice-value-by-customer';
    const averageOrderFilters = [
      { name: 'Hide Empty Rows', predicate: (value: any) => !value.empty },
      { name: 'Show Only Empty Rows', predicate: (value: any) => value.empty },
    ];
    const averageOrderKeys = [
      'dateKey',
      'total',
      'discounts',
      'orders',
      'average',
    ];
    const averageOrderDateLabels = {
      primary: compareDate != null ? dateLabel.primary : 'Total Value',
      secondary:
        compareDate?.startDate && compareDate.endDate
          ? dateLabel.secondary
          : 'Total Value',
    };

    await this.constructLineChart(
      {
        date: date,
        compareDate: compareDate,
        queries: averageOrderQuery,
        chartLabels: averageOrderDateLabels,
        axisLabels: averageOrderAxisLabels,
      },
      {
        type: SubheadingType.AverageCurrency,
        filter: true,
      },
      {
        headers: averageOrderHeaders,
        dataTypes: averageOrderDataTypes,
        formatted: false,
        filters: averageOrderFilters,
        keys: averageOrderKeys,
      },
      averageOrderHeading,
      this.selectedCustomer
    );

    //Store / Cart Conversion
    const storeConversionHeading = 'Online Store Conversion Rate';
    const storeConversionLabel = 'Total';
    const storeConversionQuery = 'store-conversion-rate-by-customer';
    const storeConversionHeaders = [
      'Date',
      'Reached checkout',
      'Added to cart',
      'Payments made',
      'Total sessions',
    ];
    const storeConversionDataTypes = ['text', 'int', 'int', 'int', 'int'];
    const storeConversionFilters = [
      { name: 'Hide Empty Rows', predicate: (value: any) => !value.empty },
      { name: 'Show Only Empty Rows', predicate: (value: any) => value.empty },
    ];
    const storeConversionKeys = [
      'dateKey',
      'Reached checkout',
      'Added to cart',
      'Payments made',
      'Total sessions',
    ];

    statisticsData = await this.statisticsService.buildChart(
      this.initialDate,
      storeConversionQuery,
      false,
      'pie',
      this.selectedCustomer
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

    let sessionPercentage =
      (statisticsData.chart.data[2] / statisticsData.chart.data[1]) * 100;

    sessionPercentage = sessionPercentage > 100 ? 100 : sessionPercentage;

    this.charts.push({
      data: pieChartConfigData,
      options: chartOptions,
      type: 'pie',
      heading: storeConversionHeading,
      subheading: sessionPercentage + '%',
      queries: 'total-invoices',
    });
  }

  async selectItem(item: string) {
    this.reset();

    let date = this.initialDate;
    let compareDate: SelectedDate | null = null;

    if (
      this.comparison &&
      this.comparison.startDate &&
      this.comparison.endDate
    ) {
      compareDate = this.comparison;
    }

    const dateLabel = {
      primary:
        date.startDate!.format('DD MMM').toString() +
        ' to ' +
        date.endDate!.format('DD MMM').toString(),
      secondary:
        compareDate?.startDate!.format('DD MMM').toString() +
        ' to ' +
        compareDate?.endDate!.format('DD MMM').toString(),
    };

    this.selectedItem = item;
    this.selectedCustomer = '';

    //Top Purchasing Customers
    const topPurchasingHeading = 'Top Purchasing Customers';
    const topPurchasingLabel = 'Total Sales';
    const topPurchasingQuery = 'customers-who-ordered-item-by-name';
    const topPurchasingAxisLabels = { x: 'Customer Name', y: 'Total Sales' };

    let statisticsData = await this.statisticsService.buildChart(
      this.initialDate,
      topPurchasingQuery,
      true,
      undefined,
      this.selectedItem
    );

    let barChartDataset = this.statisticsService.getBarChartData(
      statisticsData.chart.data,
      topPurchasingLabel,
      10
    );

    let barChartConfigData = {
      labels: statisticsData.chart.labels,
      datasets: [barChartDataset.datasets],
    };

    let chartOptions = this.statisticsService.getBarChartOptions(
      topPurchasingAxisLabels.y,
      topPurchasingAxisLabels.x,
      statisticsData.chart.labels
    );

    this.charts.push({
      data: barChartConfigData,
      options: chartOptions,
      type: 'bar',
      heading: topPurchasingHeading,
      subheading: statisticsData.chart.labels[0],
      queries: topPurchasingQuery,
    });

    //Sales per period
    const salesPerPeriodHeading = 'Sales Per Period';
    const salesPerPeriodAxisLabels = { x: 'Date', y: 'Total Sales (£)' };
    const salesPerPeriodHeaders = [
      'Date',
      'Gross Sales',
      'Discounts',
      'Orders',
      'Average Order Value',
    ];
    const salesPerPeriodDataTypes = [
      'text',
      'currency',
      'currency',
      'int',
      'currency',
    ];
    const salesPerPeriodQuery = 'item-sales-per-period';
    const salesPerPeriodFilters = [
      { name: 'Hide Empty Rows', predicate: (value: any) => !value.empty },
      { name: 'Show Only Empty Rows', predicate: (value: any) => value.empty },
    ];
    const salesPerPeriodKeys = [
      'dateKey',
      'total',
      'discounts',
      'orders',
      'average',
    ];
    const salesPerPeriodDateLabels = {
      primary: compareDate != null ? dateLabel.primary : 'Total Value',
      secondary:
        compareDate?.startDate && compareDate.endDate
          ? dateLabel.secondary
          : 'Total Value',
    };

    await this.constructLineChart(
      {
        date: date,
        compareDate: compareDate,
        queries: salesPerPeriodQuery,
        chartLabels: salesPerPeriodDateLabels,
        axisLabels: salesPerPeriodAxisLabels,
      },
      {
        type: SubheadingType.AverageCurrency,
        filter: false,
      },
      {
        headers: salesPerPeriodHeaders,
        dataTypes: salesPerPeriodDataTypes,
        formatted: false,
        filters: salesPerPeriodFilters,
        keys: salesPerPeriodKeys,
      },
      salesPerPeriodHeading,
      this.selectedItem
    );

    //Popular Units
    const popularUnitHeading = 'Most Popular Unit';
    const popularUnitLabel = 'Total';
    const popularUnitQuery = 'popular-units';
    // const popularUnitHeaders = [
    //   'Date',
    //   'Reached checkout',
    //   'Added to cart',
    //   'Payments made',
    //   'Total sessions',
    // ];
    // const popularUnitDataTypes = ['text', 'int', 'int', 'int', 'int'];
    // const popularUnitFilters = [
    //   { name: 'Hide Empty Rows', predicate: (value: any) => !value.empty },
    //   { name: 'Show Only Empty Rows', predicate: (value: any) => value.empty },
    // ];
    // const popularUnitKeys = [
    //   'dateKey',
    //   'Reached checkout',
    //   'Added to cart',
    //   'Payments made',
    //   'Total sessions',
    // ];

    statisticsData = await this.statisticsService.buildChart(
      this.initialDate,
      popularUnitQuery,
      false,
      'pie',
      this.selectedItem
    );
    let pieChartDataset = this.statisticsService.getPieChartData(
      statisticsData.chart.data.flat(),
      popularUnitLabel,
      [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 205, 86, 0.5)',
        'rgba(42, 205, 86, 0.5',
      ],
      [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        'rgba(42, 205, 86, 0.5',
      ]
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

    let sessionPercentage =
      totalPaymentsMade == 0 && totalSessions == 0
        ? 0
        : ((totalPaymentsMade / totalSessions) * 100).toFixed(2).toString();

    this.charts.push({
      data: pieChartConfigData,
      options: chartOptions,
      type: 'pie',
      heading: popularUnitHeading,
      subheading: sessionPercentage + '%',
      queries: 'popular-units',
    });
  }

  clearSelectedItem() {
    this.selectedItem = '';
    this.search();
  }

  clearSelectedCustomer() {
    this.selectedCustomer = '';
    this.search();
  }
}
