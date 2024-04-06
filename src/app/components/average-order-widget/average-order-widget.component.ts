import { Component } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { StatisticsService } from '../../services/statistics.service';
import { Dayjs } from 'dayjs';
import { DataService } from '../../services/data.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-average-order-widget',
  templateUrl: './average-order-widget.component.html',
  styleUrl: './average-order-widget.component.scss'
})
export class AverageOrderWidgetComponent {
  dateRange: { start: Dayjs; end: Dayjs; } | null = null;
  lineChartData: ChartConfiguration['data'] = {datasets: []};

  constructor(private statisticsService: StatisticsService, private dataService: DataService) {}

  ngOnInit() {
    this.statisticsService.getDateRange().subscribe((dateRange: any) => {
      this.dateRange = dateRange;
      this.buildChart();
    });
  }

  async buildChart() {
    if (this.dateRange?.start != null && this.dateRange?.end != null) {
      
      let monthStart = this.dateRange.start.month();
      let monthEnd = this.dateRange.end.month() + 1;
      if (monthStart != monthEnd) {
        let xLabels = this.statisticsService.getMonths().slice(monthStart, monthEnd);

        let totalOrderData = await lastValueFrom(this.dataService.collectDataComplex("total-invoices-per-month", {"monthStart": monthStart, "monthEnd": monthEnd}));
        let totalOrders = Array(monthEnd - monthStart).fill(0);

        for(let order in totalOrderData) {
          totalOrders[Number(order)] = totalOrderData[order].total;
        }

        let backgroundColor = ["rgba(77,83,96,0.2)"];
        let dataset = this.statisticsService.getLineChartData(totalOrders, "Total Orders", backgroundColor);
        this.lineChartData = {
          datasets: [dataset],
          labels: xLabels
        }
      }
    }
  }

  lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5,
      },
    },
    scales: {
      y: {
        position: 'left',
      },
      y1: {
        position: 'right',
        grid: {
          color: 'rgba(255,0,0,0.3)',
        },
        ticks: {
          display: false,
        },
      },
    },
  };

  lineChartType: ChartType = 'line';
}
