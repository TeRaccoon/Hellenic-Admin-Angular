import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export const apiUrlBase = "http://localhost/";
export const imageUrlBase = "http://localhost/uploads/";
@Injectable({
  providedIn: 'root',
})

export class DataService {
  private dataSubject = new Subject<any[]>();
  tableData: any = null;
  private widgetData = new Subject<{ [key: string]: { name: string, quantity: number}[]}>();
  altTableData: any = {};
  invoiceIds: any[] = [];
  tabs: {displayName: string, tableName: string}[] = [];

  constructor(private http: HttpClient) {}

  collectData(query: string, filter?: string): Observable<any[]> {
    let url = apiUrlBase + `API/admin_query_handler.php?query=${query}`;
    if (filter != null) {
      url += `&filter=${encodeURIComponent(filter)}`;
    }
    return this.http.get<any[]>(url);
  }
  
  collectDataComplex(query: string, filter?: Record<string, any>): Observable<any[]> {
    let url = apiUrlBase + `API/admin_query_handler.php?query=${query}`;
    if (filter != null) {
      const queryParams = Object.entries(filter).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
      url += `&${queryParams}`;
    }
    return this.http.get<any[]>(url);
  }

  submitFormData(data: any): Observable<any> {
    const url = apiUrlBase + 'API/manage_data.php';
    return this.http.post(url, data, {withCredentials: true}).pipe(
      map((response: any) => {
        if (response) {
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

  uploadImage(formData: FormData): Observable<any> {
    const url = apiUrlBase + 'API/image_upload.php';
    return this.http.post(url, formData).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: any) => {
        console.error('HTTP error occurred:', error);
        return throwError(error);
      })
    );
  }

  storeData(data: any) {
    this.tableData = data;
    this.dataSubject.next(data);
  }

  retrieveData() {
    return this.tableData;
  }

  storeWidgetData(data: any) {
    this.widgetData.next(data);
  }

  retrieveWidgetData() {
    return this.widgetData;
  }

  getDataObservable(): Observable<any[]> {
    return this.dataSubject.asObservable();
  }

  storePrintInvoiceIds(data: any) {
    this.invoiceIds = data;
  }
  retrievePrintInvoiceIds() {
    return this.invoiceIds;
  }

  setAlternativeTableData(data: any) {
    this.altTableData = data;
  }
  getAlternativeTableData() {
    return this.altTableData;
  }

  setTabs(tabs: {displayName: string, tableName: string}[]) {
    this.tabs = tabs;
  }
  getTabs() {
    return this.tabs;
  }
}