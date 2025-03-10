import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/authguard.service';

import { HomeComponent } from './components/home/home.component';
import { ViewComponent } from './components/view/view.component';
import { TablelessViewComponent } from './components/tableless-view/tableless-view.component';
import { LoginComponent } from './components/login/login.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { PrintLayoutComponent } from './components/print-layout/print-layout.component';
import { InvoiceViewComponent } from './components/invoice-view/invoice-view.component';
import { SettingsComponent } from './components/settings/settings.component';
import { VatViewComponent } from './components/vat-view/vat-view.component';
import { BalanceSheetComponent } from './components/balance-sheet/balance-sheet.component';
import { ProfitLossWidgetComponent } from './components/profit-loss-widget/profit-loss-widget.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'view', component: ViewComponent, canActivate: [AuthGuard] },
  { path: 'page', component: TablelessViewComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  {
    path: 'statistics',
    component: StatisticsComponent,
    canActivate: [AuthGuard],
  },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  {
    path: 'print',
    component: PrintLayoutComponent,
    children: [
      {
        path: 'invoice',
        component: InvoiceViewComponent,
        canActivate: [AuthGuard],
      },
      { path: 'vat', component: VatViewComponent, canActivate: [AuthGuard] },
      {
        path: 'balance-sheet',
        component: BalanceSheetComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'profit-loss',
        component: ProfitLossWidgetComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
