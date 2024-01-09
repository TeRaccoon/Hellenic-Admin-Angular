import { Component } from '@angular/core';
import {Chart, ChartConfiguration, ChartItem, registerables} from 'chart.js';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-invoice-breakdown-widget',
  templateUrl: './invoice-breakdown-widget.component.html',
  styleUrls: ['./invoice-breakdown-widget.component.scss'],
})
export class InvoiceBreakdownWidgetComponent {
  barChart: Chart | null = null;
  pieChart: Chart | null = null;

  selectedYear = 2023;
  selectedMonth: number | null = null;

  barChartData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  pieChartData: any[] = [];
  pieChartLabel: string[] = [];

  monthData: any[] = [];

  listData: any[] = [];
  listHeaders = ["Month Total: ", "Invoices: ", "Profit: "];

  constructor(private dataService: DataService) {

  }

  ngOnInit() {
    this.getData();
  }

  ngOnDestroy() {
    if (this.barChart) {
      this.barChart.destroy();
    }
  }

  createBarChart() {
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
        data: this.barChartData,
        borderRadius: 15, //Border radius for the bar
      }]
    };
    const options = {
      scales: {
        y: {
          beginAtZero: true,
          display: false,
        },
      },
      onClick: this.handleBarClick.bind(this) as any,
    };
    const config: ChartConfiguration = {
      type: 'bar',
      data: data,
      options: options
    }
    const chartItem: ChartItem = document.getElementById('bar-chart') as ChartItem;
    this.barChart = new Chart(chartItem, config);
  }

  createPieChart() {
    Chart.register(...registerables);

    const data = {
      labels: this.pieChartLabel,
      datasets: [{
        backgroundColor: [
          "#915db1",
          "#e59f3c",
          "#5397d6",
          "#4cc790",
        ],
        data: this.pieChartData,
        borderRadius: 15,
      }]
    };
    const options = {
      scales: {
        y: {
          beginAtZero: true,
          display: false,
        },
      },
    };
    const config: ChartConfiguration = {
      type: 'pie',
      data: data,
      options: options
    }
    const chartItem: ChartItem = document.getElementById('pie-chart') as ChartItem;
    this.pieChart = new Chart(chartItem, config);
  }

  getData() {
    if (this.selectedYear != null) {
      this.dataService.collectData("invoice-month-totals", this.selectedYear.toString()).subscribe((data: any) => {
        var invoiceData = data;
        if (!Array.isArray(invoiceData)) {
          invoiceData = [invoiceData];
        }
        for (const item of invoiceData) {
          this.barChartData[item.month - 1] = item.total_amount;
        }
        this.createBarChart();
      });
    }
  }

  getPieData() {
    if (this.selectedMonth != null) {
      this.dataService.collectDataComplex("invoiced-item-month-totals", {'month': this.selectedMonth, 'year': this.selectedYear}).subscribe((data: any) => {
        var itemTotalData = data;
        if (!Array.isArray(itemTotalData)) {
          itemTotalData = [itemTotalData];
        }
        itemTotalData.forEach((item: any) => {
          this.pieChartData.push(item.total_quantity);
          this.pieChartLabel.push(item.item_name);
        });
        this.createPieChart();
      });
    }
  }

  getListData() {
    this.dataService.collectDataComplex("total-invoices-month-profit", {'month': this.selectedMonth, 'year': this.selectedYear}).subscribe((data: any) => {
      var invoiceData = data;
      this.listData.push(invoiceData['month_total'].toLocaleString('en-US', { style: 'currency', currency: 'GBP' }));
      this.listData.push(invoiceData['total_invoices']);
      this.listData.push(invoiceData['invoice_profit'].toLocaleString('en-US', { style: 'currency', currency: 'GBP' }));
    });
  }

  handleBarClick(event: MouseEvent, elements: any[]) {
    this.pieChartData = [];
    this.pieChartLabel = [];
    if (elements.length > 0) {
      var index = elements[0].index + 1;
      this.selectedMonth = index;
      this.getPieData();
      this.getListData();
      if (this.pieChart) {
        this.pieChart.destroy();
      }
    }
  }

  changeYear(event: Event) {
    const year = event.target as HTMLInputElement;
    this.selectedYear = Number(year.value);
    this.barChartData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.getData();
    
    if (this.barChart) {
      this.barChart.destroy();
    }
    if (this.pieChart) {
      this.pieChart.destroy();
    }
  }
}
