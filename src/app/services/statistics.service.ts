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

  getLineChartData(
    dataset: any[],
    label: string,
    fill: boolean,
    colour: string | null = null,
    backgroundColor: string | null = null
  ) {
    return {
      datasets: {
        data: dataset,
        label: label,
        borderColor: colour ?? 'rgb(0, 140, 255)',
        pointBackgroundColor: colour ?? 'rgb(0, 140, 255)',
        backgroundColor: backgroundColor ?? 'rgb(0, 140, 255, 0.4)',
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
    yTitle: string,
    xTitle: string,
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
            text: yTitle,
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
            text: xTitle,
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

  async buildChart(
    monthStart: number,
    monthEnd: number,
    year: number,
    dateRange: { startDate: Dayjs; endDate: Dayjs },
    dayQuery: string,
    monthQuery: string,
    ignoreDate: boolean
  ) {
    let data = [];
    let xLabels = [];
    let keyModifier = monthStart + 1;
    let startKey = monthStart;
    let endKey = monthEnd;
    let monthLabels = this.getMonths();

    let queryParams = this.deriveDatePayload(monthStart, monthEnd, year, dateRange, monthQuery, dayQuery);

    let queryData = await lastValueFrom<any>(this.dataService.collectDataComplex(queryParams.query, queryParams.date))
    
    let chartData: any[] = queryData['chart'];
    queryData['report'] = Array.isArray(queryData['report']) ? queryData['report'] : [queryData['report']];

    if (monthStart != monthEnd) {
      xLabels = monthLabels.slice(monthStart, monthEnd + 1);

    } else {
      startKey = dateRange.startDate.date();
      endKey = dateRange.endDate.date();

      xLabels = Array(endKey - startKey + 1)
        .fill(null)
        .map((_, index) => monthLabels[monthStart] + ' ' + (startKey + index));

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

    return {
      chart: {
        data,
        labels: xLabels,
      },
      report : {
        data: queryData['report'],
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
        date: 
        {
          monthStart: monthStart + 1,
          monthEnd: monthEnd + 1,
          year: year,
        }
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
      }
    };
  }
}
