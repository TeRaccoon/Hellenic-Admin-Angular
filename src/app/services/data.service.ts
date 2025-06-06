import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, lastValueFrom } from 'rxjs';
import { UrlService } from './url.service';
import { BalanceSheetData, Response } from '../common/types/data-service/types';
import { DEFAULT_BALANCE_SHEET } from '../common/types/data-service/const';
import { WidgetData } from '../common/types/widget/types';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private dataSubject = new Subject<any[]>();
  tableData: any = null;
  private widgetData = new Subject<WidgetData>();
  private tableWidgetData: any = {};
  private balanceSheetData: BalanceSheetData;
  altTableData: any = {};
  invoiceIds: any[] = [];
  tabs: { displayName: string; tableName: string }[] = [];

  constructor(private http: HttpClient, private urlService: UrlService) {
    this.balanceSheetData = DEFAULT_BALANCE_SHEET;
  }

  async processGet(
    query: string,
    filter: Record<string, any> = {},
    makeArray = false
  ): Promise<any> {
    let url = new URL(this.urlService.getUrl('admin'));
    url.searchParams.append('query', query);
    url = this.parseParams(url, filter);

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

  async processDocument(location: string) {
    const url = this.urlService.getUrl('admin');
    let value = await lastValueFrom(
      this.http.post(url, {
        body: {
          action: 'document',
          url: this.urlService.getUrl('uploads') + location,
        },
      })
    );
    return value;
  }

  async submitFormData(data: any) {
    const url = this.urlService.getUrl('data');

    let submissionResponse = await lastValueFrom<any>(
      this.http.post(url, data, { withCredentials: true })
    );
    return submissionResponse;
  }

  async uploadImage(formData: FormData): Promise<Response> {
    const url = this.urlService.getUrl('image-upload');
    return await lastValueFrom(this.http.post<Response>(url, formData));
  }

  async uploadDocument(formData: FormData): Promise<any> {
    const url = this.urlService.getUrl('document-upload');
    return await lastValueFrom(this.http.post(url, formData));
  }

  parseParams(url: URL, filter: Record<string, any>): URL {
    const queryParams = { ...filter };
    for (const [key, value] of Object.entries(queryParams)) {
      url.searchParams.append(key, value ?? '');
    }

    return url;
  }

  storeData(data: any) {
    this.tableData = data;
    this.dataSubject.next(data);
  }

  retrieveData() {
    return this.tableData;
  }

  storeWidgetData(data: WidgetData) {
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
