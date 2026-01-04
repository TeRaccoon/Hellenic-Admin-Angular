import { Component, effect, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { EXTRA_COLUMN_TABLES } from '../../common/constants';
import { TABLE_ICONS } from '../../common/icons/table-icons';
import { TableName, TableNameEnum, TableTypeMap } from '../../common/types/tables';
import { ExtraColumns, ReloadType, ViewMetadata } from '../../common/types/view/types';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { FilterService } from '../../services/filter.service';
import { TableOptionsService } from '../../services/table-options.service';
import { TableService } from '../../services/table.service';
import { UrlService } from '../../services/url.service';
import { FormService } from '../form/service';
import { DEFAULT_RELOAD_EVENT, DEFAULT_SORTED_COLUMN, DEFAULT_TABLE_DATA } from './consts';
import { ViewService } from './service';
import { TableDataService } from './table-data';
import { ItemImage, ReloadEvent, SortedColumn, StockTotals, TableData } from './types';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit, OnDestroy {
  private readonly subscriptions = new Subscription();

  ICONS = TABLE_ICONS;

  TableNames = TableNameEnum;
  ExtraColumns = ExtraColumns;

  get imageUrlBase() {
    return this.urlService.getUrl('uploads');
  }

  tableName: TableName = TableNameEnum.Invoices;
  tableData: TableData = DEFAULT_TABLE_DATA;

  stockData: Record<string, string> = {};

  selectedRows: number[] = [];

  images: Record<string, string> = {};

  editLoading = { id: '', loading: false };

  filter = '';

  get viewMetadata() {
    return this.viewService.ViewMetadata;
  }

  get tabs() {
    return this.dataService.Tabs;
  }

  sortedColumn: SortedColumn = DEFAULT_SORTED_COLUMN;

  get filteredDisplayData() {
    return this.viewService.filteredDisplayData;
  }

  get displayName() {
    return this.tableDataService.displayName;
  }

  get accessible() {
    return this.authService.returnAccess();
  }

  constructor(
    private tableDataService: TableDataService,
    private tableService: TableService,
    private authService: AuthService,
    private filterService: FilterService,
    private formService: FormService,
    private route: ActivatedRoute,
    private dataService: DataService,
    private urlService: UrlService,
    private optionsService: TableOptionsService,
    private viewService: ViewService
  ) {
    effect(() => {
      const loading = this.formService.getEditFormLoading();
      this.editLoading = { id: loading.id.toString(), loading: loading.signal() };
    });
  }

  private reloadEffect = effect(
    () => {
      const reloadRequested = this.formService.getReloadRequestSignal()();
      if (!reloadRequested) return;

      const reloadType = this.formService.getReloadType();

      if (reloadType == ReloadType.Hard) {
        this.selectedRows = [];
        this.resetSortedColumn();
        this.loadTable(this.tableName);
      } else if (reloadType == ReloadType.Filter) {
        this.applyFilter();
      }

      this.formService.performReload();
    },
    {
      allowSignalWrites: true,
    }
  );

  ngOnInit() {
    this.subscriptionHandler();
  }

  async subscriptionHandler() {
    this.subscriptions.add(
      this.route.queryParams.subscribe((params) => {
        this.tableName = params['table'] || null;
        if (this.tableName != null) {
          this.resetTable();
          this.tableDataService.displayName = this.tableService.getTableDisplayName(this.tableName) ?? '';
          this.formService.setSelectedTable(String(this.tableName));
          this.loadTable(this.tableName);
          this.loadPage();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.reloadEffect.destroy();
  }

  async loadItemsTable() {
    const totalStockData: StockTotals[] = await this.dataService.processGet('total-stock', undefined, true);

    totalStockData.forEach((stock) => {
      this.stockData[stock.item_id] = stock.total_quantity;
    });
  }

  async loadStockedItemsTable() {
    const images: ItemImage[] = await this.dataService.processGet('stocked-item-images', undefined, true);

    if (images != null) {
      images.forEach((imageData) => {
        this.images[imageData.item_id] = imageData.file_name;
      });
    }
  }

  async switchTable() {
    switch (this.tableName) {
      case TableNameEnum.Items:
        await this.loadItemsTable();
        break;

      case TableNameEnum.StockedItems:
        await this.loadStockedItemsTable();
        break;
    }
  }

  async loadTable(table: string, isToggle = false) {
    if (!isToggle) {
      this.viewService.ViewMetadata.loaded = false;
    }

    await this.tableDataService.initialize(table as TableName);
    await this.switchTable();

    this.tableData = this.tableDataService.data;

    if (this.tableData != null) {
      this.viewService.filteredDisplayData = this.tableData!.display_data;

      this.tableData.types = this.viewService.mapDataTypes(this.tableData.types);

      this.applyFilter();

      this.viewService.calculatePageCount(false, this.viewService.ViewMetadata.entryLimit);

      this.changePage(this.viewService.ViewMetadata.currentPage);

      if (!isToggle) {
        this.viewService.ViewMetadata.loaded = true;
      } else {
        this.viewService.setToggleLoading(false);
      }
    }
  }

  getColumnHeaders<T extends TableName>(obj: TableTypeMap[T]): (keyof TableTypeMap[T])[] {
    return obj ? (Object.keys(obj) as (keyof TableTypeMap[T])[]) : [];
  }

  getCustomColumnHeadersFromTable() {
    return this.viewService.getCustomColumnHeadersFromTable(this.tableName);
  }

  sortColumn(column: string) {
    this.viewService.filteredDisplayData = this.tableData!.display_data;
    const dataName: string =
      this.tableData!.editable.columns.filter((_, index) => this.tableData!.editable.names[index] === column)[0] ??
      'id';

    this.filterService.sortColumn(dataName, this.sortedColumn, column);

    this.changePage(1);
  }

  resetSortedColumn() {
    this.sortedColumn = DEFAULT_SORTED_COLUMN;
  }

  changePage(page: number) {
    this.viewService.ViewMetadata.currentPage = page;
    this.loadPage();
  }

  getRow(id: number) {
    return this.tableData!.data.filter((row) => row.id == id)[0];
  }

  duplicate() {
    const row = this.getRow(this.selectedRows[0]);

    this.formService.processAddFormData(this.tableData!.editable, row);
    this.optionsService.prepareAddFormService(this.tableName);
  }

  addRow(values: TableTypeMap[TableName][] | null) {
    this.optionsService.addRow(this.tableData!.editable, values, this.tableName);
  }

  async editRow(id: number, table: string) {
    const row = this.tableData!.data.filter((row) => row.id == id)[0];

    this.viewService.editRow(row, id.toString(), table, this.tableName, this.tableData!.editable);
  }

  deleteRow(id: number) {
    const row = this.tableData!.data.filter((row) => row.id == id)[0];

    if (this.optionsService.canDelete(row, this.tableName)) {
      this.optionsService.performDelete([id], this.tableName);
    }
  }

  itemContainsFilter(item: TableTypeMap[TableName]) {
    return (
      this.filter != null && item != null && Object.values(item).some((value) => String(value).includes(this.filter))
    );
  }

  pageEvent(viewMetaData: ViewMetadata) {
    this.viewService.ViewMetadata = viewMetaData;
    this.loadPage();
  }

  loadPage() {
    const start = (this.viewService.ViewMetadata.currentPage - 1) * this.viewService.ViewMetadata.entryLimit;
    const end = start + this.viewService.ViewMetadata.entryLimit;

    if (this.filterService.getFilterData().searchFilter === '') {
      this.viewService.calculatePageCount(true, this.viewService.ViewMetadata.entryLimit);
      this.viewService.filteredDisplayData = this.tableData!.display_data.slice(start, end);
    } else {
      this.filterService.applyTemporaryFilter();
      this.viewService.calculatePageCount(false, this.viewService.ViewMetadata.entryLimit);
      this.viewService.filteredDisplayData = this.viewService.filteredDisplayData.slice(start, end);
    }
  }

  resetTable() {
    this.clearFilter('all', true);
    this.filterService.clearTableFilter();
    this.viewService.ViewMetadata.pageCount = 0;
    this.viewService.ViewMetadata.currentPage = 1;
    this.selectedRows = [];
    this.sortedColumn.columnName = '';
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

  getPageRange() {
    return this.viewService.getPageRange(
      this.viewService.ViewMetadata.currentPage,
      this.viewService.ViewMetadata.pageCount
    );
  }

  //Filter

  applyFilter() {
    this.filterService.applyFilter(this.tableData.display_data);

    this.viewService.calculatePageCount(false, this.viewService.ViewMetadata.entryLimit);
  }

  clearFilterEmitter(event: { filter: string; reload: boolean }) {
    this.clearFilter(event.filter, event.reload);
  }

  clearFilter(filter: string, reload: boolean) {
    this.filterService.clearFilter(filter);

    if (filter === 'all' || filter === 'table') {
      this.changePage(1);
    }

    if (reload) {
      this.reloadTable();
    }
  }

  async reloadTable(event: ReloadEvent = DEFAULT_RELOAD_EVENT) {
    this.loadPage();
    if (event.loadTable) {
      await this.loadTable(String(this.tableName), event.isToggle);
    }
  }

  needsExtraColumn(table: string) {
    return EXTRA_COLUMN_TABLES.includes(table);
  }

  isEditLoading(id: number) {
    return this.editLoading.id === id.toString() && this.editLoading.loading;
  }
}
