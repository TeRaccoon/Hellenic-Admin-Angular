import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, lastValueFrom, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export const apiUrlBase = "http://localhost/API/";
export const imageUrlBase = "http://localhost/uploads/";
@Injectable({
  providedIn: 'root',
})

export class DataService {
  private dataSubject = new Subject<any[]>();
  tableData: any = null;
  private widgetData = new Subject<{ [key: string]: { name: string, quantity: number}[]}>();
  private tableWidgetData: any = {};
  altTableData: any = {};
  invoiceIds: any[] = [];
  tabs: {displayName: string, tableName: string}[] = [];

  constructor(private http: HttpClient) {}

  processData(query: string, filter?: string): Observable<any> {
    let url = apiUrlBase + `admin_query_handler.php?query=${query}`;
    if (filter != null) {
      url += `&filter=${encodeURIComponent(filter)}`;
    }
    return this.http.get<any>(url);
  }
  
  collectDataComplex(query: string, filter?: Record<string, any>): Observable<any> {
    let url = apiUrlBase + `admin_query_handler.php?query=${query}`;
    if (filter != null) {
      const queryParams = Object.entries(filter).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
      url += `&${queryParams}`;
    }
    return this.http.get<any>(url);
  }

  async submitFormData(data: any) {
    const url = apiUrlBase + 'manage_data.php';
    let submissionResponse = await lastValueFrom<any>(this.http.post(url, data, {withCredentials: true}));
    return submissionResponse;
  }

  async syncInsert(tableName: string, id: string, quantity: number, url: string) {
    let data = {
      id: id,
      quantity: quantity,
      table: tableName,
      query: `${tableName}_insert`
    };

    switch(tableName) {
      case "invoiced_items":
        let syncResponse = await lastValueFrom(this.http.post(url, data, {withCredentials: true}))
        break;
    }
  }

  uploadImage(formData: FormData): Observable<any> {
    const url = apiUrlBase + 'image_upload.php';
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

  uploadDocument(formData: FormData): Observable<any> {
    const url = apiUrlBase + 'document_upload.php';
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

  storeTableWidgetData(data: any) {
    this.tableWidgetData = data;
  }

  retrieveTableWidgetData() {
    return this.tableWidgetData;
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