import { Component } from '@angular/core';
import { FormService } from '../../services/form.service';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-message-form',
  templateUrl: './message-form.component.html',
  styleUrls: ['./message-form.component.scss'],
})
export class MessageFormComponent {
  private readonly subscriptions = new Subscription();

  faX = faX;

  formVisible = 'hidden';
  formData: {
    title: string;
    message: string;
    secondaryMessage?: string | null;
  } = { title: '', message: '', secondaryMessage: null };

  constructor(private formService: FormService) {}

  ngOnInit() {
    this.subscriptions.add(
      this.formService.getMessageFormVisibility().subscribe((visible) => {
        this.formVisible = visible ? 'visible' : 'hidden';
        this.formData = this.formService.getMessageFormData();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  hide() {
    this.formService.hideMessageForm();
  }
}
