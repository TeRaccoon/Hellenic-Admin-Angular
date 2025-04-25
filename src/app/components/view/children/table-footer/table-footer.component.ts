import { Component, EventEmitter, Input, Output } from '@angular/core';
import { viewMetadata } from '../../../../common/types/view/types';

@Component({
  selector: 'app-table-footer',
  templateUrl: './table-footer.component.html',
  styleUrl: './table-footer.component.scss',
})
export class TableFooterComponent {
  @Input() viewMetadata!: viewMetadata;
  @Input() pageRange!: number[];

  @Output() loadPage = new EventEmitter<viewMetadata>();

  changePage(pageNumber: number) {
    this.viewMetadata.currentPage = pageNumber;
    this.loadPage.emit(this.viewMetadata);
  }

  previousPage() {
    this.viewMetadata.currentPage--;
    this.loadPage.emit(this.viewMetadata);
  }

  nextPage() {
    this.viewMetadata.currentPage++;
    this.loadPage.emit(this.viewMetadata);
  }
}
