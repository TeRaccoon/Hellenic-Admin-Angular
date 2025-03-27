import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormService } from '../../services/form.service';
import { Subscription } from 'rxjs';
import { UrlService } from '../../services/url.service';
import { widgetIcons } from '../../common/icons/widget-icons';
import { DEFAULT_WIDGET_DATA } from '../../common/types/widget/const';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
})
export class WidgetComponent {
  private readonly subscriptions = new Subscription();

  icons = widgetIcons;
  imageUrlBase;

  visible = false;

  tableData = DEFAULT_WIDGET_DATA;
  formName = '';

  totalStock: number = 0;
  freeDeliveryMinimum: null | number = null;

  constructor(
    private dataService: DataService,
    private formService: FormService,
    private urlService: UrlService
  ) {
    this.imageUrlBase = this.urlService.getUrl('uploads');
  }

  ngOnInit() {
    this.subscriptionHandler();
  }

  subscriptionHandler() {
    this.subscriptions.add(
      this.formService.getWidgetVisibility().subscribe((visible: boolean) => {
        this.visible = visible;
      })
    );

    this.subscriptions.add(
      this.dataService.retrieveWidgetData().subscribe((tableData: any) => {
        this.tableData = tableData;

        if (this.tableData.tableName == 'stocked_items') {
          this.getStockedItemTotal();
        }

        if (this.tableData.tableName == 'invoiced_items' && this.freeDeliveryMinimum == null) {
          this.fetchFreeDeliveryMinimum();
        }
      })
    );

    this.subscriptions.add(
      this.formService.getReloadRequest().subscribe(async (reloadRequested: boolean) => {
        if (reloadRequested && this.visible) {
          await this.reload();
        }
      })
    );
  }

  private async fetchFreeDeliveryMinimum() {
    this.freeDeliveryMinimum = await this.dataService.processGet('settings', {
      filter: 'free_delivery_minimum',
    });
  }


  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  async reload() {
    this.tableData.rows = await this.dataService.processGet(
      this.tableData.query,
      { filter: this.tableData.idData.id },
      true
    );

    let isDelivery =
      (
        await this.dataService.processGet('invoice', {
          filter: this.tableData.idData.id,
        })
      ).delivery_type == 'Delivery';

    if (this.tableData.tableName == 'stocked_items') {
      this.getStockedItemTotal();
    }

    if (this.tableData.query == 'invoiced-items') {
      let totalGross = 0;
      let totalNet = 0;
      let totalVAT = 0;
      let delivery = 0;

      this.tableData.rows.forEach((row: any) => {
        const gross = row.gross || 0;
        const vat = row.vat || 0;
        const net = row.net || 0;

        totalGross += gross;
        totalVAT += vat;
        totalNet += net;
      });

      if (this.freeDeliveryMinimum && totalNet < this.freeDeliveryMinimum && isDelivery) {
        totalNet += 7.5;
        delivery = 7.5;
      }

      this.tableData.extra = {
        totalGross: totalGross,
        totalVAT: totalVAT,
        delivery: delivery,
        totalNet: totalNet,
      };
    }

    this.formService.performReload();
  }

  hide() {
    this.formService.hideWidget();
  }

  deleteRow(id: number) {
    this.formService.setSelectedTable(this.tableData?.tableName);
    this.formService.setDeleteFormIds([id]);
    this.formService.showDeleteForm();
    this.formService.setReloadType('widget');
  }

  async editRow(id: number) {
    let editFormData = await this.dataService.processGet('edit-form-data', {
      filter: this.tableData.tableName,
    });

    let appendOrAdd = await this.dataService.processGet('append-or-add', {
      table: this.tableData.tableName,
      id: id,
      column: 'id',
    });

    if (editFormData != null && appendOrAdd != null) {
      this.formService.processEditFormData(appendOrAdd, editFormData);
      this.prepareEditFormService(id, this.tableData.tableName);
    }
  }

  async addRow() {
    let addFormData = await this.dataService.processGet('table', {
      filter: this.tableData.tableName,
    });

    if (addFormData != null) {
      let formData = addFormData.editable;

      let values: (string | null)[] = Array(
        addFormData.editable.columns.length
      ).fill(null);
      const idIndex = addFormData.editable.names.indexOf(
        this.tableData.idData.columnName
      );
      values[idIndex] = this.tableData.idData.id;
      formData.values = values;

      this.formService.processAddFormData(
        formData,
        null,
        this.formService.constructFormSettings(this.tableData.tableName)
      );
      this.formService.setSelectedTable(this.tableData.tableName);
      this.formService.showAddForm();
      this.formService.setReloadType('widget');
      this.formService.requestReload();
    }
  }

  prepareEditFormService(id: any, table: string) {
    this.formService.setSelectedTable(table);
    this.formService.setSelectedId(id);
    this.formService.showEditForm();
    this.formService.setReloadType('widget');
  }

  getColumnKeys(row: any): string[] {
    return Object.keys(row);
  }

  async getStockedItemTotal() {
    this.totalStock =
      (
        await this.dataService.processGet('total-stock-from-item-id', {
          filter: this.tableData.idData.id,
        })
      ).total_quantity ?? 0;
  }
}
