import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlService } from './url.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  private accessLevel = 'Low';
  private accessGranted = false;

  private url;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private urlService: UrlService
  ) {
    this.url = this.urlService.getUrl('data');

    this.checkLogin();
  }

  checkLogin() {
    return this.http
      .post(this.url, { action: 'check-login' }, { withCredentials: true })
      .pipe(
        map((response: any) => {
          if (response.data != null) {
            this.accessLevel = response.data;
          }
          return response;
        })
      );
  }

  getAccessLevel() {
    return this.accessLevel;
  }

  login(accessLevel = this.accessLevel) {
    this.isAuthenticated.next(true);
    this.accessLevel = accessLevel;
    if (accessLevel == 'Full') {
      this.accessGranted = true;
    }
  }

  async logout() {
    this.isAuthenticated.next(false);

    const logoutResponse = await lastValueFrom(
      this.http.post<{ success: boolean; message: string }>(
        this.url,
        { action: 'logout' },
        { withCredentials: true }
      )
    );
    if (logoutResponse.success) {
      return true;
    }

    return false;
  }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  accessGuard() {
    console.log('Access Guard Engaged');
    this.route.queryParams.subscribe(async (params) => {
      let tableAccess = this.queryAccessTable(params['table']);
      let urlAccess = this.queryAccessURL();
      this.accessGranted = tableAccess && urlAccess;
    });
  }

  queryAccessURL() {
    if (this.accessLevel != 'Driver') {
      return true;
    }

    switch (this.router.url) {
      case '/print/invoice':
        return true;

      case '/view?table=invoices':
        return true;
    }
    return false;
  }

  queryAccessTable(table: any, redirect = true) {
    if (this.accessLevel != 'Driver' || table == undefined) {
      return true;
    }

    switch (table) {
      case 'invoices':
        return true;

      default:
        redirect && this.router.navigate(['/home'], {});
        return false;
    }
  }

  returnAccess() {
    return this.accessGranted;
  }
}
