import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { FormService } from '../../services/form.service';
import { FilterService } from '../../services/filter.service';
import { urlBase } from '../../services/data.service';
import { faLock, faLockOpen, faBasketShopping, faSpinner, faPencil, faSearch, faPrint, faTrashCan, faFilter, faX, faArrowsLeftRight, faArrowLeft, faArrowUp, faArrowDown, faBookMedical, faBookOpen, faTruckFront, faTruck } from '@fortawesome/free-solid-svg-icons';
import {Location} from '@angular/common';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent {
  urlBase = urlBase;

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
  edittable = {
    columns: [],
    types: [],
    names: [],
    required: [],
    fields: [],
  };

  selectedRows: number[] = [];

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

  widgetVisible = false;

  sortedColumn: { columnName: string, ascending: boolean } = {columnName: '', ascending: false};

  constructor(private router: Router, private filterService: FilterService, private formService: FormService, private route: ActivatedRoute, private dataService: DataService, private _location: Location) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.tableName = params['table'] || null;
      if (this.tableName != null) {
        this.widgetVisible = false;
        this.resetTable();
        this.convertTableName();
        this.formService.setSelectedTable(String(this.tableName));
        this.loadTable(String(this.tableName));
        this.loadPage();
        this.tabs = this.dataService.getTabs();
      }
    });

    this.formService.getReloadRequest().subscribe((reloadRequested: boolean) => {
      if (reloadRequested) {
        if (this.formService.getReloadType() == "hard") {
          this.loadTable(String(this.tableName));
        } else if (this.formService.getReloadType() == "widget") {
          this.invoiceSearch();
        } else if (this.formService.getReloadType() == "filter") {
          this.applyFilter();
        }
        this.loadPage();
        this.formService.performReload();
      }
    });
  }

  convertTableName() {
    switch (this.tableName) {
      case 'allergen_information':
        this.displayName = 'Allergen Information';
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

    if (this.filterService.getTableFilter() == null) {
      queryString = "table"
    }

    this.dataService.collectData(queryString, table).subscribe((data: any) => {
      this.data = Array.isArray(data.data) ? data.data : [data.data];
      this.displayData = Array.isArray(data.display_data) ? data.display_data : [data.display_data];
      this.dataTypes = data.types;
      this.filteredDisplayData = this.displayData;
      this.displayNames = data.display_names;
      this.edittable = data.edittable;

      this.applyFilter();

      this.pageCount = Math.floor(this.filteredDisplayData.length / this.entryLimit) + 1;

      this.loaded = true;
    });
  }

  getColumnHeaders(obj: { [key: string]: any }): string[] {
    return obj ? Object.keys(obj) : [];
  }

  sortColumn(column: any) {
    this.filteredDisplayData = this.displayData;
    let dataName = this.edittable.columns.filter((_, index) => this.edittable.names[index] == column)[0];
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

    if (table != '') {
      this.dataService.collectData("edit-form-data", table).subscribe((formData: any) => {
        
        var fakeRow = JSON.parse(JSON.stringify(row));

        switch (table) {
          case "allergen_information":
          case "nutrition_info":

            switch (this.tableName) {
              case "retail_items":
                fakeRow['retail_item_id'] = id;
                this.dataService.collectDataComplex("append-or-add", { table: table, id: id, column: 'retail_item_id' }).subscribe((data: any) => {
                  if (data.id) {
                    fakeRow = data;
                    this.formService.processEditFormData(id, fakeRow, formData);
                    this.prepareEditFormService(id, table);
                  } else {
                    let values: (string | null)[] = Array(formData.columns.length).fill(null);
                    const retailItemIdIndex = formData.names.indexOf('Retail Item ID');
                    values[retailItemIdIndex] = id;
                    formData.values = values;
                    this.formService.processAddFormData(formData);
                    this.prepareAddFormService(table);
                  }
                });
                break;

              case "items":
                this.dataService.collectData("reverse-item-id", id).subscribe((reversedId: any) => {
                  fakeRow['retail_item_id'] = reversedId;
                  this.dataService.collectDataComplex("append-or-add", { table: table, id: reversedId, column: 'retail_item_id' }).subscribe((data: any) => {
                    if (data.id) {
                      fakeRow = data;
                      this.formService.processEditFormData(reversedId, fakeRow, formData);
                      this.prepareEditFormService(reversedId, table);
                    } else {
                      let values: (string | null)[] = Array(formData.columns.length).fill(null);
                      const retailItemIdIndex = formData.names.indexOf('Retail Item ID');
                      values[retailItemIdIndex] = reversedId;
                      formData.values = values;
                      this.formService.processAddFormData(formData);
                      this.prepareAddFormService(table);
                    }
                  });
                });
                break;
            }
            break;

          default:
            this.formService.processEditFormData(id, fakeRow, formData);
            this.prepareEditFormService(id, table);
            break;
        }
      });
    } else {
      if (this.tableName == 'invoices') {
        if (row['status'] == 'Complete') {
          this.formService.setMessageFormData({title: 'Warning!', message: 'This invoice is locked! Changing the data could have undesired effects. To continue, click the padlock on the invoice you want to edit!'});
          this.formService.showMessageForm();
        } else {
          this.formService.processEditFormData(id, row, this.edittable)
          this.prepareEditFormService(id, table);
        }
      } else {
        this.formService.processEditFormData(id, row, this.edittable)
        this.prepareEditFormService(id, table);
      }
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
      columns: this.edittable.columns,
      types: this.edittable.types,
      names: this.edittable.names,
      required: this.edittable.required,
      fields: this.edittable.fields,
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
    if (this.tableFilter == null) {
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
    await this.dataService.submitFormData(data).subscribe();
  }

  selectRow(event: Event, rowId: number) {
    const option = event.target as HTMLInputElement;
    let checked = option.checked;
    if (checked) {
      this.selectedRows.push(rowId);
    } else {
      this.selectedRows = this.selectedRows.filter(function (item) { return item !== rowId; })
    }

    if (this.selectedRows.length == 0) {
      this.widgetVisible = false;
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

  invoiceSearch() {
    if (this.selectedRows.length > 1) {
      this.formService.setMessageFormData({title: "Whoops!", message: "Please only select 1 invoice before trying to search!"})
    } else if (this.selectedRows.length == 1) {
      var row = this.data.filter((row: any) => row.id == this.selectedRows[0])[0];
      if (row['status'] == 'Complete') {
        this.formService.setMessageFormData({title: 'Warning!', message: 'This invoice is locked! Changing the data could have undesired effects. To continue, click the padlock on the invoice you want to edit!'});
        this.formService.showMessageForm();
      } else {
        this.dataService.collectData("invoiced-items", this.selectedRows[0].toString()).subscribe((invoiced_items: any) => {
          var invoicedItems = Array.isArray(invoiced_items) ? invoiced_items : [invoiced_items];
          this.dataService.storeWidgetData(invoicedItems);
          this.formService.showInvoicedItemForm();
          this.widgetVisible = true;
        });
      }
    } else {
        this.formService.setMessageFormData({title: "Error", message: "Please select an invoice before searching for items!"});
        this.formService.showMessageForm();
    }
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
        if (column == "title") {
          this.icon = row['status'] == "Complete" ? faLock : faLockOpen;
          return true;
        }
        break;
    }
    return false;
  }

  iconClick(event: Event, key: number, column: string, row: any) {
    switch (this.tableName) {
      case "invoices":
        if (column == 'title') {
          let data = { ...this.data[key] };
          data['status'] = data['status'] == 'Complete' ? 'Pending' : 'Complete';
          row['status'] = data['status'];
          data['action'] = 'append';
          data['table_name'] = String(this.tableName);
          this.dataService.submitFormData(data).subscribe((response: any) => {
            if (response.success) {
              this.reloadTable();
            } else {
              this.formService.setMessageFormData({ title: "Error!", message: "There was an error trying to unlock the booking!" });
              this.formService.showMessageForm();
            }
          });
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
    this.displayData.forEach(data => {
      if (Object.values(data).some(property => String(property).toUpperCase().includes(String(this.tableFilter).toUpperCase()))) {
        temporaryData.push(data);
      }
    });
    return temporaryData;
  }

  showAdvancedFilter() {
    var columns = Object.keys(this.data[0]);
    this.filterService.setTableColumns(this.displayNames, columns, this.dataTypes);
    this.formService.showFilterForm();
  }

  reloadTable() {
    this.loadTable(String(this.tableName));    
    this.changePage(1);
  }

calculateDistance() {
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

  this.dataService.collectDataComplex("calculate-distance", { customer_id: row['customer_id'], warehouse_id: row['warehouse_id'] })
    .subscribe((coordinates: any) => {
      this.handleCoordinatesResponse(coordinates);
      this.distanceLoading = false;
    });
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
