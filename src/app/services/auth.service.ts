import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private isAuthenticated = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient) {
    }

    checkLogin() {
        const url = 'http://localhost/API/manage_data.php';
        
        return this.http.post(url, {action: "check-login"}, {withCredentials: true}).pipe(
            map((response: any) => {
                return response;
            })
        );
    }

    login(userID: number | null) {
        this.isAuthenticated.next(true);
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
        const url = 'http://localhost/API/manage_data.php';
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
}