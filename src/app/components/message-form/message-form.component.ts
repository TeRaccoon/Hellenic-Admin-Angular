import { Component, effect } from '@angular/core';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { FormService } from '../form/service';

@Component({
  selector: 'app-message-form',
  templateUrl: './message-form.component.html',
  styleUrls: ['./message-form.component.scss'],
})
export class MessageFormComponent {
  faX = faX;

  formVisible = 'hidden';
  formData: {
    title: string;
    message: string;
    secondaryMessage?: string | null;
  } = { title: '', message: '', secondaryMessage: null };

  constructor(private formService: FormService) {
    effect(() => {
      this.formVisible = this.formService.getMessageFormVisibility()() ? 'visible' : 'hidden';
      this.formData = this.formService.getMessageFormData();
    });
  }

  hide() {
    this.formService.hideMessageForm();
  }
}
