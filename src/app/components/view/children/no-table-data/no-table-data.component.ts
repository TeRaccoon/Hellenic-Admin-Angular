import { Location } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-no-table-data',
  templateUrl: './no-table-data.component.html',
  styleUrl: './no-table-data.component.scss',
})
export class NoTableDataComponent {
  @Input() displayName = '';

  @Output() addRowEmitter = new EventEmitter<any>();

  arrowLeft = faArrowLeft;

  constructor(private _location: Location) {}

  back() {
    this._location.back();
  }

  addRow() {
    this.addRowEmitter.emit(null);
  }
}
