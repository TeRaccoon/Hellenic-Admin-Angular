import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, lastValueFrom, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UrlService } from './url.service';
import {
  BalanceSheetData,
  BalanceSheetTable,
} from '../common/types/data-service/types';

export const apiUrlBase = 'http://localhost/API/';
export const imageUrlBase = 'http://localhost/uploads/';
@Injectable({
  providedIn: 'root',
})
export class DataService {
  private dataSubject = new Subject<any[]>();
  tableData: any = null;
  private widgetData = new Subject<{
    [key: string]: { name: string; quantity: number }[];
  }>();
  private tableWidgetData: any = {};
  private balanceSheetData: BalanceSheetData = {
    Title: '',
    CustomerId: -1,
    Table: BalanceSheetTable.Customers,
  };
  altTableData: any = {};
  invoiceIds: any[] = [];
  tabs: { displayName: string; tableName: string }[] = [];

  constructor(private http: HttpClient, private urlService: UrlService) {}

  async processGet(
    query: string,
    filter: Record<string, any> = {},
    makeArray = false
  ): Promise<any> {
    const url = new URL(this.urlService.getUrl('admin'));
    url.searchParams.append('query', query);
    const queryParams = { ...filter };
    for (const [key, value] of Object.entries(queryParams)) {
      url.searchParams.append(key, value ?? '');
    }

    let response = await lastValueFrom(this.http.get(url.toString()));

    if (makeArray) response = Array.isArray(response) ? response : [response];

    return response;
  }

  async processPost(
    body: Record<string, any>,
    makeArray = false
  ): Promise<any> {
    const url = this.urlService.getUrl('admin');
    let response = await lastValueFrom(this.http.post(url, { body }));

    if (makeArray) response = Array.isArray(response) ? response : [response];

    return response;
  }

  async submitFormData(data: any) {
    const url = apiUrlBase + 'manage_data.php';
    let submissionResponse = await lastValueFrom<any>(
      this.http.post(url, data, { withCredentials: true })
    );
    return submissionResponse;
  }

  async syncInsert(
    tableName: string,
    id: string,
    quantity: number,
    url: string
  ) {
    let data = {
      id: id,
      quantity: quantity,
      table: tableName,
      query: `${tableName}_insert`,
    };

    switch (tableName) {
      case 'invoiced_items':
        let syncResponse = await lastValueFrom(
          this.http.post(url, data, { withCredentials: true })
        );
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

  storeBalanceSheetData(data: any) {
    this.balanceSheetData = data;
  }

  retrieveBalanceSheetData() {
    return this.balanceSheetData;
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

  setTabs(tabs: { displayName: string; tableName: string }[]) {
    this.tabs = tabs;
  }
  getTabs() {
    return this.tabs;
  }
}
