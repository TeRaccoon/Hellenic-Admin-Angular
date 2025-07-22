import { Injectable, signal } from '@angular/core';
import {
  ADDRESS_COLUMNS,
  CREDIT_NOTE_COLUMNS,
  PRICE_LIST_ITEM_COLUMNS,
  SUPPLIER_INVOICE_COLUMNS,
} from '../../common/constants';
import { INVOICE_COLUMNS, STOCK_COLUMNS } from '../../common/consts/table-options';
import { TableName, TableNameEnum, TableTypeMap } from '../../common/types/tables';
import { DEFAULT_DISABLED_WIDGET_DATA } from '../../common/types/widget/const';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { TableOptionsService } from '../../services/table-options.service';
import { FormService } from '../form/service';
import { FormType } from '../form/types';

@Injectable({
  providedIn: 'root',
})
export class ViewService {
  private _displayData: any[] = [];
  private _filteredDisplayData: Record<string, any>[] = [];

  get displayData(): any[] {
    return this._displayData;
  }

  set displayData(value: any[]) {
    this._displayData = value;
  }

  get filteredDisplayData(): Record<string, any>[] {
    return this._filteredDisplayData;
  }

  set filteredDisplayData(value: Record<string, any>[]) {
    this._filteredDisplayData = value;
  }

