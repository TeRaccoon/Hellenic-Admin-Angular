import { Component } from '@angular/core';
import { Chart, ChartConfiguration, ChartItem, registerables } from 'chart.js';
import { DataService } from '../../services/data.service';
import { lastValueFrom } from 'rxjs';

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
  listHeaders = ['Month Total: ', 'Invoices: ', 'Profit: '];

  constructor(private dataService: DataService) {}

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
      labels: [
        'January',
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
        'December',
      ],
      datasets: [
        {
          backgroundColor: '#2281fe', //Colour of the bar itself
          borderColor: 'blue', //Border colour of the tooltip when you hover over the bar
          data: this.barChartData,
          borderRadius: 15, //Border radius for the bar
        },
      ],
    };
    const options = {
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            text: 'Income (£)',
            display: true,
            color: 'black',
            font: {
              size: '20',
            },
          },
        },
      },
      onClick: this.handleBarClick.bind(this) as any,
    };
    const config: ChartConfiguration = {
      type: 'bar',
      data: data,
      options: options,
    };
    const chartItem: ChartItem = document.getElementById(
      'bar-chart'
    ) as ChartItem;
    this.barChart = new Chart(chartItem, config);
  }

  createPieChart() {
    Chart.register(...registerables);

    const data = {
      labels: this.pieChartLabel,
      datasets: [
        {
          backgroundColor: ['#0740a9', '#2281fe', '#3f3f46', '#0098ff'],
          data: this.pieChartData,
          borderRadius: 5,
        },
      ],
    };
    const options = {
      plugins: {
        legend: {
          align: 'start' as 'start' | 'end' | 'center' | undefined,
          labels: {
            font: {
              size: 14,
            },
            color: 'black',
          },
        },
      },
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
      options: options,
    };
    const chartItem: ChartItem = document.getElementById(
      'pie-chart'
    ) as ChartItem;
    this.pieChart = new Chart(chartItem, config);
  }

  async getData() {
    if (this.selectedYear != null) {
      let invoiceMonthTotals = await lastValueFrom(this.dataService.collectData('invoice-month-totals', this.selectedYear.toString()));

      if (invoiceMonthTotals != null) {
        if (!Array.isArray(invoiceMonthTotals)) {
          invoiceMonthTotals = [invoiceMonthTotals];
        }

        for (const item of invoiceMonthTotals) {
          this.barChartData[item.month - 1] = item.total_amount;
        }

        this.createBarChart();
      }
    }
  }

  async getPieData() {
    if (this.selectedMonth != null) {
      let invoicedItemData = await lastValueFrom(this.dataService.collectDataComplex("invoiced-item-month-totals", { month: this.selectedMonth, year: this.selectedYear }));

      if (invoicedItemData != null) {
        invoicedItemData = !Array.isArray(invoicedItemData) ? [invoicedItemData] : invoicedItemData;

        invoicedItemData.slice(0, 4).forEach((item: any) => {
          this.pieChartData.push(item.total_quantity);
          this.pieChartLabel.push(item.item_name);
        });
        this.createPieChart();
      }
    }
  }

  async getListData() {
    let totalMonthInvoiceProfit = await lastValueFrom<any>(this.dataService.collectDataComplex("total-invoices-month-profit", { month: this.selectedMonth, year: this.selectedYear }));

    if (totalMonthInvoiceProfit != null) {
      this.listData.push(
        totalMonthInvoiceProfit['month_total'].toLocaleString('en-US', {
          style: 'currency',
          currency: 'GBP',
        })
      );
      
      this.listData.push(totalMonthInvoiceProfit['total_invoices']);
      this.listData.push(
        totalMonthInvoiceProfit['invoice_profit'].toLocaleString('en-US', {
          style: 'currency',
          currency: 'GBP',
        })
      );
    }
  }

  handleBarClick(event: MouseEvent, elements: any[]) {
    this.pieChartData = [];
    this.pieChartLabel = [];
    this.listData = [];
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
