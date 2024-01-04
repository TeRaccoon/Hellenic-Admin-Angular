import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-debtor-creditor-widget',
  templateUrl: './debtor-creditor-widget.component.html',
  styleUrls: ['./debtor-creditor-widget.component.scss']
})
export class DebtorCreditorWidgetComponent {
  tableData: any[] = [];

  constructor(private dataService: DataService) {}

  submitQuery(type: string, startDay: number, endDay: number | null) {
    this.dataService.collectDataComplex(type, {'start-day': startDay, 'end-day': endDay}).subscribe((data: any) => {
      //Store using form or other service
      var retrievedData = data;
      if (!Array.isArray(retrievedData)) {
        retrievedData = [retrievedData];
      }
      this.dataService.storeData({'Data': retrievedData, 
      'Headers': ['ID', 'Forname', 'Surname', type == 'debtor' ? 'Total Debt' : 'Total Credit', 'Last Transaction']});
    });
  }
}
