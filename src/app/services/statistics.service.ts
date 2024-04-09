import { Injectable } from '@angular/core';
import dayjs, { Dayjs } from 'dayjs';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { DataService } from './data.service';
import { ChartConfiguration } from 'chart.js';

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

  getBarChartOptions(yTitle: string, xTitle: string, displayLegend: boolean, stacked: boolean) {
    return {
      plugins: {
        legend: {
          display: displayLegend
        }
      },
      scales: {
        y: {
          title: {
            display: true,
            text: yTitle
          },
          stacked: stacked,
        },
        x: {
          title: {
            display: true,
            text: xTitle
          },
          stacked: stacked,
        }
      },
    };
  }

  getLineChartOptions(tension: number, yTitle: string, xTitle: string, displayLegend: boolean): ChartConfiguration['options'] {
    return {
      plugins: {
        legend: {
          display: displayLegend
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
            display: true,
            text: yTitle
          },
        },
        x: {
          title: {
            display: true,
            text: xTitle
          },
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
      xLabels = this.getMonths().slice(monthStart, monthEnd);
      queryData = await lastValueFrom(
        this.dataService.collectDataComplex(monthQuery, {
          monthStart: monthStart + 1,
          monthEnd: monthEnd + 1,
        })
      );
    } else {
      startKey = dateRange.startDate.date();
      endKey = dateRange.endDate.date();

      xLabels = Array(endKey - startKey + 1)
        .fill(null)
        .map((_, index) => startKey + index);

      queryData = await lastValueFrom(
        this.dataService.collectDataComplex(dayQuery, {
          dayStart: startKey,
          dayEnd: endKey,
          month: monthStart + 1,
          year: year,
        })
      );

      keyModifier = startKey;
    }

    data = Array(endKey - startKey + 1).fill(0);
    queryData = Array.isArray(queryData)
      ? queryData
      : [queryData];

    if (ignoreDate) {
      for (let order in queryData) {
        data[order] = queryData[order].total;
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
