import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, lastValueFrom, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { apiUrlBase } from './data.service';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private isAuthenticated = new BehaviorSubject<boolean>(false);
    private accessLevel = "low";
    private accessGranted = false;

    constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {}

    checkLogin() {
        const url = apiUrlBase + 'API/manage_data.php';
        
        return this.http.post(url, {action: "check-login"}, {withCredentials: true}).pipe(
            map((response: any) => {
                return response;
            })
        );
    }

    login(accessLevel = this.accessLevel) {
        this.isAuthenticated.next(true);
        this.accessLevel = accessLevel;
        if (accessLevel == "full") {
            this.accessGranted = true;
        }
    }

    logout() {
        this.isAuthenticated.next(false);
        this.clearSession().subscribe((response: any) => {
            if (response.success) {
            } else {
              console.log(response);
            }
        });
    }

    clearSession() {
        const url = apiUrlBase + 'API/manage_data.php';
        return this.http.post(url, {action: "logout"}, {withCredentials: true}).pipe(
            map((response: any) => {
                if (response && response.success) {
                return response;
                } else {
                throw new Error('Unexpected response format');
                }
            }),
            catchError((error: any) => {
                console.error('HTTP error occurred:', error);
                return throwError(error);
            })
        );
    }

    isLoggedIn(): Observable<boolean> {
        return this.isAuthenticated.asObservable();
    }

    accessGuard() {
        console.log("Access Guard Engaged");
        this.route.queryParams.subscribe(async (params) => {
            let tableAccess = this.queryAccessTable(params["table"]);
            let urlAccess = this.queryAccessURL();
            this.accessGranted = tableAccess && urlAccess;
        });
    }

    queryAccessURL() {
        if (this.accessLevel == "full") {
            return true;
        }
        switch (this.router.url) {
            case "/print/invoice":
                return true;
        }
        return false;
    }

    queryAccessTable(table: any) {
        if (this.accessLevel == "full") {
            return true;
        }
        switch(table) {
            case "invoices":
                return true;

            default:
                this.router.navigate(['/home'], {});
                return false;
        }
    }

    returnAccess() {
        return this.accessGranted;
    }
}