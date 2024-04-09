import { Injectable } from '@angular/core';
import dayjs, { Dayjs } from 'dayjs';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { DataService } from './data.service';
import { ChartConfiguration, Ticks } from 'chart.js';

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

  getLineChartData(dataset: any[], label: string, fill: boolean) {
    return {
      datasets: {
        data: dataset,
        label: label,
        borderColor: 'rgb(0, 140, 255)',
        pointBackgroundColor: 'rgb(0, 140, 255)',
        backgroundColor: 'rgb(0, 140, 255, 0.4)',
        fill: fill
      }
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
      }
    };
  }

  getBarChartOptions(yTitle: string, xTitle: string, displayLegend: boolean, stacked: boolean, currency: boolean, displayTitles: boolean, labels: any[]): ChartConfiguration['options'] {
    return {
      plugins: {
        legend: {
          display: displayLegend,
        },
        tooltip: {
          callbacks: {
            label: function(tooltipData) {
              if (tooltipData.dataset.label) {
                const formatter = new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'GBP',
                });

                const labels = tooltipData.dataset.label.toString();

                let values = tooltipData.dataset.data[tooltipData.dataIndex]?.toString();
                if (currency) {
                  values = formatter.format(Number(tooltipData.dataset.data[tooltipData.dataIndex]));
                }

                return `${labels}: ${values}`;
              }
              return "";
            }
          }
        }
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
            callback: function(value) {
              if (currency) {
                return '£' + value;
              }
              if (Math.floor(Number(value)) === value) {
                return value;
              }
              return;
            },
          }
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
            callback: function(value) {
              if (labels[Number(value)].toString().length > 10) {
                return labels[Number(value)].toString().substring(0, 7) + "...";
              }
              return labels[Number(value)];
            },
            maxRotation: 0,
            autoSkipPadding: 25
          }
        }
      },
    };
  }

  getLineChartOptions(tension: number, yTitle: string, xTitle: string, displayLegend: boolean, currency: boolean, aboveZero: boolean, displayTitles: boolean, labels: any[]): ChartConfiguration['options'] {
    return {
      plugins: {
        legend: {
          display: displayLegend,
        },
        tooltip: {
          callbacks: {
            label: function(tooltipData) {
              if (tooltipData.dataset.label) {
                const formatter = new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'GBP',
                });

                const labels = tooltipData.dataset.label.toString();

                let values = tooltipData.dataset.data[tooltipData.dataIndex]?.toString();
                if (currency) {
                  values = formatter.format(Number(tooltipData.dataset.data[tooltipData.dataIndex]));
                }

                return `${labels}: ${values}`;
              }
              return "";
            }
          }
        }
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
            text: yTitle,
            color: 'black',
            font: {
              size: 17,
            },
          },
          ticks: {
            callback: function(value) {
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
            text: xTitle,
            color: 'black',
            font: {
              size: 17,
            },
          },
          ticks: {
            callback: function(value) {
              if (labels[Number(value)].toString().length > 10) {
                return labels[Number(value)].toString().substring(0, 7) + "...";
              }
              return labels[Number(value)];
            },
            maxRotation: 0,
            autoSkipPadding: 25
          }
        }
      },
    };
  }

  async buildChart(
    monthStart: number,
    monthEnd: number,
    year: number,
    dateRange: { startDate: Dayjs; endDate: Dayjs },
    dayQuery: string,
    monthQuery: string,
    ignoreDate: boolean,
  ) {
    let data = [];
    let xLabels = [];
    let queryData = null;
    let keyModifier = monthStart + 1;
    let startKey = monthStart;
    let endKey = monthEnd;
    let monthLabels = this.getMonths();

    if (monthStart != monthEnd) {
      xLabels = monthLabels.slice(monthStart, monthEnd + 1);
      queryData = await lastValueFrom(
        this.dataService.collectDataComplex(monthQuery, {
          monthStart: monthStart + 1,
          monthEnd: monthEnd + 1,
          year: year,
        })
      );
    } else {
      startKey = dateRange.startDate.date();
      endKey = dateRange.endDate.date();

      queryData = await lastValueFrom(
        this.dataService.collectDataComplex(dayQuery, {
          dayStart: startKey,
          dayEnd: endKey,
          month: monthStart + 1,
          year: year,
        })
      );

      xLabels = Array(endKey - startKey + 1).fill(null).map((_, index) => monthLabels[monthStart] + ' ' + (startKey + index));

      keyModifier = startKey;
    }

    data = Array(endKey - startKey + 1).fill(0);
    queryData = Array.isArray(queryData) ? queryData : [queryData];

    if (ignoreDate) {
      xLabels = Array(queryData.length);
      for (let order in queryData) {
        data[order] = queryData[order].total;
        xLabels[order] = queryData[order].dateKey;
      }
    } else {
      for (let order in queryData) {
        data[queryData[order].dateKey - keyModifier] =
          queryData[order].total;
      }
    }

    return {
      data,
      labels: xLabels,
    };
  }
}
