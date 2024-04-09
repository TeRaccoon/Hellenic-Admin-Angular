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
  private defaultColours = [];

  constructor(private dataService: DataService) {}

  getMonths() {
    return this.months;
  }

  getDateRange() {
    return this.dateRange.asObservable();
  }

  setDateRange(dateRange: any) {
    this.dateRange.next(dateRange);
  }

  getLineChartData(dataset: any[], label: string, backgroundColours: any[]) {
    return {
      data: dataset,
      label: label,
      backgroundColor: backgroundColours[0],
    };
  }

  getBarChartData(dataset: any[], label: string, backgroundColours: any[], borderRadius: number, labels: string[]) {
    return {
      labels: labels,
      datasets: {
        data: dataset,
        label: label,
        backgroundColor: backgroundColours,
        borderRadius: borderRadius
      }
    };
  }

  getBarChartOptions(yTitle: string, xTitle: string, displayLegend: boolean, stacked: boolean, currency: boolean, labels: any[]): ChartConfiguration['options'] {
    return {
      plugins: {
        legend: {
          display: displayLegend,
        },
      },
      scales: {
        y: {
          title: {
            display: true,
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
              return value;
            }
          }
        },
        x: {
          title: {
            display: true,
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
              return value;
            }
          }
        }
      },
    };
  }

  getLineChartOptions(tension: number, yTitle: string, xTitle: string, displayLegend: boolean, currency: boolean): ChartConfiguration['options'] {
    return {
      plugins: {
        legend: {
          display: displayLegend,
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
            display: true,
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
              return value;
            }
          }
        },
        x: {
          title: {
            display: true,
            text: xTitle,
            color: 'black',
            font: {
              size: 17,
            },
          },
          ticks: {
            callback: function(value) {
              if (value.toString().length > 10) {
                return value.toString().substring(0, 7) + "...";
              }
              return value;
            }
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

    if (monthStart != monthEnd) {
      xLabels = this.getMonths().slice(monthStart, monthEnd + 1);
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

      xLabels = Array(endKey - startKey + 1)
      .fill(null)
      .map((_, index) => startKey + index);

      keyModifier = startKey;
    }

    data = Array(endKey - startKey + 1).fill(0);
    queryData = Array.isArray(queryData)
      ? queryData
      : [queryData];

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