  private toggleLoading = signal(false);

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private formService: FormService,
    private optionsService: TableOptionsService
  ) {}

  getToggleLoadingSignal() {
    return this.toggleLoading;
  }

  getToggleLoading() {
    return this.toggleLoading();
  }

  setToggleLoading(loading: boolean) {
    this.toggleLoading.set(loading);
  }

  async stockSearch(data: any, itemId: string) {
    const row = data.filter((row: any) => row.id == itemId)[0];

    if (row !== null) {
      const tableRows = await this.dataService.processGet('stocked-items', { filter: itemId }, true);
      const tableName = 'stocked_items';
      const title = `Stocked Items for ${row['item_name']}`;

      this.dataService.storeWidgetData({
        headers: STOCK_COLUMNS,
        rows: tableRows,
        tableName: tableName,
        title: title,
        idData: { id: itemId, columnName: 'Item ID' },
        query: 'stocked-items',
        disabled: DEFAULT_DISABLED_WIDGET_DATA,
        extra: undefined,
      });
      this.formService.setFormVisibility(FormType.Widget, true);
    }
  }

  async invoiceSearch(data: any, invoiceId: string) {
    const row = data.filter((row: any) => row.id == invoiceId)[0];

    const tableColumns = INVOICE_COLUMNS;
    const tableRows = await this.dataService.processGet('invoiced-items', { filter: invoiceId }, true);
    const tableName = 'invoiced_items';
    const title = `Invoiced Items for ${row['title']}`;

    const freeDeliveryMinimum = await this.dataService.processGet('settings', {
      filter: 'free_delivery_minimum',
    });

    const isDelivery =
      (
        await this.dataService.processGet('invoice', {
          filter: invoiceId,
        })
      ).delivery_type == 'Delivery';

    let totalGross = 0;
    let totalNet = 0;
    let totalVAT = 0;
    let delivery = 0;

    tableRows.forEach((row: any) => {
      const gross = row.gross || 0;
      const vat = row.vat || 0;
      const net = row.net || 0;

      totalGross += gross;
      totalVAT += vat;
      totalNet += net;
    });

    if (totalNet < freeDeliveryMinimum && isDelivery) {
      totalNet += 7.5;
      delivery = 7.5;
    }

    this.dataService.storeWidgetData({
      headers: tableColumns,
      rows: tableRows,
      tableName: tableName,
      title: title,
      idData: {
        id: invoiceId,
        columnName: 'Invoice ID',
      },
      query: 'invoiced-items',
      disabled: {
        value: row['status'] == 'Complete',
        message: 'This invoice is locked and cannot be modified!',
      },
      extra: {
        totalGross: totalGross,
        totalVAT: totalVAT,
        delivery: delivery,
        totalNet: totalNet,
      },
    });

    this.formService.setFormVisibility(FormType.Widget, true);
  }

  async creditNoteSearch(data: any, creditNoteId: string, tableName: string) {
    const tableColumns = CREDIT_NOTE_COLUMNS;
    const query = tableName == 'suppliers' ? 'credit-note-search-supplier' : 'credit-note-search-invoice';

    const row = data.filter((row: any) => row.id == creditNoteId)[0];
    const reference = tableName == 'suppliers' ? row['account_name'] : row['reference'];
    const idColumnName = tableName == 'suppliers' ? 'Supplier' : 'Invoice';

    const tableRows = await this.dataService.processGet(query, { filter: creditNoteId }, true);
    const realTableName = 'credit_notes';
    const title = `Credit Notes from ${reference}`;

    this.dataService.storeWidgetData({
      headers: tableColumns,
      rows: tableRows,
      tableName: realTableName,
      title: title,
      idData: { id: creditNoteId, columnName: idColumnName },
      query: query,
      disabled: DEFAULT_DISABLED_WIDGET_DATA,
      extra: undefined,
    });
    this.formService.setFormVisibility(FormType.Widget, true);
  }

  async supplierInvoiceSearch(data: any, invoiceId: string) {
    const row = data.filter((row: any) => row.id == invoiceId)[0];
    const tableRows = await this.dataService.processGet('stocked-items-invoice', { filter: invoiceId }, true);
    const tableName = 'stocked_items';
    const title = `Stocked Items from ${row['reference']}`;

    this.dataService.storeWidgetData({
      headers: SUPPLIER_INVOICE_COLUMNS,
      rows: tableRows,
      tableName: tableName,
      title: title,
      idData: { id: invoiceId, columnName: 'Supplier Invoice ID' },
      query: 'stocked-items-invoice',
      disabled: DEFAULT_DISABLED_WIDGET_DATA,
      extra: undefined,
    });
    this.formService.setFormVisibility(FormType.Widget, true);
  }

  async addressSearch(customerId: string, accountName: string) {
    const tableRows = await this.dataService.processGet('customer-addresses-by-id', { filter: customerId }, true);
    const tableName = 'customer_address';
    const title = `Customer Addresses for ${accountName}`;

    this.dataService.storeWidgetData({
      headers: ADDRESS_COLUMNS,
      rows: tableRows,
      tableName: tableName,
      title: title,
      idData: { id: customerId, columnName: 'Customer Name' },
      query: 'customer-addresses-by-id',
      disabled: DEFAULT_DISABLED_WIDGET_DATA,
      extra: undefined,
    });
    this.formService.setFormVisibility(FormType.Widget, true);
  }

  async priceListSearch(id: string, reference: string) {
    const query = 'price-list-items-by-id';
    const tableRows = await this.dataService.processGet(query, { filter: id }, true);

    const tableName = 'price_list_items';
    const title = `Price List Items for ${reference}`;

    this.dataService.storeWidgetData({
      headers: PRICE_LIST_ITEM_COLUMNS,
      rows: tableRows,
      tableName: tableName,
      title: title,
      idData: { id: id, columnName: 'Price List ID' },
      query: query,
      disabled: DEFAULT_DISABLED_WIDGET_DATA,
      extra: undefined,
    });
    this.formService.setFormVisibility(FormType.Widget, true);
  }

  getCustomColumnHeadersFromTable(tableName: string) {
    switch (tableName) {
      case 'items':
        return ['Stock', 'Total Stock'];

      case 'stocked_items':
        return ['Image'];

      case 'suppliers':
        return ['Credit Notes'];

      case 'supplier_invoices':
        return ['Items', 'Credit Notes'];

      case 'invoices':
        return this.canDisplayColumn('invoiced-items', tableName) ? ['Items'] : [];

      case 'customers':
        return ['Addresses'];

      case 'price_list':
        return ['Items'];
    }

    return [];
  }

  canDisplayColumn(column: string, tableName: string) {
    if (this.authService.getAccessLevel() == 'Low') {
      return !(column == 'edit-row' || column == 'delete-row');
    }

    if (this.authService.getAccessLevel() == 'High') {
      return column != 'delete-row';
    }

    switch (tableName) {
      case 'customers':
      case 'users':
        return !(column == 'password' || column == 'Password');

      case 'invoices':
        if (this.authService.getAccessLevel() == 'Driver') {
          switch (column) {
            case 'gross_value':
            case 'discount_value':
            case 'VAT':
            case 'total':
            case 'outstanding_balance':
            case 'payment_status':
            case 'Gross Value':
            case 'Total':
            case 'Outstanding Balance':
            case 'Paid':
            case 'edit-row':
            case 'delete-row':
            case 'invoiced-items':
            case 'ID':
            case 'id':
            case 'Printed':
            case 'printed':
              return false;
          }
        }
        return true;
    }
    return true;
  }

  sortDescending(dataName: string, data: any) {
    return data.sort((a: any, b: any) => {
      if (a[dataName] === b[dataName]) return 0;

      return a[dataName] > b[dataName] ? 1 : -1;
    });
  }

  sortAscending(dataName: string, data: any) {
    return data.sort((a: any, b: any) => {
      if (a[dataName] === b[dataName]) return 0;

      return a[dataName] > b[dataName] ? -1 : 1;
    });
  }

  prepareEditFormService(id: string, table: string, activeTable: string) {
    this.formService.setSelectedTable(table == '' ? String(activeTable) : table);
    this.formService.setSelectedId(id);
    this.formService.setFormVisibility(FormType.Edit, true);
    this.formService.setReloadType('hard');
  }

  mapDataTypes(types: any[]) {
    return types.map((type: any) => {
      if (type === "enum('Yes','No')") {
        return "enum('No','Yes')";
      }
      return type;
    });
  }

  async editRow(row: any, id: string, table: string, activeTable: string, editable: any) {
    if (table == '') {
      if (activeTable == 'invoices' && row['status'] == 'Complete') {
        this.formService.setMessageFormData({
          title: 'Warning!',
          message:
            'This invoice is locked! Changing the data could have undesired effects. To continue, click the padlock on the invoice you want to edit!',
        });

        return;
      }

      this.formService.setEditFormLoading(true, id);
      this.formService.setFormVisibility(FormType.Edit, true);
      this.formService.processEditFormData(row, editable);
      this.prepareEditFormService(id, table, activeTable);

      return;
    }

    const editFormData = await this.dataService.processGet('edit-form-data', {
      filter: table,
    });

    const fakeRow = JSON.parse(JSON.stringify(row));

    switch (table) {
      case 'allergen_information':
      case 'nutrition_info':
        switch (activeTable) {
          case 'items':
            await this.editItemAlternateTable(table, activeTable, id, fakeRow, editFormData);
            break;
        }
        break;

      default:
        this.formService.processEditFormData(fakeRow, editFormData);
        this.prepareEditFormService(id, table, activeTable);
        break;
    }
  }

  private async editItemAlternateTable(
    table: string,
    activeTable: string,
    id: string,
    fakeRow: any,
    editFormData: any
  ) {
    const appendOrAdd = await this.dataService.processGet('append-or-add', {
      table: table,
      id: id,
      column: 'item_id',
    });

    fakeRow['item_id'] = id;
    if (appendOrAdd.id) {
      fakeRow = appendOrAdd;
      this.formService.processEditFormData(fakeRow, editFormData);
      this.prepareEditFormService(appendOrAdd.id, table, activeTable);
    } else {
      const values: (string | null)[] = Array(editFormData.columns.length).fill(null);
      const itemIdIndex = editFormData.names.indexOf('Item ID');
      values[itemIdIndex] = id;
      editFormData.values = values;

      this.formService.processAddFormData(editFormData);
      this.optionsService.prepareAddFormService(table);
    }
  }

  getCurrencyCode<T extends TableName>(column: keyof TableTypeMap[T], tableName: T) {
    return (tableName == TableNameEnum.SupplierInvoices &&
      (column == 'net_value' || column == 'VAT' || column == 'total_eur' || column == 'outstanding_balance')) ||
      column == 'amount_eur'
      ? 'EUR'
      : 'GBP';
  }

  shouldColourCell(data: string, tableName: string) {
    switch (tableName) {
      case 'invoices':
        switch (data) {
          case 'Overdue':
            return 'red';
          case 'Complete':
            return 'green';
          case 'Pending':
            return 'orange';
        }
        break;
    }
    return '';
  }

  calculatePageCount(useDisplayData = false, entryLimit: number) {
    if (useDisplayData) {
      return Math.ceil(this.displayData.length / entryLimit);
    } else {
      return Math.ceil(this.filteredDisplayData.length / entryLimit);
    }
  }

  getPageRange(currentPage: number, pageCount: number): number[] {
    const range = [];
    let start = currentPage;

    if (currentPage > pageCount - 2 && pageCount - 2 > 0) {
      start = pageCount - 2;
    }
    if (start == 1 && pageCount > 1) {
      start += 2;
    } else if (start == 2 && pageCount > 1) {
      start += 1;
    }
    for (let i = start - 1; i < start + 2 && i < pageCount && pageCount > 1; i++) {
      range.push(i);
    }

    if (pageCount > 1) {
      range.push(pageCount);
    }

    return range;
  }
}
