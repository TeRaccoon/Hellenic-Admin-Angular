import { Injectable } from '@angular/core';
import dayjs, { Dayjs } from 'dayjs';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { DataService } from './data.service';
import { ChartConfiguration } from 'chart.js';
import { axisLabels, report, selectedDate } from '../common/types/statistics/types';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private dateRange = new BehaviorSubject<{ startDate: Dayjs; endDate: Dayjs }>(
    { startDate: dayjs().startOf('month'), endDate: dayjs().endOf('month') }
  );
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

  constructor(private dataService: DataService) {}

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
    displayLegend: boolean,
    stacked: boolean,
    currency: boolean,
    displayTitles: boolean,
    labels: any[]
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
    axisLabels: axisLabels,
    displayLegend: boolean,
    currency: boolean,
    aboveZero: boolean,
    displayTitles: boolean,
    labels: any[]
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

  async buildChart(
    dateRange: selectedDate,
    query: string,
    ignoreDate: boolean,
    format = 'standard'
  ) {
    let data = [];
    let xLabels = [];
    let monthStart = dateRange!.startDate?.month() ?? dayjs().startOf('month').month();
    let monthEnd = dateRange!.endDate?.month() ?? dayjs().endOf('month').month();
    let group = monthStart != monthEnd ? 'month' : 'day';

    let keyModifier = monthStart + 1;
    let startKey = monthStart;
    let endKey = monthEnd;
    let monthLabels = this.getMonths();

    if (dateRange.startDate != null && dateRange.endDate != null) {
      let queryData = await lastValueFrom<any>(
        this.dataService.collectDataComplex(query, {
          start: dateRange.startDate.toISOString().slice(0, 19).replace('T', ' '),
          end: dateRange.endDate.toISOString().slice(0, 19).replace('T', ' '),
          group: group,
        })
      );
  
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
            data[chartData[order].dateKey - keyModifier] = chartData[order].total;
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
    }
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

  formatReport(report: report, selectedDate: selectedDate) {
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
            while (currentDate.isBefore(endDate, 'day') || currentDate.isSame(endDate, 'day')) {
                let dateString = currentDate.format('DD-MM-YYYY');
                if (!report.data.find(data => data.dateKey === dateString)) {
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
        report.data.sort((a, b) => {
          const datePartsA = a.dateKey.split('-');
          const datePartsB = b.dateKey.split('-');
          
          const dateA = new Date(datePartsA[2], datePartsA[1] - 1, datePartsA[0]);
          const dateB = new Date(datePartsB[2], datePartsB[1] - 1, datePartsB[0]);
          
          return dateA.getTime() - dateB.getTime();
        });
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
}
