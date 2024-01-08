import { Component } from '@angular/core';
import {Chart, ChartConfiguration, ChartItem, registerables} from 'chart.js';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-invoice-breakdown-widget',
  templateUrl: './invoice-breakdown-widget.component.html',
  styleUrls: ['./invoice-breakdown-widget.component.scss'],
})
export class InvoiceBreakdownWidgetComponent {
  chart: Chart | null = null;

  selectedYear = 2023;

  chartData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  constructor(private dataService: DataService) {

  }

  ngOnInit() {
    this.getData();
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  createChart() {
    Chart.register(...registerables);

    const data = {
      labels: ['January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'],
      datasets: [{
        
        // Put all styles here but instead 'border-radius' do 'borderRadius' so get rid of the dash and do the next word uppercase

        backgroundColor: 'blue', //Colour of the bar itself
        borderColor: 'blue', //Border colour of the tooltip when you hover over the bar
        data: this.chartData,
        borderRadius: 15, //Border radius for the bar
      }]
    };
    const options = {
      scales: {
        y: {
          beginAtZero: true,
          display: false,
        }
      }
    };
    const config: ChartConfiguration = {
      type: 'bar',
      data: data,
      options: options
    }
    const chartItem: ChartItem = document.getElementById('my-chart') as ChartItem;
    this.chart = new Chart(chartItem, config);
  }

  getData() {
    if (this.selectedYear != null) {
      this.dataService.collectData("invoice-month-totals", this.selectedYear.toString()).subscribe((data: any) => {
        var invoice_data = data;
        if (!Array.isArray(invoice_data)) {
          invoice_data = [invoice_data];
        }
        for (const item of invoice_data) {
          this.chartData[item.month - 1] = item.total_amount;
        }
        this.createChart();
      });
    }
  }

  changeYear(event: Event) {
    const year = event.target as HTMLInputElement;
    this.selectedYear = Number(year.value);
    this.getData();
    this.chartData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
