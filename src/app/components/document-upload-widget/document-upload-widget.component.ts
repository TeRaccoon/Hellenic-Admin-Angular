import { Component } from '@angular/core';
import { Document } from './types';

import Quill from 'quill';
import BlotFormatter from 'quill-blot-formatter/dist/BlotFormatter';
import { DataService } from '../../services/data.service';
import { FormService } from '../form/service';
import { DOCUMENTS } from './consts';

Quill.register('modules/blotFormatter', BlotFormatter);

@Component({
  selector: 'app-document-upload-widget',
  templateUrl: './document-upload-widget.component.html',
  styleUrl: './document-upload-widget.component.scss',
})
export class DocumentUploadWidgetComponent {
  modules = {
    blotFormatter: {},
  };

  documents: Document[] = DOCUMENTS;
  documentText = '';
  selectedDocument: Document = DOCUMENTS[0];

  constructor(
    private dataService: DataService,
    private formService: FormService
  ) {
    this.selectedDocument = this.documents[0];
  }

  async submit() {
    const formData = new FormData();
    const htmlContent = this.documentText;
    const file = new File([htmlContent], `${this.selectedDocument.type}.html`, {
      type: 'text/html',
    });

    formData.append('document', file, this.selectedDocument.type + '.html');

    const response = await this.dataService.uploadDocument(formData);
    this.formService.setMessageFormData({
      title: response.success ? 'Success!' : 'Error!',
      message: response.message,
    });
  }

  async load() {
    const value = await this.dataService.processDocument(`${this.selectedDocument.type}.html`);
    this.documentText = value.toString();
  }
}
