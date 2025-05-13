import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { EXCLUDED_TABLES } from '../../../../common/consts/table-options';
import { TABLE_ICONS } from '../../../../common/icons/table-icons';
import { BalanceSheetData, BalanceSheetTable } from '../../../../common/types/data-service/types';
import { DataService } from '../../../../services/data.service';
import { TableOptionsService } from '../../../../services/table-options.service';
import { FormService } from '../../../form/service';
import { EditableData, FormType } from '../../../form/types';

@Component({
  selector: 'app-table-buttons',
  templateUrl: './table-buttons.component.html',
  styleUrl: './table-buttons.component.scss',
})
export class TableButtonsComponent {
  @Input() data!: Record<string, any>[];
  @Input() editable!: EditableData;
  @Input() selectedRows!: any[];
  @Input() tableName!: string;

  icons = TABLE_ICONS;
  distanceLoading = false;

  buttonConfigs = [
    {
      condition: () => this.selectedRows.length > 0 && this.tableName === 'invoices',
      icon: this.icons.faPrint,
      action: () => this.print(),
    },
    {
      condition: () => this.canShowMultipleDelete(),
      icon: this.icons.faTrashCan,
      action: () => this.deleteRows(),
    },
    {
      condition: () => this.selectedRows.length === 1,
      icon: this.icons.faCopy,
      action: () => this.duplicate(),
    },
    {
      condition: () => this.tableName === 'suppliers',
      icon: this.icons.faFileInvoice,
      action: () => this.createCreditNote(),
    },
    {
      condition: () =>
        (this.tableName === 'customers' || this.tableName === 'suppliers') && this.selectedRows.length === 1,
      label: 'Balance Sheet',
      action: () => this.viewBalanceSheet(),
    },
    {
      condition: () => this.selectedRows.length === 1 && this.tableName === 'invoices',
      icon: () => (this.distanceLoading ? this.icons.faSpinner : this.icons.faTruckFront),
      action: () => this.calculateDistance(),
      spin: () => this.distanceLoading,
    },
  ];

  constructor(
    private formService: FormService,
    private router: Router,
    private dataService: DataService,
    private optionsService: TableOptionsService
  ) {}

  getCurrentRow() {
    return this.data.filter((row: any) => row.id == this.selectedRows[0])[0];
  }

  getIcon(button: any): IconProp {
    return typeof button.icon === 'function' ? button.icon() : button.icon;
  }

  print() {
    const row = this.getCurrentRow();

    const canPrint = this.optionsService.canPrint(this.selectedRows, row);
    if (canPrint) {
      this.dataService.storePrintInvoiceIds(this.selectedRows);
      this.router.navigate(['/print/invoice']);
    }
  }

  canShowMultipleDelete() {
    return !EXCLUDED_TABLES.includes(this.tableName) && this.selectedRows.length > 1;
  }

  deleteRows() {
    if (this.selectedRows.every((id) => this.optionsService.canDelete(id, this.tableName))) {
      this.performDelete(this.selectedRows);
    }
  }

  performDelete(ids: number[]) {
    this.optionsService.performDelete(ids, this.tableName);
  }

  showWarningMessage(message: string) {
    this.formService.setMessageFormData({ title: 'Warning!', message });
  }

  showErrorMessage(message: string) {
    this.formService.setMessageFormData({ title: 'Error!', message });
  }

  duplicate() {
    const row = this.getCurrentRow();

    this.formService.processAddFormData(this.editable, row);
    this.prepareAddFormService(this.tableName);
  }

  addRow(values: any) {
    this.optionsService.addRow(this.editable, values, this.tableName);
  }

  prepareAddFormService(table: string) {
    this.formService.setSelectedTable(table);
    this.formService.setFormVisibility(FormType.Add, true);
    this.formService.setReloadType('hard');
    this.optionsService.prepareAddFormService(table);
  }

  async createCreditNote() {
    const tableName = 'credit_notes';

    const editFormData = await this.dataService.processGet('edit-form-data', {
      filter: tableName,
    });
    this.formService.processAddFormData(editFormData);
    this.optionsService.prepareAddFormService(tableName);
  }

  async creditNoteSearch(id: string) {
    await this.optionsService.creditNoteSearch(this.tableName, this.data, id);
  }

  viewBalanceSheet() {
    const row = this.getCurrentRow();
    const accountNumberKey = this.optionsService.getAccountNumberKey(this.tableName);

    const balanceSheetTitle = `Balance Sheet for ${row['account_name']} - ${row[accountNumberKey]}`;

    const balanceSheetData: BalanceSheetData = {
      title: balanceSheetTitle,
      customerId: this.selectedRows[0],
      table: this.tableName as BalanceSheetTable,
      email: row['email'],
    };

    this.dataService.storeBalanceSheetData(balanceSheetData);

    this.router.navigate(['/print/balance-sheet']);
  }

  async calculateDistance() {
    const row = this.getCurrentRow();

    this.distanceLoading = true;
    await this.optionsService.calculateDistance(this.selectedRows, row).then(() => (this.distanceLoading = false));
  }
}
