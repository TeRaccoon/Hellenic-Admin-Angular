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

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'view', component: ViewComponent, canActivate: [AuthGuard] },
  { path: 'page', component: TablelessViewComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'statistics', component: StatisticsComponent, canActivate: [AuthGuard] },
  { path: 'print',
    component: PrintLayoutComponent,
    children: [
      { path: 'invoice', component: InvoiceViewComponent, canActivate: [AuthGuard] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
