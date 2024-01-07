import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-invoice-breakdown-widget',
  templateUrl: './invoice-breakdown-widget.component.html',
  styleUrls: ['./invoice-breakdown-widget.component.scss']
})
export class InvoiceBreakdownWidgetComponent {
  selectedYear = 2023;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    if (this.selectedYear != null) {
      this.dataService.collectData("invoice-month-totals", this.selectedYear.toString()).subscribe((data: any) => {
        
      });
    }
  }

  changeYear(event: Event) {
    const year = event.target as HTMLInputElement;
    this.selectedYear = Number(year.value);
    this.getData();
  }
}
