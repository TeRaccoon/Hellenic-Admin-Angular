import { Component } from '@angular/core';
import { Document } from '../../common/types/document-upload-widget/types';

import Quill from 'quill';
import BlotFormatter from 'quill-blot-formatter/dist/BlotFormatter';
import { DataService } from '../../services/data.service';
import { FormService } from '../form/service';

Quill.register('modules/blotFormatter', BlotFormatter);

@Component({
  selector: 'app-document-upload-widget',
  templateUrl: './document-upload-widget.component.html',
  styleUrl: './document-upload-widget.component.scss',
})
export class DocumentUploadWidgetComponent {
  modules = {};

  documents: Document[];
  documentText: string = '';
  selectedDocument: Document;

  constructor(
    private dataService: DataService,
    private formService: FormService
  ) {
    this.modules = {
      blotFormatter: {},
    };

    this.documents = [
      { title: 'Privacy Policy', type: 'privacy-policy' },
      { title: 'Terms & Conditions', type: 'terms-and-conditions' },
      { title: 'Shipping Policy', type: 'shipping-policy' },
      { title: 'Refund Policy', type: 'refund-policy' },
      { title: 'Business Terms', type: 'business-terms' },
    ];

    this.selectedDocument = this.documents[0];
  }

  async submit() {
    const formData = new FormData();
    const htmlContent = this.documentText;
    const file = new File([htmlContent], `${this.selectedDocument.type}.html`, {
      type: 'text/html',
    });

    formData.append('document', file, this.selectedDocument.type + '.html');

    let response = await this.dataService.uploadDocument(formData);
    this.formService.setMessageFormData({
      title: response.success ? 'Success!' : 'Error!',
      message: response.message,
    });
  }

  async load() {
    let value = await this.dataService.processDocument(
      `${this.selectedDocument.type}.html`
    );
    this.documentText = value.toString();
  }
}
