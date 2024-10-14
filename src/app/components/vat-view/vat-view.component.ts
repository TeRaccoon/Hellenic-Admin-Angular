import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vat-view',
  templateUrl: './vat-view.component.html',
  styleUrl: './vat-view.component.scss',
})
export class VatViewComponent {
  vatData: any = {};

  faPrint = faPrint;

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit() {
    this.vatData = this.dataService.retrieveData();
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
