import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';
import { faSpinner, faPencil } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent {
  faSpinner = faSpinner;
  faPencil = faPencil;
  
  selectedOption: string | null = null;
  data: { [key: string]: any }[] = [];
  displayNames: { [key: string]: any }[] = [];
  displayData: any[] = [];

  constructor(private route: ActivatedRoute, private dataService: DataService) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.selectedOption = params['table'] || null;
      this.loadTable(String(this.selectedOption));
    });
  }

  async loadTable(table: string) {
    this.dataService.collectData("table", table).subscribe((data: any) => {
      if (Array.isArray(data.data)) {
        this.data = data.data;
      } else {
        this.data = [data.data];
      }
      this.displayData = data.display_data;
      this.displayNames = data.display_names;
    });
  }

  getColumnHeaders(obj: { [key: string]: any }): string[] {
    return obj ? Object.keys(obj) : [];
  }
}
