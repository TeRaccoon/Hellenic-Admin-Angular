import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Address } from '../../types';

@Component({
  selector: 'app-invoice-address',
  templateUrl: './invoice-address.component.html',
  styleUrl: './invoice-address.component.scss',
})
export class InvoiceAddressComponent {
  @Input() disabled!: boolean;
  @Input() key!: string;

  @Output() addAddressToBookEmitter = new EventEmitter<void>();
  @Output() updateAddressValuesEmitter = new EventEmitter<Address>();

  addressForm: FormGroup = new FormGroup({
    line1: new FormControl<string | null>(null, Validators.required),
    line2: new FormControl<string | null>(null),
    line3: new FormControl<string | null>(null),
    postcode: new FormControl<string>('', Validators.required),
    save: new FormControl<boolean>(false, Validators.required),
  });
  submissionAttempted = false;
  success = false;

  tick = faCheck;

  updateAddressValues() {
    this.submissionAttempted = true;

    if (!this.addressForm.valid) {
      return;
    }

    this.success = true;
    this.updateAddressValuesEmitter.emit(this.addressForm.value);
    if (this.addressForm.get('save')?.value) {
      this.addAddressToBookEmitter.emit();
    }
  }

  inputHasError(controlName: string) {
    return this.addressForm.get(controlName)?.invalid && this.submissionAttempted ? 'error' : '';
  }
}
