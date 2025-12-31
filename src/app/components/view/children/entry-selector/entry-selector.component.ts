import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ViewMetadata } from '../../../../common/types/view/types';

@Component({
  selector: 'app-entry-selector',
  standalone: true,
  imports: [],
  templateUrl: './entry-selector.component.html',
  styleUrl: './entry-selector.component.scss',
})
export class EntrySelectorComponent {
  @Input() viewMetadata!: ViewMetadata;

  @Output() loadPage = new EventEmitter<ViewMetadata>();

  changeEntries(event: Event) {
    const option = event.target as HTMLInputElement;
    this.viewMetadata.entryLimit = Number(option.value);
    this.viewMetadata.currentPage = 1;
    this.loadPage.emit(this.viewMetadata);
  }
}
