import { Component } from '@angular/core';
import { FormService } from '../../services/form.service';

@Component({
  selector: 'app-message-form',
  templateUrl: './message-form.component.html',
  styleUrls: ['./message-form.component.scss']
})
export class MessageFormComponent {
  formVisible = 'hidden';
  formData: { title: string, message: string } = { title: '', message: '' };

  constructor(private formService: FormService) {}

  ngOnInit() {
    this.formService.getMessageFormVisibility().subscribe((visible) => {
      this.formVisible = visible ? 'visible' : 'hidden';
      this.formData = this.formService.getMessageFormData();
    });
  }

  hide() {
    this.formService.hideMessageForm();
  }  
}
