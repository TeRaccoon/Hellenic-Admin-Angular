import { Component } from '@angular/core';
import { StatisticsService } from '../../services/statistics.service';
import dayjs from 'dayjs';
import utcPlugin from 'dayjs/plugin/utc';
import {
  chart,
  report,
  filter,
  selectedDate,
  LineChartOptions,
  LineChartDataOptions,
  SubheadingOptions,
  ReportOptions,
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

  updateDateRange() {
    if (this.selected.startDate && this.selected.endDate) {
      this.reset();
      this.buildCharts(this.selected);
    }
  }

  updateComparisonRange() {
    if (this.comparison && this.comparison.startDate && this.comparison.endDate) {
      this.reset();
      this.buildCharts(this.selected, this.comparison);
    }
  }

  reset() {
    this.charts = [];
    this.reports = [];
    this.reportChart = null;
  }

  async buildCharts(date: selectedDate, compareDate: selectedDate | null = null) {
    const lineTension = 0.3;
    const primaryColour = 'rgb(0, 140, 255)';
    const secondaryColour = 'rgb(255, 97, 18)';
    const primaryBackgroundColour = 'rgb(0, 140, 255, 0.4)'
    const secondaryBackgroundColour = 'rgb(255, 97, 18, 0.4)';
    const dateLabel = {
      primary: date.startDate!.format('DD MMM').toString() + ' to ' + date.endDate!.format('DD MMM').toString(), 
      secondary: compareDate?.startDate!.format('DD MMM').toString() + ' to ' + compareDate?.endDate!.format('DD MMM').toString()
    };

    //Average order value
    const averageOrderHeading = 'Average Order Value';
    const averageOrderAxisLabels = {x: 'Date', y: 'Order Value (£)'}
    const averageOrderHeaders = ['Date', 'Gross Sales', 'Discounts', 'Orders', 'Average Order Value'];
    const averageOrderDataTypes = ['text', 'currency', 'percentage', 'int', 'currency'];
    const averageOrderQuery = 'average-invoice-value';
    const averageOrderFilters = [
      { name: 'Hide Empty Rows', predicate: (value: any) => !value.empty },
      { name: 'Show Only Empty Rows', predicate: (value: any) => value.empty,}
    ];
    const averageOrderKeys = ['dateKey', 'total', 'discounts', 'orders', 'average'];
    const averageOrderDateLabels = {
      primary: compareDate != null ? dateLabel.primary : 'Total Value',
      secondary: compareDate?.startDate && compareDate.endDate ? dateLabel.secondary : 'Total Value'
    }

    await this.constructLineChart({
        date: date,
        compareDate: compareDate,
        queries: averageOrderQuery,
        chartLabels: averageOrderDateLabels,
        axisLabels: averageOrderAxisLabels,
      },
      {
          type: 'average-currency',
          filter: true
      },
      {
        headers: averageOrderHeaders,
        dataTypes: averageOrderDataTypes,
        formatted: false,
        filters: averageOrderFilters,
        keys: averageOrderKeys,
      },
      averageOrderHeading
    );

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
    const totalOrdersDateLabels = {
      primary: compareDate != null ? dateLabel.primary : 'Total Orders',
      secondary: compareDate?.startDate && compareDate.endDate ? dateLabel.secondary : 'Total Orders'
    }

    await this.constructLineChart({
        date: date,
        compareDate: compareDate,
        queries: totalOrdersQuery,
        chartLabels: totalOrdersDateLabels,
        axisLabels: totalOrdersAxisLabels,
      },
      {
          type: 'average-currency',
          filter: true
      },
      {
        headers: totalOrdersHeaders,
        dataTypes: totalOrdersDataTypes,
        formatted: false,
        filters: totalOrdersFilters,
        keys: totalOrdersKeys,
      },
      totalOrdersHeading
    );

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

    let statisticsData = await this.statisticsService.buildChart(
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
    let chartOptions = this.statisticsService.getBarChartOptions(
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
    const totalInvoiceValueAxisLabels = {x: 'Date', y: 'Total Value'};
    const totalInvoiceValueHeaders = ['Date', 'Orders', 'Discounts', 'Net Sales', 'Tax', 'Gross Sales'];
    const totalInvoiceValueDataTypes = ['text', 'int', 'currency', 'currency', 'currency', 'currency'];
    const totalInvoiceValueQuery = 'total-invoice-value';
    const totalInvoiceValueFilters = [
      { name: 'Hide Empty Rows', predicate: (value: any) => !value.empty },
      { name: 'Show Only Empty Rows', predicate: (value: any) => value.empty }
    ];
    const totalInvoiceValueKeys = ['dateKey', 'total_orders', 'discounts', 'net', 'tax', 'total'];
    const totalInvoiceValueDateLabels = {
      primary: compareDate != null ? dateLabel.primary : 'Total Value',
      secondary: compareDate?.startDate && compareDate.endDate ? dateLabel.secondary : 'Total Value'
    }

    await this.constructLineChart({
        date: date,
        compareDate: compareDate,
        queries: totalInvoiceValueQuery,
        chartLabels: totalInvoiceValueDateLabels,
        axisLabels: totalInvoiceValueAxisLabels,
      },
      {
          type: 'average-currency',
          filter: true
      },
      {
        headers: totalInvoiceValueHeaders,
        dataTypes: totalInvoiceValueDataTypes,
        formatted: false,
        filters: totalInvoiceValueFilters,
        keys: totalInvoiceValueKeys,
      },
      totalInvoiceValueHeading
    );

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
    const recurringCustomersDateLabels = {
      primary: compareDate != null ? [`${dateLabel.primary}: Recurring`, `${dateLabel.primary}: First Time`] : ['Recurring', 'First Time'],
      secondary: compareDate?.startDate && compareDate.endDate ? [`${dateLabel.secondary}: Recurring`, `${dateLabel.secondary}: First Time`] : 'Total Value'
    }

    await this.constructLineChart({
        date: date,
        compareDate: compareDate,
        queries: recurringCustomersQuery,
        chartLabels: recurringCustomersDateLabels,
        axisLabels: recurringCustomersAxisLabels,
        currency: false,
        displayLegend: true,
      },
      {
          type: 'average-currency',
          filter: true
      },
      {
        headers: recurringCustomersHeaders,
        dataTypes: recurringCustomersDataTypes,
        formatted: false,
        filters: recurringCustomersFilters,
        keys: recurringCustomersKeys,
      },
      recurringCustomersHeading
    );

  }

  async constructLineChart(options: LineChartOptions, subheadingOptions: SubheadingOptions, reportOptions: ReportOptions, heading: string) {
    const {
      date,
      compareDate = null,
      queries,
      chartLabels,
      axisLabels,
      displayLegend = compareDate != null,
      currency = true,
      aboveZero = true,
      displayTitles = false,
      ignoreDate = false,
      format = 'standard',
      fillLine = true,
      colours = [
        'rgb(0, 140, 255)',
        'rgb(0, 0, 255)',
        'rgb(0, 200, 255)',
        'rgb(0, 140, 200)',
        'rgb(0, 140, 100)'
      ],
      backgroundColours = [
        'rgb(0, 140, 255, 0.4)',
        'rgb(0, 0, 255, 0.4)',
        'rgb(0, 200, 255, 0.4)',
        'rgb(0, 140, 200, 0.4)',
        'rgb(0, 140, 100, 0.4)'
      ],
      secondaryColours = [
        'rgb(255, 97, 18)',
        'rgb(255, 20, 200)',
        'rgb(255, 117, 0)',
        'rgb(255, 97, 38)',
        'rgb(255, 117, 58)'
      ],
      secondaryBackgroundColours = [
        'rgb(255, 97, 18, 0.4)',
        'rgb(255, 20, 200, 0.4)',
        'rgb(255, 117, 0, 0.4)',
        'rgb(255, 97, 38, 0.4)',
        'rgb(255, 117, 58, 0.4)'
      ],
      lineTension = 0.3
    } = options;

    let dataQueries = Array.isArray(queries) ? queries : [queries];
    let dataLabelsPrimary = Array.isArray(chartLabels.primary) ? chartLabels.primary : [chartLabels.primary];
    let dataLabelsSecondary = Array.isArray(chartLabels.secondary) ? chartLabels.secondary : [chartLabels.secondary];

    let chartDatasets = [];
    let chartData: any;

    for(let index = 0; index < dataQueries.length; index++) {
      chartData = await this.constructLineChartData(
        {
          date: date, 
          query: dataQueries[index], 
          chartLabel: dataLabelsPrimary[index], 
          axisLabels: axisLabels,
          displayLegend: displayLegend,
          currency: currency, 
          aboveZero: aboveZero,
          displayTitles: displayTitles,
          ignoreDate: ignoreDate,
          format: format,
          fillLine: fillLine,
          colour: colours[index],
          backgroundColour: backgroundColours[index],
          lineTension: lineTension
        });
      
      chartData.dataset = await this.checkCompareDate({
          date: compareDate, 
          query: dataQueries[index], 
          chartLabel: dataLabelsSecondary[index], 
          axisLabels: axisLabels,
          displayLegend: displayLegend,
          currency: currency, 
          aboveZero: aboveZero,
          displayTitles: displayTitles,
          ignoreDate: ignoreDate,
          format: format,
          fillLine: fillLine,
          colour: secondaryColours[index],
          backgroundColour: secondaryBackgroundColours[index],
          lineTension: lineTension
        },
        chartData.dataset,
      );

      chartDatasets.push(...chartData.dataset);
    }

    let subheading = this.generateSubheading(chartData.summary.chart.data, subheadingOptions.type, subheadingOptions.filter);

    this.charts.push({
      data: {
        datasets: chartDatasets,
        labels: chartData.summary.chart.labels,
      },
      options: chartData.options,
      type: 'line',
      heading: heading,
      subheading: subheading,
      queries: queries
    });

    this.reports.push({
      data: chartData.summary.report.data,
      headers: reportOptions.headers,
      dataTypes: reportOptions.dataTypes,
      formatted: reportOptions.formatted,
      filters: reportOptions.filters,
      keys: reportOptions.keys,
    });
  }

  async constructLineChartData(options: LineChartDataOptions) {
    const {
      date,
      query,
      chartLabel,
      axisLabels,
      displayLegend = false,
      currency = true,
      aboveZero = true,
      displayTitles = false,
      ignoreDate = false,
      format = 'standard',
      fillLine = true,
      colour = 'rgb(0, 140, 255)',
      backgroundColour = 'rgb(0, 140, 255, 0.4)',
      lineTension = 0.3
    } = options;

    let summaryData = await this.statisticsService.buildChart(date ?? {startDate: dayjs().startOf('month'), endDate: dayjs().endOf('month')}, query, ignoreDate, format);
    let chartDataset: any = this.statisticsService.getLineChartData(summaryData.chart.data, chartLabel, fillLine, colour, backgroundColour);
    let chartOptions = this.statisticsService.getLineChartOptions(lineTension, axisLabels, displayLegend, currency, aboveZero, displayTitles, summaryData.chart.labels);

    return {
      summary: summaryData,
      dataset: chartDataset,
      options: chartOptions
    };
  }

  async checkCompareDate(options: LineChartDataOptions, dataset: any) {
    if (options.date != null) {
      let comparedAverageOrderChartData = await this.constructLineChartData(options);

      dataset = [dataset, comparedAverageOrderChartData.dataset].map(({ datasets }) => datasets);
    } else {
      dataset = [dataset.datasets];
    }

    return dataset;
  }

  generateSubheading(data: any, type: string, filter = false) {
    if (filter) {
      data = data.filter((data: any) => data !== 0);
    }

    let subheading = '0';

    switch (type) {
      case 'average-currency':
        let average = data.length > 0 ? data.reduce((sum: number, data: number) => sum + Number(data), 0) / data.length : 0;
        subheading = `£${average.toFixed(2)}`;
        break;
    }

    return subheading;
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
