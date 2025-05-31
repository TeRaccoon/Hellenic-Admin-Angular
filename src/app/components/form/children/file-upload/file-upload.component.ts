import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FORM_ICONS } from '../../icons';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent {
  @Input() file!: File;
  @Input() class!: string;
  @Input() required = false;

  @Output() primeImageEmitter = new EventEmitter<Event>();

  icons = FORM_ICONS;

  primeImage(event: Event) {
    this.primeImageEmitter.emit(event);
  }
}
