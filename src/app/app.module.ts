import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgChartsModule } from 'ng2-charts';
import _ from 'lodash';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { QuillModule } from 'ngx-quill';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ViewComponent } from './components/view/view.component';
import { AddFormComponent } from './components/add-form/add-form.component';
import { EditFormComponent } from './components/edit-form/edit-form.component';
import { LedgerWidgetComponent } from './components/ledger-widget/ledger-widget.component';
import { DebtorCreditorWidgetComponent } from './components/debtor-creditor-widget/debtor-creditor-widget.component';
import { TablelessViewComponent } from './components/tableless-view/tableless-view.component';
import { LoginComponent } from './components/login/login.component';
import { ProfitLossWidgetComponent } from './components/profit-loss-widget/profit-loss-widget.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { PrintLayoutComponent } from './components/print-layout/print-layout.component';
import { InvoiceViewComponent } from './components/invoice-view/invoice-view.component';
import { DeleteFormComponent } from './components/delete-form/delete-form.component';
import { MessageFormComponent } from './components/message-form/message-form.component';
import { FilterFormComponent } from './components/filter-form/filter-form.component';
import { ChangePasswordFormComponent } from './components/change-password-form/change-password-form.component';
import { SettingsComponent } from './components/settings/settings.component';
import { WidgetComponent } from './components/widget/widget.component';
import { TableWidgetComponent } from './components/table-widget/table-widget.component';
import { VatViewComponent } from './components/vat-view/vat-view.component';
import { BalanceSheetComponent } from './components/balance-sheet/balance-sheet.component';
import { SearchContainerComponent } from './components/search-container/search-container.component';
import { ConfigService } from './services/config.service';
import { NoTableDataComponent } from './components/no-table-data/no-table-data.component';
import { TableFooterComponent } from './components/table-footer/table-footer.component';
import { InvoiceAddressComponent } from './components/invoice-address/invoice-address.component';
import { NewsletterWidgetComponent } from './components/newsletter-widget/newsletter-widget.component';
import { DocumentUploadWidgetComponent } from './components/document-upload-widget/document-upload-widget.component';
import { DropselectComponent } from "./components/dropselect/dropselect.component";
import { DocumentsToReconcileComponent } from './components/documents-to-reconcile/documents-to-reconcile.component';
import { FormFooterComponent } from './components/form-footer/form-footer.component';
import { FormItemsTableComponent } from './components/form-items-table/form-items-table.component';
import { SupplierInvoiceItemFormControlsComponent } from './components/supplier-invoice-item-form-controls/supplier-invoice-item-form-controls.component';
import { TableViewOptionsComponent } from './components/table-view-options/table-view-options.component';

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
    TableViewOptionsComponent
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
      deps: [ConfigService]
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
