import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { FormService } from '../../services/form.service';
import { FilterService } from '../../services/filter.service';
import { apiUrlBase, imageUrlBase } from '../../services/data.service';
import { Location } from '@angular/common';
import { lastValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { columnFilter, columnDateFilter, sortedColumn, viewMetadata, filterData } from '../../common/types/view/types';
import { editableData } from '../../common/types/forms/types';
import { tableIcons } from '../../common/icons/table-icons'

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent {
  accessible = false;

  icons = tableIcons;

  apiUrlBase = apiUrlBase;
  imageUrlBase = imageUrlBase;
  
  tableName: string = "";
  displayName: string = "";
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

  images: { [key:string]: any}[] = [];

  distanceLoading = false;

  icon = tableIcons.faLock;

  filter: string = '';

  filterData: filterData;

  viewMetaData: viewMetadata;

  tabs: {displayName: string, tableName: string}[] = [];

  sortedColumn: sortedColumn = {columnName: '', ascending: false};

  constructor(private authService: AuthService, private router: Router, private filterService: FilterService, private formService: FormService, private route: ActivatedRoute, private dataService: DataService, private _location: Location) {
    this.accessible = this.authService.returnAccess();

    this.viewMetaData = {
      loaded: false,
      entryLimit: 10,
      pageCount: 0,
      currentPage: 1
    };

    this.editable = {
      columns: [],
      types: [],
      names: [],
      required: [],
      fields: [],
      values: []
    };

    this.filterData = {
      searchFilter: '',
      searchFilterApplied: false,
    }
  }

  ngOnInit() {
    this.subscriptionHandler();
  }

  async subscriptionHandler() {
    this.route.queryParams.subscribe((params) => {
      this.tableName = params['table'] || null;
      if (this.tableName != null) {
        this.resetTable();
        this.convertTableName();
        this.formService.setSelectedTable(String(this.tableName));
        this.loadTable(String(this.tableName));
        this.loadPage();
        this.tabs = this.dataService.getTabs();
      }
    });

    this.formService.getReloadRequest().subscribe(async (reloadRequested: boolean) => {
      if (reloadRequested) {
        let reloadType = this.formService.getReloadType();
        if (reloadType == 'hard') {
          this.selectedRows = [];
          await this.loadTable(String(this.tableName));
        } else if (reloadType == 'filter') {
          this.applyFilter();
        }
        this.formService.performReload();
      }
    });
  }

  convertTableName() {
    switch (this.tableName) {
      case 'allergen_information':
        this.displayName = 'Allergen Information';
        break;
      case "categories":
        this.displayName = 'Categories';
        break;
      case 'customer_address':
        this.displayName = 'Customer Address';
        break;
      case 'customer_payments':
        this.displayName = 'Customer Payments';
        break;
      case 'customers':
        this.displayName = 'Customers';
        break;
      case 'discount_codes':
        this.displayName = 'Discount Codes';
        break;
      case 'expired_items':
        this.displayName = 'Expired Items';
        break;
      case 'general_ledger':
        this.displayName = 'General Ledger';
        break;
      case 'image_locations':
        this.displayName = 'Image Locations';
        break;
      case 'interest_charges':
        this.displayName = 'Interest Charges';
        break;
      case 'invoiced_items':
        this.displayName = 'Invoiced Items';
        break;
      case 'invoices':
        this.displayName = 'Invoices';
        break;
      case 'items':
        this.displayName = 'Items';
        break;
      case 'nutrition_info':
        this.displayName = 'Nutrition Information';
        break;
      case 'offers':
        this.displayName = 'Offers';
        break;
      case 'page_section_text':
        this.displayName = 'Page Section Text';
        break;
      case 'page_sections':
        this.displayName = 'Page Sections';
        break;
      case 'payments':
        this.displayName = 'Payments';
        break;
      case 'price_list':
        this.displayName = 'Price List';
        break;
      case 'retail_item_images':
        this.displayName = 'Retail Item Images';
        break;
      case 'retail_items':
        this.displayName = 'Retail Items';
        break;
      case 'retail_users':
        this.displayName = 'Retail Users';
        break;
      case 'stocked_items':
        this.displayName = 'Stocked Items';
        break;
      case "sub_categories":
        this.displayName = "Sub-categories"
        break;
      case 'supplier_invoices':
        this.displayName = 'Supplier Invoices';
        break;
      case 'suppliers':
        this.displayName = 'Suppliers';
        break;
      case 'users':
        this.displayName = 'Users';
        break;
      case 'warehouse':
        this.displayName = 'Warehouse';
        break;
    }
  }

  changeTab(tableName: string) {
    if (tableName != "debtor_creditor" && tableName != "profit_loss" && tableName != "statistics") {
      this.router.navigate(['/view'], { queryParams: {table: tableName } });
    } else if (tableName == "statistics") {
      this.router.navigate(['/statistics'])
    } else {
      this.router.navigate(['/page'], { queryParams: {table: tableName } });
    }
  }
  
  async loadTable(table: string) {
    this.viewMetaData.loaded = false;
    
    if (this.tableName == 'items') {
      let totalStockData = await lastValueFrom(this.dataService.processData('total-stock'));
      totalStockData = Array.isArray(totalStockData) ? totalStockData : [totalStockData];

      totalStockData.forEach((stock: any) => {
        this.stockData[stock.item_id] = stock.total_quantity;
      });
    }

    if (this.tableName == 'stocked_items') {
      let images = await lastValueFrom(this.dataService.processData('stocked-item-images'));
      images = Array.isArray(images) ? images : [images];
      
      if (images != null) {
        images.forEach((imageData: any) => {
          this.images[imageData.item_id] = imageData.file_name
        });
      };
    }

    let tableData = await lastValueFrom(this.dataService.processData('table', table));

    if (tableData != null) {
      this.data = Array.isArray(tableData.data) ? tableData.data : [tableData.data];
      this.displayData = Array.isArray(tableData.display_data) ? tableData.display_data : [tableData.display_data];
      this.dataTypes = tableData.types;
      this.filteredDisplayData = this.displayData;
      this.displayNames = tableData.display_names;
      this.editable = tableData.editable;

      this.applyFilter();

      this.viewMetaData.pageCount = this.calculatePageCount();

      this.changePage(this.viewMetaData.currentPage);

      this.viewMetaData.loaded = true;
    }    
  }

  getColumnHeaders(obj: { [key: string]: any }): string[] {
    return obj ? Object.keys(obj) : [];
  }

  sortColumn(column: any) {
    this.filteredDisplayData = this.displayData;
    let dataName : string = this.editable.columns.filter((_, index) => this.editable.names[index] == column)[0];    
    if (dataName === undefined) {
      dataName = 'id';
    }

    if (this.sortedColumn.columnName == column) {
      this.sortedColumn.ascending = !this.sortedColumn.ascending;
    } else {
      this.sortedColumn = { columnName: column, ascending: false };
    }
    if (this.sortedColumn.ascending) {
      this.filteredDisplayData.sort((a: any, b: any) => {
        if (a[dataName] < b[dataName]) {
          return -1;
        }
        if (a[dataName] > b[dataName]) {
          return 1;
        }
        return 0;
      });
    }
    else {
      this.filteredDisplayData.sort((a: any, b: any) => {
        if (a[dataName] < b[dataName]) {
          return 1;
        }
        if (a[dataName] > b[dataName]) {
          return -1;
        }
        return 0;
      });
    }
    this.changePage(1);
  }

  async editRow(id: any, table: string) {
    var row = this.data.filter((row: any) => row.id == id)[0];

    if (table == '') {
      if (this.tableName == 'invoices') {
        if (row['status'] == 'Complete') {
          this.formService.setMessageFormData({title: 'Warning!', message: 'This invoice is locked! Changing the data could have undesired effects. To continue, click the padlock on the invoice you want to edit!'});
          this.formService.showMessageForm();
        } else {
          this.formService.processEditFormData(id, row, this.editable)
          this.prepareEditFormService(id, table);
        }
      } else {
        this.formService.processEditFormData(id, row, this.editable)
        this.prepareEditFormService(id, table);
      }

      return;
    }

    let editFormData = await lastValueFrom(this.dataService.processData("edit-form-data", table));
      
    var fakeRow = JSON.parse(JSON.stringify(row));

    let appendOrAdd;

    switch (table) {
      case "allergen_information":
      case "nutrition_info":
        switch (this.tableName) {
          case "items":
            appendOrAdd = await lastValueFrom<any>(this.dataService.collectDataComplex("append-or-add", { table: table, id: id, column: 'item_id' }));
            
            fakeRow['item_id'] = id;
              if (appendOrAdd.id) {
                fakeRow = appendOrAdd;
                this.formService.processEditFormData(appendOrAdd.id, fakeRow, editFormData);
                this.prepareEditFormService(appendOrAdd.id, table);
              } else {
                let values: (string | null)[] = Array(editFormData.columns.length).fill(null);
                const itemIdIndex = editFormData.names.indexOf('Item ID');
                values[itemIdIndex] = id;
                editFormData.values = values;

                this.formService.processAddFormData(editFormData, {
                  showAddMore: false
                });
                this.prepareAddFormService(table);
              }
            break;
        }
        break;

      default:
        this.formService.processEditFormData(id, fakeRow, editFormData);
        this.prepareEditFormService(id, table);
        break;
    }
  }

  prepareEditFormService(id: any, table: string) {
    this.formService.setSelectedTable(table == '' ? String(this.tableName) : table);
    this.formService.setSelectedId(id);
    this.formService.showEditForm();
    this.formService.setReloadType("hard");
  }

  prepareAddFormService(table: string) {
    this.formService.setSelectedTable(table == '' ? String(this.tableName) : table);
    this.formService.showAddForm();
    this.formService.setReloadType("hard");
  }

  async addRow(values: any) {
    var addFormData = {
      columns: this.editable.columns,
      types: this.editable.types,
      names: this.editable.names,
      required: this.editable.required,
      fields: this.editable.fields,
      values: values,
    }
    this.formService.processAddFormData(addFormData, this.formService.constructFormSettings(this.tableName));
    this.formService.setSelectedTable(String(this.tableName));
    this.formService.showAddForm();
    this.formService.setReloadType("hard");
  }

  deleteRow(id: number) {
    if (this.canDelete(id)) {
      this.formService.setSelectedTable(String(this.tableName));
      this.formService.setDeleteFormIds([id]);
      this.formService.showDeleteForm();
      this.formService.setReloadType("hard");
    }
  }

  deleteRows() {
    if (this.selectedRows.every(id => this.canDelete(id))) {
      this.formService.setSelectedTable(String(this.tableName));
      this.formService.setDeleteFormIds(this.selectedRows);
      this.formService.showDeleteForm();
      this.formService.setReloadType("hard");
    }
  }

  canDelete(id: number) {
    var row = this.data.filter((row: any) => row.id == id)[0];
    switch (this.tableName) {
      case "customer_payments":
        if (row['linked_payment_id'] != null) {
          this.formService.setMessageFormData({title: "Error", message: "You cannot delete this payment because it is linked. Please delete or alter the linked payment instead!"});
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
    this.viewMetaData.pageCount = this.calculatePageCount();
    this.viewMetaData.currentPage = 1;
    this.loadPage();
  }

  itemContainsFilter(item: any) {
    return this.filter != null && item != null && Object.values(item).some(value => String(value).includes(this.filter))
  }

  nextPage() {
    if (this.viewMetaData.currentPage < this.viewMetaData.pageCount) {
      this.viewMetaData.currentPage++;
      this.loadPage();
    }
  }
  previousPage() {
    if (this.viewMetaData.currentPage > 1) {
      this.viewMetaData.currentPage--;
      this.loadPage();
    }
  }
  changePage(page: number) {
    this.viewMetaData.currentPage = page;
    this.loadPage();
  }

  loadPage() {
    var start = (this.viewMetaData.currentPage - 1) * this.viewMetaData.entryLimit;
    var end = start + this.viewMetaData.entryLimit;

    if (this.filterData.searchFilter === '') {
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
    
    if (this.viewMetaData.currentPage > this.viewMetaData.pageCount -2 && this.viewMetaData.pageCount -2 > 0) {
      start = this.viewMetaData.pageCount - 2;
    }
    if (start == 1 && this.viewMetaData.pageCount > 1) {
      start += 2;
    }
    else if (start == 2 && this.viewMetaData.pageCount > 1) {
      start += 1;
    }
    for (let i = start - 1; i < start + 2 && i < this.viewMetaData.pageCount && this.viewMetaData.pageCount > 1; i++) {
      range.push(i);
    }

    if (this.viewMetaData.pageCount > 1) {
      range.push(this.viewMetaData.pageCount);
    }

    return range;
  }

  async changeCheckBox(event: Event, key: number, columnName: string) {
    const option = event.target as HTMLInputElement;
    let checked = option.checked;
    let data = { ...this.data[key] };
    data[columnName] = checked ? "Yes" : "No";
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
      this.selectedRows = this.selectedRows.filter(function (item) { return item !== rowId; })
    }
  }

  print() {
    if (this.selectedRows.length < 1) {
      this.showErrorMessage("Please select an invoice before trying to print!");
      return;
    }

    const hasMissingWarehouseOrCustomer = this.selectedRows.some(selectedRow => {
      var currentRow = this.data.filter((row: any) => row.id == selectedRow)[0];
      if (currentRow['warehouse_id'] == null) {
        this.showErrorMessage(`Invoice ${selectedRow} is missing a warehouse! Please assign a warehouse before attempting to print.`);
        return true;
      }
      if (currentRow['customer_id'] == null) {
        this.showErrorMessage(`Invoice ${selectedRow} is missing a customer! Please assign a customer before attempting to print.`);
        return true;
      }
      return false;
    });

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
        { name: "ID", type: "number" },
        { name: "Item Name", type: "string" },
        { name: "Quantity", type: "number" },
        { name: "Expiry Date", type: "date" },
        { name: "Packing Format", type: "string" },
        { name: "Barcode", type: "string" },
        { name: "Warehouse", type: "string" }
      ];

      let tableRows = await lastValueFrom(this.dataService.processData("stocked-items", itemId));
      tableRows = Array.isArray(tableRows) ? tableRows : [tableRows];
      let tableName = "stocked_items";
      let title = `Stocked Items for ${row['item_name']}`;

      this.dataService.storeWidgetData({headers: tableColumns, rows: tableRows, tableName: tableName, title: title, idData: {id: itemId, columnName: "Item ID"}, query: "stocked-items"});
      this.formService.showWidget();
    }
  }

  async invoiceSearch(invoiceId: string) {
    var row = this.data.filter((row: any) => row.id == invoiceId)[0];
    
    let tableColumns = [
      { name: "ID", type: "number" },
      { name: "Item Name", type: "string" },
      { name: "Unit", type: "string" },
      { name: "Picture", type: "image" },
      { name: "Quantity", type: "number" },
      { name: "VAT Charge", type: "enum" },
      { name: "Discount", type: "number" }
    ];
    let tableRows = await lastValueFrom(this.dataService.processData("invoiced-items", invoiceId));
    tableRows = Array.isArray(tableRows) ? tableRows : [tableRows];
    let tableName = "invoiced_items";
    let title = `Invoiced Items for ${row['title']}`;

    this.dataService.storeWidgetData({headers: tableColumns, rows: tableRows, tableName: tableName, title: title, idData: {id: invoiceId, columnName: "Invoice ID"}, query: "invoiced-items", disabled: { value: row['status'] == 'Complete', message: 'This invoice is locked and cannot be modified!'}});
    this.formService.showWidget();
  }

  async supplierInvoiceSearch(invoiceId: string) {
    var row = this.data.filter((row: any) => row.id == invoiceId)[0];
    let tableColumns = [
      { name: "ID", type: "number" },
      { name: "Item Name", type: "string" },
      { name: "Picture", type: "image" },
      { name: "Price", type: "currency" },
      { name: "Purchase Date", type: "date" },
      { name: "Quantity", type: "number" },
      { name: "Expiry Date", type: "string" },
      { name: "Packing Format", type: "enum" },
      { name: "Barcode", type: "string" },
      { name: "Warehouse", type: "number" }
    ];
    let tableRows = await lastValueFrom(this.dataService.processData("stocked-items-invoice", invoiceId));
    tableRows = Array.isArray(tableRows) ? tableRows : [tableRows];
    let tableName = "stocked_items";
    let title = `Stocked Items from ${row['reference']}`;

    this.dataService.storeWidgetData({headers: tableColumns, rows: tableRows, tableName: tableName, title: title, idData: {id: invoiceId, columnName: "Supplier Invoice ID"}, query: "stocked-items-invoice"});
    this.formService.showWidget();
  }

  async addressSearch(customerId: string, accountName: string) {
    let tableColumns = [
      { name: "ID", type: "number" },
      { name: "Invoice Address One", type: "string" },
      { name: "Invoice Address Two", type: "string" },
      { name: "Invoice Address Three", type: "string" },
      { name: "Invoice Address Four", type: "string" },
      { name: "Invoice Postcode", type: "string" },
      { name: "Delivery Address One", type: "string" },
      { name: "Delivery Address Two", type: "string" },
      { name: "Delivery Address Three", type: "string" },
      { name: "Delivery Address Four", type: "string" },
      { name: "Delivery Postcode", type: "string" }
    ];  
    let tableRows = await lastValueFrom(this.dataService.processData("customer-addresses-by-id", customerId));
    tableRows = Array.isArray(tableRows) ? tableRows : [tableRows];
    let tableName = "customer_address";
    let title = `Customer Addresses for ${accountName}`;

    this.dataService.storeWidgetData({headers: tableColumns, rows: tableRows, tableName: tableName, title: title, idData: {id: customerId, columnName: "Customer Name"}, query: "customer-addresses-by-id"});
    this.formService.showWidget();
  }

  shouldColourCell(data: any) {
    switch(this.tableName) {
      case "invoices":
        switch(data) {
          case "Overdue":
            return "red";
          case "Complete":
            return "green";
          case "Pending":
            return "orange";
        }
        break;        
    }
    return null;
  }

  back() {
    this._location.back()
  }

  canDisplayColumn(column: string) {
    if (this.authService.getAccessLevel() == 'Low') {
      if (column == 'edit-row' || column == 'delete-row') {
        return false;
      }
    }

    if (this.authService.getAccessLevel() == 'High') {
      if (column == 'delete-row') {
        return false;
      }
    }

    switch (this.tableName) {
      case "customers":
      case "users":
        if (column == "password" || column == "Password") {
          return false;
        }
        break;

      case "invoices":
        if (this.authService.getAccessLevel() == 'Driver') {
          switch (column) {
            case "gross_value":
            case "VAT":
            case "total":
            case "outstanding_balance":
            case "payment_status":
            case "Gross Value":
            case "Total":
            case "Outstanding Balance":
            case "Paid":
            case "edit-row":
            case "delete-row":
            case "invoiced-items":
            case "ID":
            case "id":
            case "Printed":
            case "printed":
              return false;
          }
        }
        return true;
    }
    return true;
  }

  displayWithIcon(column: string, row: any) {
    switch (this.tableName) {
      case "invoices":
        if (column == "id") {
          this.icon = row['status'] == "Complete" ? tableIcons.faLock : tableIcons.faLockOpen;
          return true;
        }
        break;
    }
    return false;
  }

  async iconClick(event: Event, key: number, column: string, row: any) {
    switch (this.tableName) {
      case "invoices":
        if (column == 'id') {
          let data = { ...this.data[key] };
          data['status'] = data['status'] == 'Complete' ? 'Pending' : 'Complete';
          row['status'] = data['status'];
          data['action'] = 'append';
          data['table_name'] = String(this.tableName);

          let submissionResponse = await this.dataService.submitFormData(data);

          if (submissionResponse.success) {
            this.reloadTable();
          } else {
            this.formService.setMessageFormData({ title: "Error!", message: "There was an error trying to unlock the booking!" });
            this.formService.showMessageForm();
          }
        }
        break;
    }
  }

  calculatePageCount() {
    return Math.ceil(this.filteredDisplayData.length / this.viewMetaData.entryLimit);
  }

  //Filter
  
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

    var filter = isCaseSensitive ? columnFilter.filter : String(columnFilter.filter).toLowerCase();
    this.displayColumnFilters.push(this.displayNames[Object.keys(this.data[0]).indexOf(column)] + ": " + columnFilter.filter);

    this.displayData = this.filteredDisplayData.filter((data) => {
      if (filter != null && data[column] != null && String(isCaseSensitive ? data[column] : String(data[column]).toLowerCase()).includes(filter)) {
        return data;
      }
    });
    this.filteredDisplayData = this.displayData;
    this.viewMetaData.pageCount = this.calculatePageCount();
  }

  filterDateColumns(columnDateFilter: { column: any; startDate: Date; endDate: Date; }) {
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
    if (filter === "all" || filter === "column-date") {
      this.filterService.clearColumnDateFilter();
      this.columnDateFilters = [];
    }
  
    if (filter === "all" || filter === "column") {
      this.filterService.clearColumnFilter();
      this.displayColumnFilters = [];
    }
  
    if (filter === "all" || filter === "table") {
      this.filterData.searchFilter = '';
      this.filterData.searchFilterApplied = false;
    }
  
    if (reload) {
      this.reloadTable();
    }
  }

  removeColumnFilter(columnFilterIndex: number) {
    this.displayColumnFilters = this.displayColumnFilters.filter((filter) => filter != this.displayColumnFilters[columnFilterIndex]);
    this.filterService.removeColumnFilter(this.columnFilters[columnFilterIndex].filter);
    this.columnFilters = this.filterService.getColumnFilter();
    
    this.reloadTable();
  }

  removeColumnDateFilter(columnFilterIndex: number) {
    this.filterService.removeColumnDateFilter(this.columnDateFilters[columnFilterIndex]);
    this.columnDateFilters = this.filterService.getColumnDateFilter();
    this.reloadTable();
  }

  setTableFilter() {
    this.filterData.searchFilterApplied = true;
    this.loadPage();
  }

  applyTemporaryFilter() {
    var temporaryData: any[] = [];
    if (this.filterData.searchFilter != '') {
      this.displayData.forEach(data => {
        if (Object.values(data).some(property => String(property).toUpperCase().includes(String(this.filterData.searchFilter).toUpperCase()))) {
          temporaryData.push(data);
        }
      });
    }
    return temporaryData;
  }

  showAdvancedFilter() {
    var columns = Object.keys(this.data[0]);
    this.filterService.setTableColumns(this.displayNames, columns, this.dataTypes);
    this.formService.showFilterForm();
  }

  async reloadTable() {
    this.loadPage();
    await this.loadTable(String(this.tableName));
  }

  async calculateDistance() {
    if (this.selectedRows.length !== 1) {
      this.showWarningMessage("Please select a single row to calculate the distance!");
      return;
    }

    const invoice_id = this.selectedRows[0];
    var row = this.data.filter((row: any) => row.id == invoice_id)[0];

    if (!row['warehouse_id']) {
      this.showWarningMessage("This invoice doesn't have a designated warehouse. To calculate the distance please assign a warehouse!");
      return;
    }

    if (!row['customer_id']) {
      this.showWarningMessage("This invoice doesn't have a designated customer. To calculate the distance please assign a customer!");
      return;
    }

    this.distanceLoading = true;

    let coordinates = await lastValueFrom(this.dataService.collectDataComplex("calculate-distance", { customer_id: row['customer_id'], warehouse_id: row['warehouse_id'] }));

    this.handleCoordinatesResponse(coordinates);
    this.distanceLoading = false;
  }

  handleCoordinatesResponse(coordinates: any) {
    if (!coordinates || !coordinates['customer_coordinates'] || !coordinates['warehouse_coordinates']) {
      this.showErrorMessage("There was an error getting the coordinates! One of the postcodes may not be in the database.");
      return;
    }

    if (!coordinates['customer_postcode'] || !coordinates['warehouse_postcode']) {
      this.showErrorMessage("There was an error getting the postcodes! Either the warehouse or the customer doesn't have a postcode.");
      return;
    }

    const distance = this.calculateHaversine(coordinates['customer_coordinates'], coordinates['warehouse_coordinates']);
    this.formService.setMessageFormData({
      title: "Distance",
      message: `The distance between the warehouse at ${coordinates['warehouse_postcode']} and the customer postcode at ${coordinates['customer_postcode']} in a straight line is ${distance}km`
    });
    this.formService.showMessageForm();
  }

  showWarningMessage(message: string) {
    this.formService.setMessageFormData({ title: "Warning!", message });
    this.formService.showMessageForm();
  }

  showErrorMessage(message: string) {
    this.formService.setMessageFormData({ title: "Error!", message });
    this.formService.showMessageForm();
  }

  calculateHaversine(coord1: any, coord2: any): string {
    const R = 6371000; // Earth's radius in meters
    const lat1Rad = coord1.latitude * (Math.PI/180);
    const lat2Rad = coord2.latitude * (Math.PI/180);
    const deltaLat = (coord2.latitude - coord1.latitude) * (Math.PI/180);
    const deltaLon = (coord2.longitude - coord1.longitude) * (Math.PI/180);
  
    const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) *
      Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
    const distance = R * c / 1000; // Distance in km
    return distance.toFixed(2);
  }
}
