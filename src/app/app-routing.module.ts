import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/authguard.service';

import { HomeComponent } from './components/home/home.component';
import { ViewComponent } from './components/view/view.component';
import { TablelessViewComponent } from './components/tableless-view/tableless-view.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'view', component: ViewComponent, canActivate: [AuthGuard] },
  { path: 'page', component: TablelessViewComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
