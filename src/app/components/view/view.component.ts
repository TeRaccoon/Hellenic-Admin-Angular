import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { FormService } from '../../services/form.service';
import { FilterService } from '../../services/filter.service';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import {
  columnFilter,
  columnDateFilter,
  sortedColumn,
  viewMetadata,
  FilterData,
} from '../../common/types/view/types';
import { editableData } from '../../common/types/forms/types';
import { tableIcons } from '../../common/icons/table-icons';
import { TableService } from '../../services/table.service';
import {
  BalanceSheetData,
  BalanceSheetTable,
} from '../../common/types/data-service/types';
import { UrlService } from '../../services/url.service';
import {
  ADDRESS_COLUMNS,
  CREDIT_NOTE_COLUMNS,
  SUPPLIER_INVOICE_COLUMNS,
} from '../../common/constants';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent {
  private readonly subscriptions = new Subscription();

  accessible = false;

  icons = tableIcons;

  apiUrlBase;
  imageUrlBase;

  tableName: string = '';
  displayName: string = '';
  displayColumnFilters: string[] = [];

  columnFilters: columnFilter[] = [];
  columnDateFilters: columnDateFilter[] = [];

  data: { [key: string]: any }[] = [];
  displayNames: { [key: string]: any }[] = [];
  displayData: any[] = [];
  dataTypes: any[] = [];
  filteredDisplayData: any[] = [];
  editable: editableData;
  stockData: any = {};

  selectedRows: number[] = [];

  images: { [key: string]: any }[] = [];

  distanceLoading = false;

  icon = tableIcons.faLock;

  filter: string = '';

  viewMetaData: viewMetadata;

  tabs: { displayName: string; tableName: string }[] = [];

  sortedColumn: sortedColumn = { columnName: '', ascending: false };

  constructor(
    private tableService: TableService,
    private authService: AuthService,
    private router: Router,
    private filterService: FilterService,
    private formService: FormService,
    private route: ActivatedRoute,
    private dataService: DataService,
    private _location: Location,
    private urlService: UrlService
  ) {
    this.apiUrlBase = this.urlService.getUrl();
    this.imageUrlBase = this.urlService.getUrl('uploads');

    this.accessible = this.authService.returnAccess();

    this.viewMetaData = {
      loaded: false,
      entryLimit: 10,
      pageCount: 0,
      currentPage: 1,
    };

    this.editable = {
      columns: [],
      types: [],
      names: [],
      required: [],
      fields: [],
      values: [],
    };
  }

  ngOnInit() {
    this.subscriptionHandler();
  }

  async subscriptionHandler() {
    this.subscriptions.add(
      this.route.queryParams.subscribe((params) => {
        this.tableName = params['table'] || null;
        if (this.tableName != null) {
          this.resetTable();
          this.displayName =
            this.tableService.getTableDisplayName(this.tableName) ?? '';
          this.formService.setSelectedTable(String(this.tableName));
          this.loadTable(String(this.tableName));
          this.loadPage();
          this.tabs = this.dataService.getTabs();
        }
      })
    );

    this.subscriptions.add(
      this.formService
        .getReloadRequest()
        .subscribe(async (reloadRequested: boolean) => {
          if (reloadRequested) {
            let reloadType = this.formService.getReloadType();
            if (reloadType == 'hard') {
              this.selectedRows = [];
              this.sortedColumn = { columnName: '', ascending: false };
              await this.loadTable(String(this.tableName));
            } else if (reloadType == 'filter') {
              this.applyFilter();
            }
            this.formService.performReload();
          }
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  changeTab(tableName: string) {
    if (tableName != 'debtor_creditor' && tableName != 'statistics') {
      this.router.navigate(['/view'], { queryParams: { table: tableName } });
    } else if (tableName == 'statistics') {
      this.router.navigate(['/statistics']);
    } else {
      this.router.navigate(['/page'], { queryParams: { table: tableName } });
    }
  }

  async loadTable(table: string) {
    this.viewMetaData.loaded = false;

    if (this.tableName == 'items') {
      let totalStockData = await this.dataService.processGet(
        'total-stock',
        undefined,
        true
      );

      totalStockData.forEach((stock: any) => {
        this.stockData[stock.item_id] = stock.total_quantity;
      });
    }

    if (this.tableName == 'stocked_items') {
      let images = await this.dataService.processGet(
        'stocked-item-images',
        undefined,
        true
      );

      if (images != null) {
        images.forEach((imageData: any) => {
          this.images[imageData.item_id] = imageData.file_name;
        });
      }
    }

    let tableData = await this.dataService.processGet('table', {
      filter: table,
    });

    if (tableData != null) {
      this.data = Array.isArray(tableData.data)
        ? tableData.data
        : [tableData.data];
      this.displayData = Array.isArray(tableData.display_data)
        ? tableData.display_data
        : [tableData.display_data];
      this.mapDataTypes(tableData.types);
      this.filteredDisplayData = this.displayData;
      this.displayNames = tableData.display_names;
      this.editable = tableData.editable;

      this.applyFilter();

      this.viewMetaData.pageCount = this.calculatePageCount();

      this.changePage(this.viewMetaData.currentPage);

      this.viewMetaData.loaded = true;
    }
  }

  mapDataTypes(types: any[]) {
    this.dataTypes = types.map((type: any) => {
      if (type === "enum('Yes','No')") {
        return "enum('No','Yes')";
      }
      return type;
    });
  }

  getColumnHeaders(obj: { [key: string]: any }): string[] {
    return obj ? Object.keys(obj) : [];
  }

  getCustomColumnHeadersFromTable() {
    switch (this.tableName) {
      case 'items':
        return ['Stock', 'Total Stock'];

      case 'stocked_items':
        return ['Image'];

      case 'suppliers':
        return ['Credit Notes'];

      case 'supplier_invoices':
        return ['Items', 'Credit Notes'];

      case 'invoices':
        return this.canDisplayColumn('invoiced-items') ? ['Items'] : [];

      case 'customers':
        return ['Addresses'];
    }

    return [];
  }

  sortColumn(column: any) {
    this.filteredDisplayData = this.displayData;
    let dataName: string =
      this.editable.columns.filter(
        (_, index) => this.editable.names[index] === column
      )[0] ?? 'id';

    if (this.sortedColumn.columnName == column) {
      this.sortedColumn.ascending = !this.sortedColumn.ascending;
    } else {
      this.sortedColumn = { columnName: column, ascending: false };
    }

    if (this.sortedColumn.ascending) {
      this.sortAscending(dataName);
    } else {
      this.sortDescending(dataName);
    }

    this.changePage(1);
  }

  sortDescending(dataName: string) {
    this.filteredDisplayData.sort((a: any, b: any) => {
      if (a[dataName] === b[dataName]) return 0;

      return a[dataName] > b[dataName] ? 1 : -1;
    });
  }

  sortAscending(dataName: string) {
    this.filteredDisplayData.sort((a: any, b: any) => {
      if (a[dataName] === b[dataName]) return 0;

      return a[dataName] > b[dataName] ? -1 : 1;
    });
  }

  changePage(page: number) {
    this.viewMetaData.currentPage = page;
    this.loadPage();
  }

  viewBalanceSheet() {
    let id = this.selectedRows[0];
    let row = this.data.filter((row: any) => row.id == id)[0];

    let account_number =
      this.tableName == 'customers'
        ? row['account_number']
        : row['account_code'];

    let balanceSheetTitle = `Balance Sheet for ${row['account_name']} - ${account_number}`;

    let balanceSheetData: BalanceSheetData = {
      Title: balanceSheetTitle,
      CustomerId: id,
      Table: this.tableName as BalanceSheetTable,
    };

    this.dataService.storeBalanceSheetData(balanceSheetData);

    this.router.navigate(['/print/balance-sheet']);
  }

  duplicate() {
    let id = this.selectedRows[0];
    let row = this.data.filter((row: any) => row.id == id)[0];

    this.formService.processAddFormData(this.editable, row);
    this.prepareAddFormService(this.tableName);
  }

  async editRow(id: any, table: string) {
    var row = this.data.filter((row: any) => row.id == id)[0];

    if (table == '') {
      if (this.tableName == 'invoices') {
        if (row['status'] == 'Complete') {
          this.formService.setMessageFormData({
            title: 'Warning!',
            message:
              'This invoice is locked! Changing the data could have undesired effects. To continue, click the padlock on the invoice you want to edit!',
          });
          this.formService.showMessageForm();
        } else {
          this.formService.processEditFormData(row, this.editable);
          this.prepareEditFormService(id, table);
        }
      } else {
        this.formService.processEditFormData(row, this.editable);
        this.prepareEditFormService(id, table);
      }

      return;
    }

    let editFormData = await this.dataService.processGet('edit-form-data', {
      filter: table,
    });

    var fakeRow = JSON.parse(JSON.stringify(row));

    let appendOrAdd;

    switch (table) {
      case 'allergen_information':
      case 'nutrition_info':
        switch (this.tableName) {
          case 'items':
            appendOrAdd = await this.dataService.processGet('append-or-add', {
              table: table,
              id: id,
              column: 'item_id',
            });

            fakeRow['item_id'] = id;
            if (appendOrAdd.id) {
              fakeRow = appendOrAdd;
              this.formService.processEditFormData(fakeRow, editFormData);
              this.prepareEditFormService(appendOrAdd.id, table);
            } else {
              let values: (string | null)[] = Array(
                editFormData.columns.length
              ).fill(null);
              const itemIdIndex = editFormData.names.indexOf('Item ID');
              values[itemIdIndex] = id;
              editFormData.values = values;

              this.formService.processAddFormData(editFormData);
              this.prepareAddFormService(table);
            }
            break;
        }
        break;

      default:
        this.formService.processEditFormData(fakeRow, editFormData);
        this.prepareEditFormService(id, table);
        break;
    }
  }

  prepareEditFormService(id: any, table: string) {
    this.formService.setSelectedTable(
      table == '' ? String(this.tableName) : table
    );
    this.formService.setSelectedId(id);
    this.formService.showEditForm();
    this.formService.setReloadType('hard');
  }

  prepareAddFormService(table: string) {
    this.formService.setSelectedTable(
      table == '' ? String(this.tableName) : table
    );
    this.formService.showAddForm();
    this.formService.setReloadType('hard');
  }

  async addRow(values: any) {
    var addFormData = {
      columns: this.editable.columns,
      types: this.editable.types,
      names: this.editable.names,
      required: this.editable.required,
      fields: this.editable.fields,
      values: values,
    };
    this.formService.processAddFormData(
      addFormData,
      null,
      this.formService.constructFormSettings(this.tableName)
    );
    this.formService.setSelectedTable(String(this.tableName));
    this.formService.showAddForm();
    this.formService.setReloadType('hard');
  }

  deleteRow(id: number) {
    if (this.canDelete(id)) {
      this.formService.setSelectedTable(String(this.tableName));
      this.formService.setDeleteFormIds([id]);
      this.formService.showDeleteForm();
      this.formService.setReloadType('hard');
    }
  }

  deleteRows() {
    if (this.selectedRows.every((id) => this.canDelete(id))) {
      this.formService.setSelectedTable(String(this.tableName));
      this.formService.setDeleteFormIds(this.selectedRows);
      this.formService.showDeleteForm();
      this.formService.setReloadType('hard');
    }
  }

  canDelete(id: number) {
    var row = this.data.filter((row: any) => row.id == id)[0];
    switch (this.tableName) {
      case 'customer_payments':
        if (row['linked_payment_id'] != null) {
          this.formService.setMessageFormData({
            title: 'Error',
            message:
              'You cannot delete this payment because it is linked. Please delete or alter the linked payment instead!',
          });
          this.formService.showMessageForm();
          return false;
        }
        break;
    }
    return true;
  }

  changeEntries(event: Event) {
    const option = event.target as HTMLInputElement;
    this.viewMetaData.entryLimit = Number(option.value);
    this.viewMetaData.currentPage = 1;
    this.loadPage();
  }

  itemContainsFilter(item: any) {
    return (
      this.filter != null &&
      item != null &&
      Object.values(item).some((value) => String(value).includes(this.filter))
    );
  }

  pageEvent(viewMetaData: viewMetadata) {
    this.viewMetaData = viewMetaData;
    this.loadPage();
  }

  loadPage() {
    var start =
      (this.viewMetaData.currentPage - 1) * this.viewMetaData.entryLimit;
    var end = start + this.viewMetaData.entryLimit;
    if (this.filterService.getFilterData().searchFilter === '') {
      this.viewMetaData.pageCount = this.calculatePageCount(true);
      this.filteredDisplayData = this.displayData.slice(start, end);
    } else {
      this.filteredDisplayData = this.applyTemporaryFilter();
      this.viewMetaData.pageCount = this.calculatePageCount();
      this.filteredDisplayData = this.filteredDisplayData.slice(start, end);
    }
  }

  resetTable() {
    this.clearFilter('all', true);
    this.filterService.clearFilter();
    this.viewMetaData.pageCount = 0;
    this.viewMetaData.currentPage = 1;
    this.selectedRows = [];
    this.sortedColumn.columnName = '';
  }

  getPageRange(): number[] {
    const range = [];
    var start = this.viewMetaData.currentPage;

    if (
      this.viewMetaData.currentPage > this.viewMetaData.pageCount - 2 &&
      this.viewMetaData.pageCount - 2 > 0
    ) {
      start = this.viewMetaData.pageCount - 2;
    }
    if (start == 1 && this.viewMetaData.pageCount > 1) {
      start += 2;
    } else if (start == 2 && this.viewMetaData.pageCount > 1) {
      start += 1;
    }
    for (
      let i = start - 1;
      i < start + 2 &&
      i < this.viewMetaData.pageCount &&
      this.viewMetaData.pageCount > 1;
      i++
    ) {
      range.push(i);
    }

    if (this.viewMetaData.pageCount > 1) {
      range.push(this.viewMetaData.pageCount);
    }

    return range;
  }

  canShowMultipleDelete() {
    const excludedTables = ['invoiced_items']; //Creates a variable called excludedTables that stores a list containing 'invoiced_items'
    return (
      !excludedTables.includes(this.tableName) && this.selectedRows.length > 1
    );
  }

  async changeCheckBox(event: Event, key: number, columnName: string) {
    const option = event.target as HTMLInputElement;
    let checked = option.checked;
    let data = { ...this.data[key] };
    data[columnName] = checked ? 'Yes' : 'No';
    data['action'] = 'append';
    data['table_name'] = String(this.tableName);
    await this.dataService.submitFormData(data);
    this.reloadTable();
  }

  selectRow(event: Event, rowId: number) {
    const option = event.target as HTMLInputElement;
    let checked = option.checked;
    if (checked) {
      this.selectedRows.push(rowId);
    } else {
      this.selectedRows = this.selectedRows.filter(function (item) {
        return item !== rowId;
      });
    }
  }

  print() {
    if (this.selectedRows.length < 1) {
      this.showErrorMessage('Please select an invoice before trying to print!');
      return;
    }

    const hasMissingWarehouseOrCustomer = this.selectedRows.some(
      (selectedRow) => {
        var currentRow = this.data.filter(
          (row: any) => row.id == selectedRow
        )[0];
        if (currentRow['warehouse_id'] == null) {
          this.showErrorMessage(
            `Invoice ${selectedRow} is missing a warehouse! Please assign a warehouse before attempting to print.`
          );
          return true;
        }
        if (currentRow['customer_id'] == null) {
          this.showErrorMessage(
            `Invoice ${selectedRow} is missing a customer! Please assign a customer before attempting to print.`
          );
          return true;
        }
        return false;
      }
    );

    if (hasMissingWarehouseOrCustomer) {
      return;
    }

    this.dataService.storePrintInvoiceIds(this.selectedRows);
    this.router.navigate(['/print/invoice']);
  }

  async stockSearch(itemId: string) {
    var row = this.data.filter((row: any) => row.id == itemId)[0];

    if (row != null) {
      let tableColumns = [
        { name: 'ID', type: 'number' },
        { name: 'Item Name', type: 'string' },
        { name: 'Quantity', type: 'number' },
        { name: 'Expiry Date', type: 'date' },
        { name: 'Packing Format', type: 'string' },
        { name: 'Barcode', type: 'string' },
        { name: 'Warehouse', type: 'string' },
      ];

      let tableRows = await this.dataService.processGet(
        'stocked-items',
        { filter: itemId },
        true
      );
      let tableName = 'stocked_items';
      let title = `Stocked Items for ${row['item_name']}`;

      this.dataService.storeWidgetData({
        headers: tableColumns,
        rows: tableRows,
        tableName: tableName,
        title: title,
        idData: { id: itemId, columnName: 'Item ID' },
        query: 'stocked-items',
      });
      this.formService.showWidget();
    }
  }

  async invoiceSearch(invoiceId: string) {
    var row = this.data.filter((row: any) => row.id == invoiceId)[0];

    let tableColumns = [
      { name: 'ID', type: 'number' },
      { name: 'Item Name', type: 'string' },
      { name: 'Unit', type: 'string' },
      { name: 'Picture', type: 'image' },
      { name: 'Quantity', type: 'number' },
      { name: 'Item Discount', type: 'percent' },
      { name: 'Customer Discount', type: 'percent' },
      { name: 'Price', type: 'currency' },
      { name: 'Gross Value', type: 'currency' },
      { name: 'Discount Value', type: 'currency' },
      { name: 'VAT Value', type: 'currency' },
    ];
    let tableRows = await this.dataService.processGet(
      'invoiced-items',
      { filter: invoiceId },
      true
    );
    let tableName = 'invoiced_items';
    let title = `Invoiced Items for ${row['title']}`;

    let freeDeliveryMinimum = await this.dataService.processGet('settings', {
      filter: 'free_delivery_minimum',
    });

    let isDelivery =
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

    this.formService.showWidget();
  }

  async createCreditNote() {
    let editFormData = await this.dataService.processGet('edit-form-data', {
      filter: 'credit_notes',
    });
    this.formService.processAddFormData(editFormData);
    this.prepareAddFormService('credit_notes');
  }

  async creditNoteSearch(id: number) {
    let tableColumns = CREDIT_NOTE_COLUMNS;
    let query =
      this.tableName == 'suppliers'
        ? 'credit-note-search-supplier'
        : 'credit-note-search-invoice';

    let row = this.data.filter((row: any) => row.id == id)[0];
    let reference =
      this.tableName == 'suppliers' ? row['account_name'] : row['reference'];
    let idColumnName = this.tableName == 'suppliers' ? 'Supplier' : 'Invoice';

    let tableRows = await this.dataService.processGet(
      query,
      { filter: id },
      true
    );
    let tableName = 'credit_notes';
    let title = `Credit Notes from ${reference}`;

    this.dataService.storeWidgetData({
      headers: tableColumns,
      rows: tableRows,
      tableName: tableName,
      title: title,
      idData: { id: id, columnName: idColumnName },
      query: query,
    });
    this.formService.showWidget();
  }

  async supplierInvoiceSearch(invoiceId: string) {
    var row = this.data.filter((row: any) => row.id == invoiceId)[0];
    let tableColumns = SUPPLIER_INVOICE_COLUMNS;
    let tableRows = await this.dataService.processGet(
      'stocked-items-invoice',
      { filter: invoiceId },
      true
    );
    let tableName = 'stocked_items';
    let title = `Stocked Items from ${row['reference']}`;

    this.dataService.storeWidgetData({
      headers: tableColumns,
      rows: tableRows,
      tableName: tableName,
      title: title,
      idData: { id: invoiceId, columnName: 'Supplier Invoice ID' },
      query: 'stocked-items-invoice',
    });
    this.formService.showWidget();
  }

  async addressSearch(customerId: string, accountName: string) {
    let tableColumns = ADDRESS_COLUMNS;
    let tableRows = await this.dataService.processGet(
      'customer-addresses-by-id',
      { filter: customerId },
      true
    );
    let tableName = 'customer_address';
    let title = `Customer Addresses for ${accountName}`;

    this.dataService.storeWidgetData({
      headers: tableColumns,
      rows: tableRows,
      tableName: tableName,
      title: title,
      idData: { id: customerId, columnName: 'Customer Name' },
      query: 'customer-addresses-by-id',
    });
    this.formService.showWidget();
  }

  shouldColourCell(data: any) {
    switch (this.tableName) {
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

  back() {
    this._location.back();
  }

  canDisplayColumn(column: string) {
    if (this.authService.getAccessLevel() == 'Low') {
      return !(column == 'edit-row' || column == 'delete-row');
    }

    if (this.authService.getAccessLevel() == 'High') {
      return column != 'delete-row';
    }

    switch (this.tableName) {
      case 'customers':
      case 'users':
        return !(column == 'password' || column == 'Password');

      case 'invoices':
        if (this.authService.getAccessLevel() == 'Driver') {
          switch (column) {
            case 'gross_value':
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

  displayWithIcon(column: string, row: any) {
    switch (this.tableName) {
      case 'invoices':
        if (column == 'id') {
          this.icon =
            row['status'] == 'Complete'
              ? tableIcons.faLock
              : tableIcons.faLockOpen;
          return true;
        }
        break;
    }
    return false;
  }

  async iconClick(event: Event, key: number, column: string, row: any) {
    switch (this.tableName) {
      case 'invoices':
        if (column == 'id') {
          let data = { ...this.data[key] };
          data['status'] =
            data['status'] == 'Complete' ? 'Pending' : 'Complete';
          row['status'] = data['status'];
          data['action'] = 'append';
          data['table_name'] = String(this.tableName);

          let submissionResponse = await this.dataService.submitFormData(data);

          if (submissionResponse.success) {
            this.reloadTable();
          } else {
            this.formService.setMessageFormData({
              title: 'Error!',
              message: 'There was an error trying to unlock the booking!',
            });
            this.formService.showMessageForm();
          }
        }
        break;
    }
  }

  calculatePageCount(useDisplayData = false) {
    if (useDisplayData) {
      return Math.ceil(this.displayData.length / this.viewMetaData.entryLimit);
    } else {
      return Math.ceil(
        this.filteredDisplayData.length / this.viewMetaData.entryLimit
      );
    }
  }

  //Filter

  getFilterData(): FilterData {
    return this.filterService.getFilterData();
  }

  applyFilter() {
    this.columnFilters = this.filterService.getColumnFilter();
    this.displayColumnFilters = [];
    this.columnFilters.forEach((filter: any) => {
      this.filterColumns(filter);
    });

    this.columnDateFilters = this.filterService.getColumnDateFilter();
    this.columnDateFilters.forEach((filter: any) => {
      this.filterDateColumns(filter);
    });
  }

  filterColumns(columnFilter: any) {
    var isCaseSensitive = columnFilter.caseSensitive;
    var column = columnFilter.column;

    var filter = isCaseSensitive
      ? columnFilter.filter
      : String(columnFilter.filter).toLowerCase();
    this.displayColumnFilters.push(
      this.displayNames[Object.keys(this.data[0]).indexOf(column)] +
        ': ' +
        columnFilter.filter
    );

    this.displayData = this.filteredDisplayData.filter((data) => {
      if (
        filter != null &&
        data[column] != null &&
        String(
          isCaseSensitive ? data[column] : String(data[column]).toLowerCase()
        ).includes(filter)
      ) {
        return data;
      }
    });
    this.filteredDisplayData = this.displayData;
    this.viewMetaData.pageCount = this.calculatePageCount();
  }

  filterDateColumns(columnDateFilter: {
    column: any;
    startDate: Date;
    endDate: Date;
  }) {
    var column = columnDateFilter.column;

    this.displayData = this.displayData.filter((data) => {
      if (columnDateFilter != null && data[column] != null) {
        let dataDate = new Date(data[column]);
        let startDate = new Date(columnDateFilter.startDate);
        let endDate = new Date(columnDateFilter.endDate);

        return dataDate >= startDate && dataDate <= endDate;
      }
      return false;
    });
    this.filteredDisplayData = this.displayData;
  }

  clearFilter(filter: string, reload: boolean) {
    if (filter === 'all' || filter === 'column-date') {
      this.filterService.clearColumnDateFilter();
      this.columnDateFilters = [];
    }

    if (filter === 'all' || filter === 'column') {
      this.filterService.clearColumnFilter();
      this.displayColumnFilters = [];
    }

    if (filter === 'all' || filter === 'table') {
      if (filter == 'table') {
        this.filterService.setFilterProtection(false);
      }
      this.filterService.setFilterData({
        searchFilter: '',
        searchFilterApplied: false,
      });
      this.changePage(1);
    }

    if (reload) {
      this.reloadTable();
    }
  }

  removeColumnFilter(columnFilterIndex: number) {
    this.displayColumnFilters = this.displayColumnFilters.filter(
      (filter) => filter != this.displayColumnFilters[columnFilterIndex]
    );
    this.filterService.removeColumnFilter(
      this.columnFilters[columnFilterIndex].filter
    );
    this.columnFilters = this.filterService.getColumnFilter();

    this.reloadTable();
  }

  removeColumnDateFilter(columnFilterIndex: number) {
    this.filterService.removeColumnDateFilter(
      this.columnDateFilters[columnFilterIndex]
    );
    this.columnDateFilters = this.filterService.getColumnDateFilter();
    this.reloadTable();
  }

  setTableFilter() {
    this.filterService.setFilterData({
      searchFilter: this.filterService.getFilterData().searchFilter,
      searchFilterApplied: true,
    });
    this.loadPage();
  }

  applyTemporaryFilter() {
    var temporaryData: any[] = [];
    if (this.filterService.getFilterData().searchFilter != '') {
      this.displayData.forEach((data) => {
        if (
          Object.values(data).some((property) =>
            String(property)
              .toUpperCase()
              .includes(
                String(
                  this.filterService.getFilterData().searchFilter
                ).toUpperCase()
              )
          )
        ) {
          temporaryData.push(data);
        }
      });
    }
    return temporaryData;
  }

  showAdvancedFilter() {
    var columns = Object.keys(this.data[0]);
    this.filterService.setTableColumns(
      this.displayNames,
      columns,
      this.dataTypes
    );
    this.formService.showFilterForm();
  }

  async reloadTable() {
    this.loadPage();
    await this.loadTable(String(this.tableName));
  }

  async calculateDistance() {
    if (this.selectedRows.length !== 1) {
      this.showWarningMessage(
        'Please select a single row to calculate the distance!'
      );
      return;
    }

    const invoice_id = this.selectedRows[0];
    var row = this.data.filter((row: any) => row.id == invoice_id)[0];

    if (!row['warehouse_id']) {
      this.showWarningMessage(
        "This invoice doesn't have a designated warehouse. To calculate the distance please assign a warehouse!"
      );
      return;
    }

    if (!row['customer_id']) {
      this.showWarningMessage(
        "This invoice doesn't have a designated customer. To calculate the distance please assign a customer!"
      );
      return;
    }

    this.distanceLoading = true;

    let coordinates = await this.dataService.processGet('calculate-distance', {
      invoice_id: invoice_id,
      warehouse_id: row['warehouse_id'],
    });

    this.handleCoordinatesResponse(coordinates);
    this.distanceLoading = false;
  }

  handleCoordinatesResponse(coordinates: any) {
    if (
      !coordinates ||
      !coordinates['customer_coordinates'] ||
      !coordinates['warehouse_coordinates']
    ) {
      this.showErrorMessage(
        'There was an error getting the coordinates! One of the postcodes may not be in the database.'
      );
      return;
    }

    if (
      !coordinates['customer_postcode'] ||
      !coordinates['warehouse_postcode']
    ) {
      this.showErrorMessage(
        "There was an error getting the postcodes! Either the warehouse or the customer doesn't have a postcode."
      );
      return;
    }

    const distance = this.calculateHaversine(
      coordinates['customer_coordinates'],
      coordinates['warehouse_coordinates']
    );
    this.formService.setMessageFormData({
      title: 'Distance',
      message: `The distance between the warehouse at ${coordinates['warehouse_postcode']} and the customer postcode at ${coordinates['customer_postcode']} in a straight line is ${distance}km`,
    });
    this.formService.showMessageForm();
  }

  showWarningMessage(message: string) {
    this.formService.setMessageFormData({ title: 'Warning!', message });
    this.formService.showMessageForm();
  }

  showErrorMessage(message: string) {
    this.formService.setMessageFormData({ title: 'Error!', message });
    this.formService.showMessageForm();
  }

  calculateHaversine(coord1: any, coord2: any): string {
    const R = 6371000; // Earth's radius in meters
    const lat1Rad = coord1.latitude * (Math.PI / 180);
    const lat2Rad = coord2.latitude * (Math.PI / 180);
    const deltaLat = (coord2.latitude - coord1.latitude) * (Math.PI / 180);
    const deltaLon = (coord2.longitude - coord1.longitude) * (Math.PI / 180);

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1Rad) *
        Math.cos(lat2Rad) *
        Math.sin(deltaLon / 2) *
        Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = (R * c) / 1000; // Distance in km
    return distance.toFixed(2);
  }
}
