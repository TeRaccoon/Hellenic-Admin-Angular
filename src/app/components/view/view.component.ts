import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { FormService } from '../../services/form.service';
import { FilterService } from '../../services/filter.service';
import { apiUrlBase, imageUrlBase } from '../../services/data.service';
import { faAddressBook, faBox, faLock, faLockOpen, faBasketShopping, faSpinner, faPencil, faSearch, faPrint, faTrashCan, faFilter, faX, faArrowsLeftRight, faArrowLeft, faArrowUp, faArrowDown, faBookMedical, faBookOpen, faTruckFront, faTruck } from '@fortawesome/free-solid-svg-icons';
import { Location } from '@angular/common';
import { lastValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent {
  accessible = false;

  apiUrlBase = apiUrlBase;
  imageUrlBase = imageUrlBase;

  faAddressBook = faAddressBook;
  faBox = faBox;
  faLock = faLock;
  faLockOpen = faLockOpen;
  faBasketShopping = faBasketShopping;
  faSpinner = faSpinner;
  faPencil = faPencil;
  faSearch = faSearch;
  faPrint = faPrint;
  faTrashCan = faTrashCan;
  faFilter = faFilter;
  faX = faX;
  faArrowsLeftRight = faArrowsLeftRight;
  faArrowLeft = faArrowLeft;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  faBookMedical = faBookMedical;
  faBookOpen = faBookOpen;
  faTruck = faTruckFront;
  
  tableName: string | null = null;
  displayName: string = "";
  tableFilter: string | null = null;
  queryFilter: string | null = null;
  displayColumnFilters: string[] = [];
  columnFilters: { column: string, filter: string, caseSensitive: boolean }[] = [];
  columnDateFilters: { column: string, startDate: Date, endDate: Date }[] = [];

  data: { [key: string]: any }[] = [];
  displayNames: { [key: string]: any }[] = [];
  displayData: any[] = [];
  dataTypes: any[] = [];
  filteredDisplayData: any[] = [];
  editable = {
    columns: [],
    types: [],
    names: [],
    required: [],
    fields: [],
  };
  stockData: any = {};

  selectedRows: number[] = [];

  images: { [key:string]: any}[] = [];

  entryLimit: number = 10;
  pageCount: number = 0;
  currentPage: number = 1;

  loaded = false;
  distanceLoading = false;

  icon = faLock;

  searchText: string = '';
  filter: string = '';
  setFilter = false;

  tabs: {displayName: string, tableName: string}[] = [];

  sortedColumn: { columnName: string, ascending: boolean } = {columnName: '', ascending: false};

  constructor(private authService: AuthService, private router: Router, private filterService: FilterService, private formService: FormService, private route: ActivatedRoute, private dataService: DataService, private _location: Location) {
    this.accessible = this.authService.returnAccess();
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
        if (reloadType == "hard") {
          this.selectedRows = [];
          await this.loadTable(String(this.tableName));
        } else if (reloadType == "invoice-widget") {
          this.invoiceSearch(this.formService.getReloadId());
        } else if (reloadType == "stock-widget") {
          this.stockSearch(this.formService.getReloadId());
        } else if (reloadType == "filter") {
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
    this.loaded = false;
    this.queryFilter = this.filterService.getTableFilter();
    var queryString = this.queryFilter == null ? "table" : this.queryFilter;

    if (this.queryFilter == null) {
      queryString = "table"
    }

    if (this.tableName == "items") {
      let totalStockData = await lastValueFrom(this.dataService.collectData("total-stock"));
      totalStockData = Array.isArray(totalStockData) ? totalStockData : [totalStockData];

      totalStockData.forEach((stock: any) => {
        this.stockData[stock.item_id] = stock.total_quantity;
      });
    }

    if (this.tableName == "stocked_items") {
      let images = await lastValueFrom(this.dataService.collectData("stocked-item-images"));
      images = Array.isArray(images) ? images : [images];
      
      if (images != null) {
        images.forEach((imageData: any) => {
          this.images[imageData.item_id] = imageData.file_name
        });
      };
    }

    let tableData = await lastValueFrom(this.dataService.collectData(queryString, table));

    if (tableData != null) {
      this.data = Array.isArray(tableData.data) ? tableData.data : [tableData.data];
      this.displayData = Array.isArray(tableData.display_data) ? tableData.display_data : [tableData.display_data];
      this.dataTypes = tableData.types;
      this.filteredDisplayData = this.displayData;
      this.displayNames = tableData.display_names;
      this.editable = tableData.editable;

      this.applyFilter();

      this.pageCount = Math.floor(this.filteredDisplayData.length / this.entryLimit) + 1;

      this.loaded = true;
    }    
  }

  getColumnHeaders(obj: { [key: string]: any }): string[] {
    return obj ? Object.keys(obj) : [];
  }

  sortColumn(column: any) {
    this.filteredDisplayData = this.displayData;
    let dataName = this.editable.columns.filter((_, index) => this.editable.names[index] == column)[0];
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

    let editFormData = await lastValueFrom(this.dataService.collectData("edit-form-data", table));
      
    var fakeRow = JSON.parse(JSON.stringify(row));

    let appendOrAdd;

    switch (table) {
      case "allergen_information":
      case "nutrition_info":
        switch (this.tableName) {
          case "retail_items":
            fakeRow['retail_item_id'] = id;
            appendOrAdd = await lastValueFrom<any>(this.dataService.collectDataComplex("append-or-add", { table: table, id: id, column: 'retail_item_id' }));

            if (appendOrAdd.id) {
              fakeRow = appendOrAdd;
              this.formService.processEditFormData(id, fakeRow, editFormData);
              this.prepareEditFormService(id, table);
            } else {
              let values: (string | null)[] = Array(editFormData.columns.length).fill(null);
              const retailItemIdIndex = editFormData.names.indexOf('Retail Item ID');
              values[retailItemIdIndex] = id;
              editFormData.values = values;
              this.formService.processAddFormData(editFormData);
              this.prepareAddFormService(table);
            }
            break;

          case "items":
            let reverseItemId = await lastValueFrom<any>(this.dataService.collectData("reverse-item-id", id));
            appendOrAdd = await lastValueFrom<any>(this.dataService.collectDataComplex("append-or-add", { table: table, id: reverseItemId, column: 'retail_item_id' }));
            
            fakeRow['retail_item_id'] = reverseItemId;
              if (appendOrAdd.id) {
                fakeRow = appendOrAdd;
                this.formService.processEditFormData(reverseItemId, fakeRow, editFormData);
                this.prepareEditFormService(reverseItemId, table);
              } else {
                let values: (string | null)[] = Array(editFormData.columns.length).fill(null);
                const retailItemIdIndex = editFormData.names.indexOf('Retail Item ID');
                values[retailItemIdIndex] = reverseItemId;
                editFormData.values = values;
                this.formService.processAddFormData(editFormData);
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
    this.formService.processAddFormData(addFormData);
    this.formService.setSelectedTable(String(this.tableName));
    this.formService.showAddForm();
    this.formService.setReloadType("hard");
  }

  deleteRow(id: number) {
    this.formService.setSelectedTable(String(this.tableName));
    this.formService.setDeleteFormIds([id]);
    this.formService.showDeleteForm();
    this.formService.setReloadType("hard");
  }

  deleteRows() {
    this.formService.setSelectedTable(String(this.tableName));
    this.formService.setDeleteFormIds(this.selectedRows);
    this.formService.showDeleteForm();
    this.formService.setReloadType("hard");
  }

  changeEntries(event: Event) {
    const option = event.target as HTMLInputElement;
    this.entryLimit = Number(option.value);
    this.pageCount = Math.ceil(this.displayData.length / this.entryLimit);
    this.currentPage = 1;
    this.loadPage();
  }

  itemContainsFilter(item: any) {
    return this.filter != null && item != null && Object.values(item).some(value => String(value).includes(this.filter))
  }

  nextPage() {
    if (this.currentPage < this.pageCount) {
      this.currentPage++;
      this.loadPage();
    }
  }
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPage();
    }
  }
  changePage(page: number) {
    this.currentPage = page;
    this.loadPage();
  }

  loadPage() {
    var start = (this.currentPage - 1) * this.entryLimit;
    var end = start + this.entryLimit;
    if (this.tableFilter == null && this.searchText == '') {
      this.filteredDisplayData = this.displayData.slice(start, end);
    } else {
      this.filteredDisplayData = this.applyTemporaryFilter();
      this.pageCount = Math.floor(this.filteredDisplayData.length / this.entryLimit) + 1;
      this.filteredDisplayData = this.filteredDisplayData.slice(start, end);
    }
  }

  resetTable() {
    this.clearFilter("all", true);
    this.filterService.clearFilter();
    this.pageCount = 0;
    this.currentPage = 1;
    this.selectedRows = [];
  }

  getPageRange(): number[] {
    const range = [];
    var start = this.currentPage;
    
    if (this.currentPage > this.pageCount -2 && this.pageCount -2 > 0) {
      start = this.pageCount - 2;
    }
    if (start == 1 && this.pageCount > 1) {
      start += 2;
    }
    else if (start == 2 && this.pageCount > 1) {
      start += 1;
    }
    for (let i = start - 1; i < start + 2 && i < this.pageCount && this.pageCount > 1; i++) {
      range.push(i);
    }

    if (this.pageCount > 1) {
      range.push(this.pageCount);
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
    await lastValueFrom(this.dataService.submitFormData(data));
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

  async invoiceSearch(id: string) {
    var row = this.data.filter((row: any) => row.id == id)[0];
    if (row['status'] == 'Complete') {
      this.formService.setMessageFormData({title: 'Warning!', message: 'This invoice is locked! Changing the data could have undesired effects. To continue, click the padlock on the invoice you want to edit!'});
      this.formService.showMessageForm();
    } else {
      let invoicedItems = await lastValueFrom(this.dataService.collectData("invoiced-items", id.toString()));
      invoicedItems = Array.isArray(invoicedItems) ? invoicedItems : [invoicedItems];

      var invoicedItemsWidgetData = { id: id, title: null, data: invoicedItems };

      if (row['title']) {
        invoicedItemsWidgetData.title = row['title'];
      }

      this.dataService.storeWidgetData(invoicedItemsWidgetData);
      this.formService.setReloadId(id);
      this.formService.showInvoicedItemForm();
    }
  }

  async stockSearch(id: string) {
    let stockData = await lastValueFrom(this.dataService.collectData("stocked-items", id));
    let total = await lastValueFrom(this.dataService.collectData("total-stock-from-item-id", id));

    if (stockData != null) {
      this.dataService.storeStockWidgetData({id: id, stock_data: stockData, total: total});
      this.formService.showStockedItemForm();
    }
  }

  async addressSearch(customerId: string, accountName: string) {
    let tableColumns = ["ID", "Invoice Address One", "Invoice Address Two", "Invoice Address Three", "Invoice Address Four", "Invoice Postcode", "Delivery Address One", "Delivery Address Two", "Delivery Address Three", "Delivery Address Four", "Delivery Postcode"];
    let tableRows = await lastValueFrom(this.dataService.collectData("addresses_from_customer_id", customerId));
    tableRows = Array.isArray(tableRows) ? tableRows : [tableRows];
    let tableName = "customer_address";
    let title = `Customer Addresses for ${accountName}`;

    this.dataService.storeWidgetData({headers: tableColumns, rows: tableRows, tableName: tableName, title: title, idData: {id: customerId, columnName: "Customer Name"}, query: "addresses_from_customer_id"});
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
    switch (this.tableName) {
      case "customers":
      case "users":
        if (column == "password") {
          return false;
        }
        break;
    }
    return true;
  }

  displayWithIcon(column: string, row: any) {
    switch (this.tableName) {
      case "invoices":
        if (column == "id") {
          this.icon = row['status'] == "Complete" ? faLock : faLockOpen;
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

          let submissionResponse = await lastValueFrom(this.dataService.submitFormData(data));

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
  
    if (filter === "all" || filter === "query") {
      this.filterService.clearFilter();
      this.queryFilter = null;
    }
  
    if (filter === "all" || filter === "table") {
      this.tableFilter = null;
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
    this.tableFilter = this.searchText;
    this.loadPage();
  }

  applyTemporaryFilter() {
    var temporaryData: any[] = [];
    if (this.tableFilter != null) {
      this.displayData.forEach(data => {
        if (Object.values(data).some(property => String(property).toUpperCase().includes(String(this.tableFilter).toUpperCase()))) {
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
