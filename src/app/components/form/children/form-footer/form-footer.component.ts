import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-form-footer',
  templateUrl: './form-footer.component.html',
  styleUrl: './form-footer.component.scss'
})
export class FormFooterComponent {
  @Input() success: boolean = false;
  @Input() addMore: boolean = false;
  @Input() withWidget: boolean = false;

  @Output() formSubmit = new EventEmitter<boolean>();

  tick = faCheck;

  submit(hideForm: boolean) {
    this.formSubmit.emit(hideForm);
  }
}
