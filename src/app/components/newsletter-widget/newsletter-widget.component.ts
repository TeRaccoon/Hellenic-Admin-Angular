import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-newsletter-widget',
  templateUrl: './newsletter-widget.component.html',
  styleUrl: './newsletter-widget.component.scss',
})
export class NewsletterWidgetComponent {
  newsletterForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.newsletterForm = this.fb.group({
      newsletter: ['', [Validators.required]],
    });
  }

  submit() {
    console.log('Submitted');
  }
}
