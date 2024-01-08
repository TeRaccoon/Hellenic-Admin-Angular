import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { InvoiceBreakdownWidgetComponent } from './components/invoice-breakdown-widget/invoice-breakdown-widget.component';

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
    InvoiceBreakdownWidgetComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
