import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { DataService } from '../../services/data.service';
import { MailService } from '../../services/mail.service';
import { Response } from '../../common/types/data-service/types';
import { FormService } from '../../services/form.service';

import Quill from 'quill';
import BlotFormatter from 'quill-blot-formatter/dist/BlotFormatter';

Quill.register('modules/blotFormatter', BlotFormatter);

@Component({
  selector: 'app-newsletter-widget',
  templateUrl: './newsletter-widget.component.html',
  styleUrl: './newsletter-widget.component.scss',
})
export class NewsletterWidgetComponent {
  modules = {};

  newsletterForm: FormGroup;

  buttonText = 'Send';

  isLoading = false;
  loading = faCircleNotch;

  mailingListVisible = false;

  newsletterCustomers = [];

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private mailService: MailService,
    private formService: FormService
  ) {
    this.modules = {
      blotFormatter: {},
    };

    this.newsletterForm = this.fb.group({
      newsletter: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.load();
  }

  async load() {
    this.newsletterCustomers = await this.dataService.processPost({
      action: 'newsletter-customers',
      key: 'key',
    });
  }

  async submit() {
    if (this.buttonText == 'Send') {
      this.buttonText = 'Confirm?';
    } else {
      this.isLoading = true;
      this.buttonText = 'Send';

      let failureString = 'Failed to send emails to: ';
      let failed = false;
      let index = 1;
      let end = this.newsletterCustomers.length;

      for (const customerEmail of this.newsletterCustomers) {
        this.buttonText = `Sending ${index}/${end}`;

        const emailData = {
          action: 'mail',
          mail_type: 'newsletter',
          subject: 'Newsletter',
          email_HTML: this.newsletterForm.get('newsletter')?.value,
          address: customerEmail,
          name: 'Customer',
        };

        let response: Response = await this.mailService.sendEmail(emailData);
        if (response.success) {
          console.log(`Email sent to ${customerEmail}`);
        } else {
          failureString += customerEmail + ', ';
          failed = true;
        }

        index++;
      }

      failureString = failureString.slice(0, -2);

      if (failed) {
        this.formService.setMessageFormData({
          title: 'Error',
          message: failureString,
        });
        this.formService.showMessageForm();
      }

      this.isLoading = false;
    }
  }

  toggleMailingListVisibility() {
    this.mailingListVisible = !this.mailingListVisible;
  }
}
