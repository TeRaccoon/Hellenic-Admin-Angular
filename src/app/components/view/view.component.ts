import { Component, effect, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EXTRA_COLUMN_TABLES } from '../../common/constants';
import { TABLE_ICONS } from '../../common/icons/table-icons';
import { TableName, TableNameEnum, TableTypeMap } from '../../common/types/tables';
import { columnDateFilter, columnFilter, FilterData, viewMetadata } from '../../common/types/view/types';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { FilterService } from '../../services/filter.service';
import { TableOptionsService } from '../../services/table-options.service';
import { TableService } from '../../services/table.service';
import { UrlService } from '../../services/url.service';
import { FormService } from '../form/service';
import { EditableData, FormType } from '../form/types';
import { ViewService } from './service';
import { ItemImage, StockTotals } from './types';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit, OnDestroy {
  private readonly subscriptions = new Subscription();

  icons = TABLE_ICONS;

  accessible = false;

  apiUrlBase;
  imageUrlBase;

  tableName: TableName;
  displayName = '';
  displayColumnFilters: string[] = [];

  columnFilters: columnFilter[] = [];
  columnDateFilters: columnDateFilter[] = [];

  data: TableTypeMap[TableName][] = [];
  displayNames: Record<string, any>[] = [];
  dataTypes: any[] = [];
  editable: EditableData;
  stockData: Record<string, string> = {};

  selectedRows: number[] = [];

  images: Record<string, string> = {};

  distanceLoading = false;
  editLoading = { id: '', loading: false };

  filter = '';

  viewMetaData: viewMetadata;

  tabs: { displayName: string; tableName: string }[] = [];

  sortedColumn: any = { columnName: '', ascending: false };

  get filteredDisplayData() {
    return this.viewService.filteredDisplayData;
  }

  constructor(
    private tableService: TableService,
    private authService: AuthService,
    private router: Router,
    private filterService: FilterService,
    private formService: FormService,
    private route: ActivatedRoute,
    private dataService: DataService,
    private urlService: UrlService,
    private optionsService: TableOptionsService,
    private viewService: ViewService
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

    this.tableName = (this.route.snapshot.queryParamMap.get('table') as TableName) ?? TableNameEnum.Invoices;

    effect(() => {
      const loading = this.formService.getEditFormLoading();
      this.editLoading = { id: loading.id.toString(), loading: loading.signal() };
      console.log(this.editLoading);
    });
  }

  private reloadEffect = effect(() => {
    const reloadRequested = this.formService.getReloadRequestSignal()();
    if (!reloadRequested) return;

    const reloadType = this.formService.getReloadType();

    if (reloadType == 'hard') {
      this.selectedRows = [];
      this.sortedColumn = { columnName: '', ascending: false };
      this.loadTable(this.tableName);
    } else if (reloadType == 'filter') {
      this.applyFilter();
    }

    this.formService.performReload();
  });

  ngOnInit() {
    this.subscriptionHandler();
  }

  async subscriptionHandler() {
    this.subscriptions.add(
      this.route.queryParams.subscribe((params) => {
        this.tableName = params['table'] || null;
        if (this.tableName != null) {
          this.resetTable();
          this.displayName = this.tableService.getTableDisplayName(this.tableName) ?? '';
          this.formService.setSelectedTable(String(this.tableName));
          this.loadTable(this.tableName);
          this.loadPage();
          this.tabs = this.dataService.getTabs();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.reloadEffect.destroy();
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
      const totalStockData: StockTotals[] = await this.dataService.processGet('total-stock', undefined, true);

      totalStockData.forEach((stock) => {
        this.stockData[stock.item_id] = stock.total_quantity;
      });
    }

    if (this.tableName == 'stocked_items') {
      const images: ItemImage[] = await this.dataService.processGet('stocked-item-images', undefined, true);

      if (images != null) {
        images.forEach((imageData) => {
          this.images[imageData.item_id] = imageData.file_name;
        });
      }
    }

    const tableData = await this.dataService.processGet('table', {
      filter: table,
    });

    if (tableData != null) {
      this.data = Array.isArray(tableData.data) ? tableData.data : ([tableData.data] as TableTypeMap[]);

      this.viewService.displayData = Array.isArray(tableData.display_data)
        ? tableData.display_data
        : [tableData.display_data];
      this.viewService.filteredDisplayData = this.viewService.displayData;

      this.dataTypes = this.viewService.mapDataTypes(tableData.types);
      this.displayNames = tableData.display_names;
      this.editable = tableData.editable;

      this.applyFilter();

      this.viewMetaData.pageCount = this.viewService.calculatePageCount(false, this.viewMetaData.entryLimit);

      this.changePage(this.viewMetaData.currentPage);

      this.viewMetaData.loaded = true;
    }
  }

  getColumnHeaders<T extends TableName>(obj: TableTypeMap[T]): (keyof TableTypeMap[T])[] {
    return obj ? (Object.keys(obj) as (keyof TableTypeMap[T])[]) : [];
  }

  getCustomColumnHeadersFromTable() {
    return this.viewService.getCustomColumnHeadersFromTable(this.tableName);
  }

  sortColumn(column: any) {
    this.viewService.filteredDisplayData = this.viewService.displayData;
    const dataName: string =
      this.editable.columns.filter((_, index) => this.editable.names[index] === column)[0] ?? 'id';

    if (this.sortedColumn.columnName == column) {
      this.sortedColumn.ascending = !this.sortedColumn.ascending;
    } else {
      this.sortedColumn = { columnName: column, ascending: false };
    }

    if (this.sortedColumn.ascending) {
      this.viewService.filteredDisplayData = this.viewService.sortAscending(
        dataName,
        this.viewService.filteredDisplayData
      );
    } else {
      this.viewService.filteredDisplayData = this.viewService.sortDescending(
        dataName,
        this.viewService.filteredDisplayData
      );
    }

    this.changePage(1);
  }

  changePage(page: number) {
    this.viewMetaData.currentPage = page;
    this.loadPage();
  }

  getRow(id: number) {
    return this.data.filter((row: any) => row.id == id)[0];
  }

  duplicate() {
    const row = this.getRow(this.selectedRows[0]);

    this.formService.processAddFormData(this.editable, row);
    this.optionsService.prepareAddFormService(this.tableName);
  }

  addRow(values: any) {
    this.optionsService.addRow(this.editable, values, this.tableName);
  }

  async editRow(id: any, table: string) {
    const row = this.data.filter((row: any) => row.id == id)[0];

    this.viewService.editRow(row, id, table, this.tableName, this.editable);
  }

  deleteRow(id: number) {
    const row = this.data.filter((row: any) => row.id == id)[0];

    if (this.optionsService.canDelete(row, this.tableName)) {
      this.optionsService.performDelete([id], this.tableName);
    }
  }

  changeEntries(event: Event) {
    const option = event.target as HTMLInputElement;
    this.viewMetaData.entryLimit = Number(option.value);
    this.viewMetaData.currentPage = 1;
    this.loadPage();
  }

  itemContainsFilter(item: any) {
    return (
      this.filter != null && item != null && Object.values(item).some((value) => String(value).includes(this.filter))
    );
  }

  pageEvent(viewMetaData: viewMetadata) {
    this.viewMetaData = viewMetaData;
    this.loadPage();
  }

  loadPage() {
    const start = (this.viewMetaData.currentPage - 1) * this.viewMetaData.entryLimit;
    const end = start + this.viewMetaData.entryLimit;
    if (this.filterService.getFilterData().searchFilter === '') {
      this.viewMetaData.pageCount = this.viewService.calculatePageCount(true, this.viewMetaData.entryLimit);
      this.viewService.filteredDisplayData = this.viewService.displayData.slice(start, end);
    } else {
      this.viewService.filteredDisplayData = this.applyTemporaryFilter();
      this.viewMetaData.pageCount = this.viewService.calculatePageCount(false, this.viewMetaData.entryLimit);
      this.viewService.filteredDisplayData = this.viewService.filteredDisplayData.slice(start, end);
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
    let start = this.viewMetaData.currentPage;

    if (this.viewMetaData.currentPage > this.viewMetaData.pageCount - 2 && this.viewMetaData.pageCount - 2 > 0) {
      start = this.viewMetaData.pageCount - 2;
    }
    if (start == 1 && this.viewMetaData.pageCount > 1) {
      start += 2;
    } else if (start == 2 && this.viewMetaData.pageCount > 1) {
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

  selectRow(event: Event, rowId: number) {
    const option = event.target as HTMLInputElement;
    const checked = option.checked;
    if (checked) {
      this.selectedRows.push(rowId);
    } else {
      this.selectedRows = this.selectedRows.filter(function (item) {
        return item !== rowId;
      });
    }
  }

  canDisplayColumn(column: string) {
    return this.viewService.canDisplayColumn(column, this.tableName);
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

    this.viewMetaData.pageCount = this.viewService.calculatePageCount(false, this.viewMetaData.entryLimit);
  }

  filterColumns(columnFilter: any) {
    const isCaseSensitive = columnFilter.caseSensitive;
    const column = columnFilter.column;

    const filter = isCaseSensitive ? columnFilter.filter : String(columnFilter.filter).toLowerCase();
    this.displayColumnFilters.push(
      this.displayNames[Object.keys(this.data[0]).indexOf(column)] + ': ' + columnFilter.filter
    );

    this.viewService.displayData = this.viewService.filteredDisplayData.filter((data) => {
      if (
        filter != null &&
        data[column] != null &&
        String(isCaseSensitive ? data[column] : String(data[column]).toLowerCase()).includes(filter)
      ) {
        return data;
      }
      return [];
    });
    this.viewService.filteredDisplayData = this.viewService.displayData;
    this.viewMetaData.pageCount = this.viewService.calculatePageCount(false, this.viewMetaData.entryLimit);
  }

  filterDateColumns(columnDateFilter: { column: any; startDate: Date; endDate: Date }) {
    const column = columnDateFilter.column;

    this.viewService.displayData = this.viewService.displayData.filter((data) => {
      if (columnDateFilter != null && data[column] != null) {
        const dataDate = new Date(data[column]);
        const startDate = new Date(columnDateFilter.startDate);
        const endDate = new Date(columnDateFilter.endDate);

        return dataDate >= startDate && dataDate <= endDate;
      }
      return false;
    });
    this.viewService.filteredDisplayData = this.viewService.displayData;
  }

  clearFilterEmitter(event: { filter: string; reload: boolean }) {
    this.clearFilter(event.filter, event.reload);
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
    this.filterService.setFilterData({
      searchFilter: this.filterService.getFilterData().searchFilter,
      searchFilterApplied: true,
    });
    this.loadPage();
  }

  applyTemporaryFilter() {
    const temporaryData: Record<string, unknown>[] = [];
    if (this.filterService.getFilterData().searchFilter != '') {
      this.viewService.displayData.forEach((data) => {
        if (
          Object.values(data).some((property) =>
            String(property)
              .toUpperCase()
              .includes(String(this.filterService.getFilterData().searchFilter).toUpperCase())
          )
        ) {
          temporaryData.push(data);
        }
      });
    }
    return temporaryData;
  }

  showAdvancedFilter() {
    const columns = Object.keys(this.data[0]);
    this.filterService.setTableColumns(this.displayNames, columns, this.dataTypes);
    this.formService.setFormVisibility(FormType.Filter, true);
  }

  async reloadTable(loadTable = false) {
    this.loadPage();
    if (loadTable) {
      await this.loadTable(String(this.tableName));
    }
  }

  needsExtraColumn(table: string) {
    return EXTRA_COLUMN_TABLES.includes(table);
  }

  isEditLoading(id: string) {
    return this.editLoading.id === id.toString() && this.editLoading.loading;
  }
}
