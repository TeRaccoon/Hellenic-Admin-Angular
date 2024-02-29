import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { faA, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-print-layout',
  templateUrl: './print-layout.component.html',
  styleUrls: ['./print-layout.component.scss']
})
export class PrintLayoutComponent {
  faArrowLeft = faArrowLeft;

  constructor(private _location: Location) {}

  back() {
    this._location.back()
  }
}
