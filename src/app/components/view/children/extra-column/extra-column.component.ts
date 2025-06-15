import { Component, Input, OnInit } from '@angular/core';
import { TABLE_ICONS } from '../../../../common/icons/table-icons';
import { TableName, TableTypeMap } from '../../../../common/types/tables';
import { UrlService } from '../../../../services/url.service';
import { ViewService } from '../../service';

@Component({
  selector: 'app-extra-column',
  templateUrl: './extra-column.component.html',
  styleUrl: './extra-column.component.scss',
})
export class ExtraColumnComponent<T extends TableName = TableName> implements OnInit {
  @Input() tableName!: T;
  @Input() data!: TableTypeMap[T][];
  @Input() item!: any;
  @Input() column!: keyof TableTypeMap[T];
  @Input() stockData!: Record<string, string>;
  @Input() images!: Record<string, string>;

  image!: string;

  icon = TABLE_ICONS.lock;
  icons = TABLE_ICONS;

  imageUrlBase!: string;

  get itemId(): string {
    return this.item['id']?.toString?.() ?? '';
  }

  constructor(
    private viewService: ViewService,
    private urlService: UrlService
  ) {
    this.imageUrlBase = this.urlService.getUrl('uploads');
  }

  ngOnInit() {
    this.setImage();
  }

  async stockSearch() {
    this.viewService.stockSearch(this.data, this.itemId);
  }

  async invoiceSearch() {
    this.viewService.invoiceSearch(this.data, this.itemId);
  }

  async creditNoteSearch() {
    this.viewService.creditNoteSearch(this.data, this.itemId, this.tableName);
  }

  async supplierInvoiceSearch() {
    this.viewService.supplierInvoiceSearch(this.data, this.itemId);
  }

  async addressSearch() {
    const accountName = (this.item as TableTypeMap['customers']).account_name!;
    this.viewService.addressSearch(this.item['id'].toString(), accountName);
  }

  async priceListItemSearch() {
    const reference = (this.item as TableTypeMap['price_list']).reference!;
    this.viewService.priceListSearch(this.item['id'].toString(), reference);
  }

  canDisplayColumn(column: string) {
    return this.viewService.canDisplayColumn(column, this.tableName);
  }

  shouldColourCell() {
    return this.viewService.shouldColourCell(this.item[this.column]!.toString(), this.tableName);
  }

  displayWithIcon() {
    switch (this.tableName) {
      case 'invoices':
        if (this.column == 'id') {
          this.icon =
            (this.item as TableTypeMap['invoices']).status == 'Complete' ? TABLE_ICONS.lock : TABLE_ICONS.lockOpen;
          return true;
        }
        break;
    }
    return false;
  }

  setImage() {
    const image = this.images[(this.item as TableTypeMap['stocked_items']).item_id];
    this.image = image === null ? this.imageUrlBase + 'placeholder.jpg' : this.imageUrlBase + image;
  }
}
