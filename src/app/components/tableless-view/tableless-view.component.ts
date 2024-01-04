import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';
import { FormService } from '../../services/form.service';

@Component({
  selector: 'app-tableless-view',
  templateUrl: './tableless-view.component.html',
  styleUrls: ['./tableless-view.component.scss']
})
export class TablelessViewComponent {
  tableName = '';
  tableData: any[] = [];
  tableHeaders: any = [];

  constructor(private formService: FormService, private route: ActivatedRoute, private dataService: DataService) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.tableName = params['table'];
    });
    this.dataService.getDataObservable().subscribe((data) => {
      var retrievedData = this.dataService.retrieveData();
      this.tableData = retrievedData.Data;
      this.tableHeaders = retrievedData.Headers;
      console.log(this.tableData);
    });
  }
  
  getObjectKeys(obj: object): string[] {
    return Object.keys(obj);
  }
}
