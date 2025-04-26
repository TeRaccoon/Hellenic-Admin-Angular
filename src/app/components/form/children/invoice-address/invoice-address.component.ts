import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AddressUpdate } from './types';

@Component({
  selector: 'app-invoice-address',
  templateUrl: './invoice-address.component.html',
  styleUrl: './invoice-address.component.scss',
})
export class InvoiceAddressComponent {
  @Input() disabled!: boolean;
  @Input() key!: string;

  @Output() addAddressToBookEmitter = new EventEmitter<string>();
  @Output() updateAddressValuesEmitter = new EventEmitter<AddressUpdate>();

  updateAddressValues(key: string, field: string, event: Event) {
    let value = (event.target as HTMLInputElement).value;
    this.updateAddressValuesEmitter.emit({
      key: key,
      field: field,
      value: value,
    });
  }

  addAddressToBook(key: string) {
    this.addAddressToBookEmitter.emit(key);
  }
}
