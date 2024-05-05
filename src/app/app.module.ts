import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgChartsModule } from 'ng2-charts';
import * as _ from 'lodash';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';

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
    VatViewComponent
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
    NgxDaterangepickerMd.forRoot()
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
