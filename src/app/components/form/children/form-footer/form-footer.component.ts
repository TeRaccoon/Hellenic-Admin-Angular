import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-form-footer',
  templateUrl: './form-footer.component.html',
  styleUrl: './form-footer.component.scss',
})
export class FormFooterComponent {
  @Input() success = false;
  @Input() addMore = false;
  @Input() withWidget = false;

  @Output() formSubmit = new EventEmitter<boolean>();

  tick = faCheck;

  submit(hideForm: boolean) {
    this.formSubmit.emit(hideForm);
  }
}
