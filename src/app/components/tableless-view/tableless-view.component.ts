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

  constructor(private formService: FormService, private route: ActivatedRoute, private dataService: DataService) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.tableName = params['table'];
    });
  }


}
