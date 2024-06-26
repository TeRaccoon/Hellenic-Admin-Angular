import { Component } from '@angular/core';
import { StatisticsService } from '../../services/statistics.service';
import dayjs, { Dayjs } from 'dayjs';
import utcPlugin from 'dayjs/plugin/utc';
import { chart, report } from '../../common/types/statistics/types';
import { chartIcons } from '../../common/icons/chart-icons';
import { lastValueFrom } from 'rxjs';

dayjs.extend(utcPlugin);

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent {
  icons = chartIcons;

  reportChart: { chart: chart; report: report } | null = null;

  selected: { startDate: Dayjs; endDate: Dayjs } = {
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

    let average =
    statisticsData.chart.data.reduce((sum, data) => (sum += data)) /
    statisticsData.chart.data.filter((data) => data != 0).length;
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
      headers: ['Date', 'Gross Sales', 'Discounts', 'Orders', 'Average Order Value'],
      dataTypes: ['text', 'currency', 'percentage', 'int', 'currency'],
      formatted: false
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

    let total = statisticsData.chart.data.reduce((sum, data) => (sum += data));

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
      headers: ['Date', 'Orders', 'Average Units Ordered', 'Average Order Value'],
      dataTypes: ['text', 'int', 'number', 'currency'],
      formatted: false
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
      headers: ['Item Name', 'Product Vendor', 'Product Type', 'Net Quantity', 'Gross Sales', 'Discounts', 'Net Sales', 'VAT', 'Total Sales'],
      dataTypes: ['text', 'text', 'text', 'int', 'int', 'percentage', 'currency', 'currency', 'currency'],
      formatted: false
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

    total = statisticsData.chart.data.reduce((sum, data) => (sum += data)).toFixed(2);

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
      headers: ['Date', 'Orders', 'Discounts', 'Net Sales', 'Tax', 'Gross Sales'],
      dataTypes: ['text', 'int', 'currency', 'currency', 'currency', 'currency'],
      formatted: false
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

    let recurringTotal = statisticsData.chart.data.reduce((sum, data) => (sum += data));

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

    let firstTimeTotal = statisticsData.chart.data.reduce((sum, data) => (sum += data));
    let percentage = (
      (recurringTotal / (firstTimeTotal + recurringTotal)) *
      100
    ).toFixed(2);

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
      formatted: false
    });
  }

  async setReportChart(chart: chart | null, index?: number) {
    if (chart != null && index != null) {  
      let report: report = this.reports[index];
      
      if (!report.formatted) {
        report = this.formatReport(report);
      }

      this.reportChart = {chart, report};
    } else {
      this.reportChart = null;
    }
  }

  formatReport(report: report) {
    let keys = Object.keys(report.data[0]);
    let dataTypes = report.dataTypes;

    let monthStart = this.selected.startDate.month();
    let monthEnd = this.selected.endDate.month();
    if (report.data[0].dateKey) {
      report.data.forEach((reportRow: any) => {
        this.formatObject(reportRow, keys, dataTypes);           
      });

      let limit = monthStart == monthEnd ? this.selected.endDate.daysInMonth() : 12;

      for (let day = 1; day <= limit; day++) {
        if (!report.data.find((data: any) => data.dateKey == day)) {
          let newData = keys.reduce((acc, key, index) => {
            acc[key] = this.formatValue(report.dataTypes[index]);
            return acc;
          }, {} as any);

          newData['dateKey'] = day;
          report.data.push(newData);
        }
      }
    } else {
      report.data.forEach((reportRow: any) => {
        this.formatObject(reportRow, keys, dataTypes);           
      });
    }

    report.data.sort((a: any, b: any) => a.dateKey - b.dateKey);
    report.formatted = true;

    return report;
  }

  formatObject(reportRow: any, keys: string[], dataTypes: string[]) {
    keys.forEach((key, index) => {
      if (key !== 'dateKey' && key !== 'key') {
        reportRow[key] = this.formatValue(dataTypes[index], reportRow[key]);
      }
    });

    return reportRow;
  }

  formatValue(type: string, value: string | null = null) {
    switch (type) {
      case 'currency':
        return value == null ? '£0.00' : 
        new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' })
        .format(Number(value));

      case 'percentage':
        return value == null ? '0.00%' : `${Number(value).toFixed(2)}%`;

      case 'number':
        return value == null ? '0.00' : `${Number(value).toFixed(2)}`;

      case 'int':
        return value == null ? '0' : `${Number(value).toFixed(0)}`;

      case 'text':
        return value ?? '---';

      default:
        return '---';
    }
  }

  getKeys(row: any) {
    return Object.keys(row);
  }

  hasKey(row: any, key: any) {
    return row[key] != undefined;
  }
}
