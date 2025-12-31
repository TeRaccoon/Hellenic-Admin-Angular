import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { NgChartsModule } from 'ng2-charts';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { QuillModule } from 'ngx-quill';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BalanceSheetComponent } from './components/balance-sheet/balance-sheet.component';
import { InvoiceSummaryComponent } from './components/balance-sheet/children/invoice-summary/invoice-summary.component';
import { TransactionComponent } from './components/balance-sheet/children/transaction/transaction.component';
import { ChangePasswordFormComponent } from './components/change-password-form/change-password-form.component';
import { DebtorCreditorWidgetComponent } from './components/debtor-creditor-widget/debtor-creditor-widget.component';
import { DeleteFormComponent } from './components/delete-form/delete-form.component';
import { DocumentUploadWidgetComponent } from './components/document-upload-widget/document-upload-widget.component';
import { FilterFormComponent } from './components/filter-form/filter-form.component';
import { AddFormComponent } from './components/form/add-form/add-form.component';
import { DocumentsToReconcileComponent } from './components/form/children/documents-to-reconcile/documents-to-reconcile.component';
import { DropselectComponent } from './components/form/children/dropselect/dropselect.component';
import { FileUploadComponent } from './components/form/children/file-upload/file-upload.component';
import { FormFooterComponent } from './components/form/children/form-footer/form-footer.component';
import { FormItemsTableComponent } from './components/form/children/form-items-table/form-items-table.component';
import { InvoiceAddressComponent } from './components/form/children/invoice-address/invoice-address.component';
import { EditFormComponent } from './components/form/edit-form/edit-form.component';
import { GenericSearcherComponent } from './components/generic-searcher/generic-searcher.component';
import { HomeComponent } from './components/home/home.component';
import { InvoiceViewComponent } from './components/invoice-view/invoice-view.component';
import { LedgerWidgetComponent } from './components/ledger-widget/ledger-widget.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { LoginComponent } from './components/login/login.component';
import { MessageFormComponent } from './components/message-form/message-form.component';
import { NotificationTabComponent } from './components/navbar/children/notification-tab/notification-tab.component';
import { SearchDropdownComponent } from './components/navbar/children/search-dropdown/search-dropdown.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NewsletterWidgetComponent } from './components/newsletter-widget/newsletter-widget.component';
import { PrintLayoutComponent } from './components/print-layout/print-layout.component';
import { ProfitLossWidgetComponent } from './components/profit-loss-widget/profit-loss-widget.component';
import { SearchContainerComponent } from './components/search-container/search-container.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { SupplierInvoiceItemFormControlsComponent } from './components/supplier-invoice-item-form-controls/supplier-invoice-item-form-controls.component';
import { TableCellComponent } from './components/table-cell/table-cell.component';
import { TableWidgetComponent } from './components/table-widget/table-widget.component';
import { TablelessViewComponent } from './components/tableless-view/tableless-view.component';
import { VatViewComponent } from './components/vat-view/vat-view.component';
import { EntrySelectorComponent } from './components/view/children/entry-selector/entry-selector.component';
import { ExtraColumnComponent } from './components/view/children/extra-column/extra-column.component';
import { NoTableDataComponent } from './components/view/children/no-table-data/no-table-data.component';
import { TableButtonsComponent } from './components/view/children/table-buttons/table-buttons.component';
import { TableDataComponent } from './components/view/children/table-data/table-data.component';
import { TableFilterComponent } from './components/view/children/table-filter/table-filter.component';
import { TableFooterComponent } from './components/view/children/table-footer/table-footer.component';
import { TableTabsComponent } from './components/view/children/table-tabs/table-tabs.component';
import { ViewComponent } from './components/view/view.component';
import { WidgetComponent } from './components/widget/widget.component';
import { ConfigService } from './services/config.service';

export function initConfig(configService: ConfigService) {
  return () => configService.loadConfig();
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    SidebarComponent,
    ViewComponent,
    AddFormComponent,
    EditFormComponent,
    LedgerWidgetComponent,
    DebtorCreditorWidgetComponent,
    TablelessViewComponent,
    LoginComponent,
    ProfitLossWidgetComponent,
    StatisticsComponent,
    PrintLayoutComponent,
    InvoiceViewComponent,
    DeleteFormComponent,
    MessageFormComponent,
    FilterFormComponent,
    ChangePasswordFormComponent,
    SettingsComponent,
    WidgetComponent,
    TableWidgetComponent,
    VatViewComponent,
    BalanceSheetComponent,
    TransactionComponent,
    InvoiceSummaryComponent,
    SearchContainerComponent,
    NoTableDataComponent,
    TableFooterComponent,
    InvoiceAddressComponent,
    NewsletterWidgetComponent,
    DocumentUploadWidgetComponent,
    DropselectComponent,
    DocumentsToReconcileComponent,
    FormFooterComponent,
    FormItemsTableComponent,
    SupplierInvoiceItemFormControlsComponent,
    TableButtonsComponent,
    TableCellComponent,
    TableFilterComponent,
    TableDataComponent,
    FileUploadComponent,
    ExtraColumnComponent,
    SearchDropdownComponent,
    NotificationTabComponent,
    LoadingSpinnerComponent,
    GenericSearcherComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule,
    NgChartsModule,
    NgxDaterangepickerMd.forRoot(),
    QuillModule.forRoot(),
    RecaptchaV3Module,
    TableTabsComponent,
    EntrySelectorComponent,
  ],
  providers: [
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [ConfigService],
      multi: true,
    },
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useFactory: (configService: ConfigService) => configService.reCAPTCHASiteKey,
      deps: [ConfigService],
    },
    CurrencyPipe,
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
