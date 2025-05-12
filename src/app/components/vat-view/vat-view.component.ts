import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-vat-view',
  templateUrl: './vat-view.component.html',
  styleUrl: './vat-view.component.scss',
})
export class VatViewComponent implements OnInit {
  vatData: any = {};

  faPrint = faPrint;

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.vatData = this.dataService.getData();
    if (this.vatData.labels.length == 0) {
      this.router.navigate(['/home']);
    }
  }

  format(value: any) {
    if (value == '' || value == null || value == undefined) {
      return 0;
    }

    return value;
  }

  print() {
    window.print();
  }
}
