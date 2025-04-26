import { Injectable } from '@angular/core';
import dayjs, { Dayjs } from 'dayjs';
import { DataService } from './data.service';
import { ChartConfiguration } from 'chart.js';
import {
  AxisLabels,
  LineChartConfig,
  LineChartDataOptions,
  LineChartOptions,
  Report,
  ReportOptions,
  SelectedDate,
  SubheadingType,
  SubheadingOptions,
  Chart
} from '../common/types/statistics/types';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  constructor(private dataService: DataService) { }

  getMonths() {
    return this.months;
  }

  getLineChartData(
    dataset: any[],
    label: string,
    fill = true,
    colour = 'rgb(0, 140, 255)',
    backgroundColour = 'rgb(0, 140, 255, 0.4)'
  ) {
    return {
      datasets: {
        data: dataset,
        label: label,
        borderColor: colour,
        pointBackgroundColor: colour,
        backgroundColor: backgroundColour,
        fill: fill,
      },
    };
  }

  getBarChartData(dataset: any[], label: string, borderRadius: number) {
    return {
      datasets: {
        data: dataset,
        label: label,
        backgroundColor: 'rgb(0, 140, 255, 0.4)',
        borderColor: 'rgb(0, 140, 255)',
        borderRadius: borderRadius,
        borderWidth: 3,
      },
    };
  }

  getPieChartData(
    data: any[],
    labels: string,
    backgroundColor: string[] | string = 'rgb(0, 140, 255, 0.4)',
    borderColour: string[] | string = 'rgb(0, 140, 255)'
  ) {
    return {
      datasets: {
        data: data,
        label: labels,
        backgroundColor: backgroundColor,
        borderColor: borderColour,
      },
    };
  }

  getBarChartOptions(
    yTitle: string,
    xTitle: string,
    labels: any[],
    displayLegend: boolean = false,
    stacked: boolean = false,
    currency: boolean = false,
    displayTitles: boolean = true
  ): ChartConfiguration['options'] {
    return {
      plugins: {
        legend: {
          display: displayLegend,
        },
        tooltip: {
          callbacks: {
            label: function (tooltipData) {
              if (tooltipData.dataset.label) {
                const formatter = new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'GBP',
                });

                const labels = tooltipData.dataset.label.toString();

                let values =
                  tooltipData.dataset.data[tooltipData.dataIndex]?.toString();
                if (currency) {
                  values = formatter.format(
                    Number(tooltipData.dataset.data[tooltipData.dataIndex])
                  );
                }

                return `${labels}: ${values}`;
              }
              return '';
            },
          },
        },
      },
      scales: {
        y: {
          title: {
            display: displayTitles,
            text: yTitle,
            color: 'black',
            font: {
              size: 17,
            },
          },
          stacked: stacked,
          ticks: {
            callback: function (value) {
              if (currency) {
                return '£' + value;
              }
              if (Math.floor(Number(value)) === value) {
                return value;
              }
              return;
            },
          },
        },
        x: {
          title: {
            display: displayTitles,
            text: xTitle,
            color: 'black',
            font: {
              size: 17,
            },
          },
          stacked: stacked,
          ticks: {
            callback: function (value) {
              if (labels[Number(value)].toString().length > 10) {
                return labels[Number(value)].toString().substring(0, 7) + '...';
              }
              return labels[Number(value)];
            },
            maxRotation: 0,
            autoSkipPadding: 25,
          },
        },
      },
    };
  }

  getLineChartOptions(
    tension: number,
    axisLabels: AxisLabels,
    labels: any[],
    displayLegend: boolean,
    currency: boolean,
    aboveZero: boolean,
    displayTitles: boolean
  ): ChartConfiguration['options'] {
    return {
      plugins: {
        legend: {
          display: displayLegend,
        },
        tooltip: {
          callbacks: {
            label: function (tooltipData) {
              if (tooltipData.dataset.label) {
                const formatter = new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'GBP',
                });

                const labels = tooltipData.dataset.label.toString();

                let values =
                  tooltipData.dataset.data[tooltipData.dataIndex]?.toString();
                if (currency) {
                  values = formatter.format(
                    Number(tooltipData.dataset.data[tooltipData.dataIndex])
                  );
                }

                return `${labels}: ${values}`;
              }
              return '';
            },
          },
        },
      },
      elements: {
        line: {
          tension: tension,
        },
      },
      scales: {
        y: {
          position: 'left',
          title: {
            display: displayTitles,
            text: axisLabels.y,
            color: 'black',
            font: {
              size: 17,
            },
          },
          ticks: {
            callback: function (value) {
              if (currency) {
                return '£' + value;
              }
              if (Math.floor(Number(value)) === value) {
                return value;
              }
              return;
            },
          },
          min: aboveZero ? 0 : undefined,
        },
        x: {
          title: {
            display: displayTitles,
            text: axisLabels.x,
            color: 'black',
            font: {
              size: 17,
            },
          },
          ticks: {
            callback: function (value) {
              if (labels[Number(value)].toString().length > 10) {
                return labels[Number(value)].toString().substring(0, 7) + '...';
              }
              return labels[Number(value)];
            },
            maxRotation: 0,
            autoSkipPadding: 25,
          },
        },
      },
    };
  }

  getPieChartOptions(displayLegend: boolean, currency: boolean, rotation = 0) {
    return {
      plugins: {
        legend: {
          display: displayLegend,
        },
        tooltip: {
          callbacks: {
            label: function (tooltipData: any) {
              const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'GBP',
              });

              const label = tooltipData.label || '';
              let value = tooltipData.raw;

              if (currency) {
                value = formatter.format(Number(value));
              }

              return `${label}: ${value}`;
            },
          },
        },
      },
      rotation: rotation,
    };
  }

  generateSubheading(data: any, chartDatasets: any[], type: SubheadingType, filter = false) {
    if (filter) {
      data = data.filter((data: any) => data !== 0);
    }

    let subheading = '0';

    switch (type) {
      case SubheadingType.AverageCurrency:
        let average =
          data.length > 0
            ? data.reduce(
              (sum: number, data: number) => sum + Number(data),
              0
            ) / data.length
            : 0;
        subheading = `£${average.toFixed(2)}`;
        break;

      case SubheadingType.AverageDualComparative:
        console.log(chartDatasets);
        break;
    }

    return subheading;
  }

  stripAndConvert(value: string): any {
    if (typeof value === 'string') {
      return parseFloat(value.replace(/[£,]/g, ''));
    }
    return value;
  }

  async checkCompareDate(options: LineChartDataOptions, dataset: any) {
    if (options.date != null) {
      let comparedAverageOrderChartData = await this.constructLineChartData(
        options
      );

      dataset = [dataset, comparedAverageOrderChartData.dataset].map(
        ({ datasets }) => datasets
      );
    } else {
      dataset = [dataset.datasets];
    }

    return dataset;
  }

  async constructLineChart(
    options: LineChartOptions,
    subheadingOptions: SubheadingOptions,
    reportOptions: ReportOptions,
    heading: string,
    filter?: string
  ): Promise<{ chart: Chart, report: Report }> {
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
        'rgb(0, 140, 100)',
      ],
      backgroundColours = [
        'rgb(0, 140, 255, 0.4)',
        'rgb(0, 0, 255, 0.4)',
        'rgb(0, 200, 255, 0.4)',
        'rgb(0, 140, 200, 0.4)',
        'rgb(0, 140, 100, 0.4)',
      ],
      secondaryColours = [
        'rgb(255, 97, 18)',
        'rgb(255, 20, 200)',
        'rgb(255, 117, 0)',
        'rgb(255, 97, 38)',
        'rgb(255, 117, 58)',
      ],
      secondaryBackgroundColours = [
        'rgb(255, 97, 18, 0.4)',
        'rgb(255, 20, 200, 0.4)',
        'rgb(255, 117, 0, 0.4)',
        'rgb(255, 97, 38, 0.4)',
        'rgb(255, 117, 58, 0.4)',
      ],
      lineTension = 0.3,
    } = options;

    let dataQueries = Array.isArray(queries) ? queries : [queries];
    let dataLabelsPrimary = Array.isArray(chartLabels!.primary)
      ? chartLabels!.primary
      : [chartLabels!.primary];
    let dataLabelsSecondary = Array.isArray(chartLabels!.secondary)
      ? chartLabels!.secondary
      : [chartLabels!.secondary];

    let chartDatasets = [];
    let chartData: any;

    for (let index = 0; index < dataQueries.length; index++) {
      chartData = await this.constructLineChartData({
        date: date!,
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
        lineTension: lineTension,
        filter,
      });

      chartData.dataset = await this.checkCompareDate(
        {
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
          lineTension: lineTension,
        },
        chartData.dataset
      );

      chartDatasets.push(...chartData.dataset);
    }

    let subheading = this.generateSubheading(
      chartData.summary.chart.data,
      chartDatasets,
      subheadingOptions.type,
      subheadingOptions.filter
    );

    return {
      chart: {
        data: {
          datasets: chartDatasets,
          labels: chartData.summary.chart.labels,
        },
        options: chartData.options,
        type: 'line',
        heading: heading,
        subheading: subheading,
        queries: queries,
      },
      report: {
        data: chartData.summary.report.data,
        headers: reportOptions.headers,
        dataTypes: reportOptions.dataTypes,
        formatted: reportOptions.formatted,
        filters: reportOptions.filters,
        keys: reportOptions.keys,
      }
    };
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
      lineTension = 0.3,
      filter,
    } = options;

    let summaryData = await this.buildChart(
      date ?? {
        startDate: dayjs().startOf('month'),
        endDate: dayjs().endOf('month'),
      },
      query,
      ignoreDate,
      format,
      filter
    );
    let chartDataset: any = this.getLineChartData(
      summaryData.chart.data,
      chartLabel,
      fillLine,
      colour,
      backgroundColour
    );
    let chartOptions = this.getLineChartOptions(
      lineTension,
      axisLabels,
      summaryData.chart.labels,
      displayLegend,
      currency,
      aboveZero,
      displayTitles
    );

    return {
      summary: summaryData,
      dataset: chartDataset,
      options: chartOptions,
    };
  }

  async buildChart(
    dateRange: SelectedDate,
    query: string,
    ignoreDate: boolean,
    format = 'standard',
    filter: string | null = null
  ) {
    let data = [];
    let xLabels = [];
    let monthStart =
      dateRange!.startDate?.month() ?? dayjs().startOf('month').month();
    let monthEnd =
      dateRange!.endDate?.month() ?? dayjs().endOf('month').month();
    let group = monthStart != monthEnd ? 'month' : 'day';

    let keyModifier = monthStart + 1;
    let startKey = monthStart;
    let endKey = monthEnd;
    let monthLabels = this.getMonths();

    if (dateRange.startDate != null && dateRange.endDate != null) {
      let queryData = await this.dataService.processGet(query, {
        start: dateRange.startDate.toISOString().slice(0, 19).replace('T', ' '),
        end: dateRange.endDate.toISOString().slice(0, 19).replace('T', ' '),
        group: group,
        filter: filter,
      });

      let chartData: any[] = queryData['chart'];
      queryData['report'] = Array.isArray(queryData['report'])
        ? queryData['report']
        : [queryData['report']];

      if (format == 'standard') {
        if (monthStart != monthEnd) {
          xLabels = monthLabels.slice(monthStart, monthEnd + 1);
        } else {
          startKey = dateRange.startDate.date();
          endKey = dateRange.endDate.date();

          xLabels = Array(endKey - startKey + 1)
            .fill(null)
            .map(
              (_, index) => monthLabels[monthStart] + ' ' + (startKey + index)
            );

          keyModifier = startKey;
        }

        data = Array(endKey - startKey + 1).fill(0);
        chartData = Array.isArray(chartData) ? chartData : [chartData];

        if (ignoreDate) {
          xLabels = Array(chartData.length);
          for (let order in chartData) {
            data[order] = chartData[order].total;
            xLabels[order] = chartData[order].dateKey;
          }
        } else {
          for (let order in chartData) {
            data[chartData[order].dateKey - keyModifier] =
              chartData[order].total;
          }
        }
      } else {
        xLabels = Object.keys(chartData);
        data = Object.values(chartData);
      }

      return {
        chart: {
          data,
          labels: xLabels,
        },
        report: {
          data: queryData['report'],
        },
      };
    }
    return {
      chart: {
        data: [],
        labels: [],
      },
      report: {
        data: [],
      },
    };
  }

  deriveDatePayload(
    monthStart: number,
    monthEnd: number,
    year: number,
    dateRange: { startDate: Dayjs; endDate: Dayjs },
    monthQuery: string,
    dayQuery: string
  ) {
    if (monthStart != monthEnd) {
      return {
        query: monthQuery,
        date: {
          monthStart: monthStart + 1,
          monthEnd: monthEnd + 1,
          year: year,
        },
      };
    }

    let startKey = dateRange.startDate.date();
    let endKey = dateRange.endDate.date();

    return {
      query: dayQuery,
      date: {
        dayStart: startKey,
        dayEnd: endKey,
        month: monthStart + 1,
        year: year,
      },
    };
  }

  formatReport(report: Report, selectedDate: SelectedDate) {
    let keys = report.keys;
    let dataTypes = report.dataTypes;

    if (selectedDate.startDate != null && selectedDate.endDate != null) {
      let startDate = selectedDate.startDate;
      let endDate = selectedDate.endDate;

      if (report.data[0].dateKey) {
        report.data.forEach((reportRow) => {
          this.formatObject(reportRow, keys, dataTypes);
        });

        let currentDate = startDate.clone();
        while (
          currentDate.isBefore(endDate, 'day') ||
          currentDate.isSame(endDate, 'day')
        ) {
          let dateString = currentDate.format('DD-MM-YYYY');
          if (!report.data.find((data) => data.dateKey === dateString)) {
            let newData: any = keys.reduce((acc: any, key, index) => {
              acc[key] = this.formatValue(report.dataTypes[index]);
              return acc;
            }, {});
            newData['empty'] = true;
            newData['dateKey'] = dateString;
            report.data.push(newData);
          }
          currentDate = currentDate.add(1, 'day');
        }
      } else {
        report.data.forEach((reportRow) => {
          this.formatObject(reportRow, keys, dataTypes);
        });
      }
      if (report.sort) {
        report.data.sort((a, b) => {
          const datePartsA = a.dateKey.split('-');
          const datePartsB = b.dateKey.split('-');

          const dateA = new Date(datePartsA[2], datePartsA[1] - 1, datePartsA[0]);
          const dateB = new Date(datePartsB[2], datePartsB[1] - 1, datePartsB[0]);

          return dateA.getTime() - dateB.getTime();
        });
      }

      report.formatted = true;

      return report;
    }
    return report;
  }

  formatObject(reportRow: any, keys: string[], dataTypes: string[]) {
    let empty = true;
    keys.forEach((key, index) => {
      empty = true;
      if (key !== 'dateKey' && key !== 'key') {
        reportRow[key] = this.formatValue(dataTypes[index], reportRow[key]);
        empty = false;
      } else if (key === 'dateKey') {
        reportRow[key] = dayjs(reportRow[key]).format('DD-MM-YYYY');
      }
    });

    reportRow['empty'] = empty;

    return reportRow;
  }

  formatValue(type: string, value: string | null = null) {
    switch (type) {
      case 'currency':
        return value == null
          ? '£0.00'
          : new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: 'GBP',
          }).format(Number(value));

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

  getDefaultLineChartConfig(initialDate: SelectedDate, compareDate: SelectedDate): LineChartConfig[] {
    const dateLabel = {
      primary:
        initialDate.startDate!.format('DD MMM').toString() +
        ' to ' +
        initialDate.endDate!.format('DD MMM').toString(),
      secondary:
        compareDate?.startDate!.format('DD MMM').toString() +
        ' to ' +
        compareDate?.endDate!.format('DD MMM').toString(),
    };

    return [
      {
        lineChartOptions: {
          date: initialDate,
          compareDate: compareDate,
          queries: 'average-invoice-value',
          chartLabels: {
            primary: compareDate != null ? dateLabel.primary : 'Total Value',
            secondary:
              compareDate?.startDate && compareDate.endDate
                ? dateLabel.secondary
                : 'Total Value',
          },
          axisLabels: { x: 'Date', y: 'Order Value (£)' }
        },
        subheadingOptions: {
          type: SubheadingType.AverageCurrency,
          filter: true
        },
        reportOptions: {
          headers: ['Date', 'Gross Sales', 'Discounts', 'Orders', 'Average Order Value'],
          dataTypes: ['text', 'currency', 'currency', 'int', 'currency'],
          formatted: false,
          filters: [
            { name: 'Hide Empty Rows', predicate: (value: any) => !value.empty },
            { name: 'Show Only Empty Rows', predicate: (value: any) => value.empty },
          ],
          keys: ['dateKey', 'total', 'discounts', 'orders', 'average']
        },
        heading: 'Average Order Value'
      },
      {
        lineChartOptions: {
          date: initialDate,
          compareDate: compareDate,
          queries: 'total-invoices',
          chartLabels: {
            primary: compareDate != null ? dateLabel.primary : 'Total Value',
            secondary:
              compareDate?.startDate && compareDate.endDate
                ? dateLabel.secondary
                : 'Total Value',
          },
          axisLabels: { x: 'Date', y: 'Order Amount' }
        },
        subheadingOptions: {
          type: SubheadingType.AverageCurrency,
          filter: true
        },
        reportOptions: {
          headers: ['Date', 'Orders', 'Average Units Ordered', 'Average Order Value'],
          dataTypes: ['text', 'int', 'number', 'currency'],
          formatted: false,
          filters: [
            { name: 'Hide Empty Rows', predicate: (value: any) => !value.empty },
            { name: 'Show Only Empty Rows', predicate: (value: any) => value.empty },
          ],
          keys: ['dateKey', 'total_orders', 'average_units_ordered', 'average_order_value']
        },
        heading: 'Total Orders'
      },
      {
        lineChartOptions: {
          date: initialDate,
          compareDate: compareDate,
          queries: 'total-invoice-value',
          chartLabels: {
            primary: compareDate != null ? dateLabel.primary : 'Total Orders',
            secondary:
              compareDate?.startDate && compareDate.endDate
                ? dateLabel.secondary
                : 'Total Orders',
          },
          axisLabels: { x: 'Date', y: 'Total Value' }
        },
        subheadingOptions: {
          type: SubheadingType.AverageCurrency,
          filter: true
        },
        reportOptions: {
          headers: ['Date', 'Orders', 'Discounts', 'Net Sales', 'Tax', 'Gross Sales'],
          dataTypes: ['text', 'int', 'currency', 'currency', 'currency', 'currency'],
          formatted: false,
          filters: [
            { name: 'Hide Empty Rows', predicate: (value: any) => !value.empty },
            { name: 'Show Only Empty Rows', predicate: (value: any) => value.empty },
          ],
          keys: ['dateKey', 'total_orders', 'discounts', 'net', 'tax', 'total']
        },
        heading: 'Total Invoices Value'
      },
      {
        lineChartOptions: {
          date: initialDate,
          compareDate: compareDate,
          queries: ['recurring-customers', 'non-recurring-customers'],
          chartLabels: {
            primary:
              compareDate != null
                ? [
                  `${dateLabel.primary}: Recurring`,
                  `${dateLabel.primary}: First Time`,
                ]
                : ['Recurring', 'First Time'],
            secondary:
              compareDate?.startDate && compareDate.endDate
                ? [
                  `${dateLabel.secondary}: Recurring`,
                  `${dateLabel.secondary}: First Time`,
                ]
                : 'Total Value',
          },
          axisLabels: { x: '', y: 'Total Sales' },
          currency: false,
          displayLegend: true
        },
        subheadingOptions: {
          type: SubheadingType.AverageDualComparative,
          filter: true
        },
        reportOptions: {
          headers: ['Date', 'Customers', 'Customer Type'],
          dataTypes: ['text', 'int', 'text'],
          formatted: false,
          filters: [
            { name: 'Hide Empty Rows', predicate: (value: any) => !value.empty },
            { name: 'Show Only Empty Rows', predicate: (value: any) => value.empty },
            {
              name: 'Recurring Only',
              predicate: (value: any) => value.customer_type == 'First Time',
            },
            {
              name: 'First Time Only',
              predicate: (value: any) => value.customer_type == 'Recurring',
            },
          ],
          keys: ['dateKey', 'total', 'type']
        },
        heading: 'Recurring Customers'
      }
    ]
  }

  getItemLineChartConfig(initialDate: SelectedDate, compareDate: SelectedDate, selectedItem: string): LineChartConfig[] {
    const dateLabel = {
      primary:
        initialDate.startDate!.format('DD MMM').toString() +
        ' to ' +
        initialDate.endDate!.format('DD MMM').toString(),
      secondary:
        compareDate?.startDate!.format('DD MMM').toString() +
        ' to ' +
        compareDate?.endDate!.format('DD MMM').toString(),
    };

    return [
      {
        lineChartOptions: {
          date: initialDate,
          compareDate: compareDate,
          queries: 'item-sales-per-period',
          chartLabels: {
            primary: compareDate != null ? dateLabel.primary : 'Total Value',
            secondary:
              compareDate?.startDate && compareDate.endDate
                ? dateLabel.secondary
                : 'Total Value',
          },
          axisLabels: { x: 'Date', y: 'Total Sales (£)' }
        },
        subheadingOptions: {
          type: SubheadingType.AverageCurrency,
          filter: false
        },
        reportOptions: {
          headers: ['Date', 'Gross Sales', 'Discounts', 'Orders', 'Average Order Value'],
          dataTypes: ['text', 'currency', 'currency', 'int', 'currency'],
          formatted: false,
          filters: [
            { name: 'Hide Empty Rows', predicate: (value: any) => !value.empty },
            { name: 'Show Only Empty Rows', predicate: (value: any) => value.empty },
          ],
          keys: ['dateKey', 'total', 'discounts', 'orders', 'average']
        },
        heading: 'Sales Per Period',
        filter: selectedItem
      }
    ]
  }
}
