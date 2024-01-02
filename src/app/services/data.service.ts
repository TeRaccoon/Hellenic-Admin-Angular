import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  collectData(query: string, filter?: string): Observable<any[]> {
    let url = `http://localhost/API/admin_query_handler.php?query=${query}`;
    if (filter != null) {
      url += `&filter=${encodeURIComponent(filter)}`;
    }
    return this.http.get<any[]>(url);
  }
  
  collectDataComplex(query: string, filter?: Record<string, any>): Observable<any[]> {
    let url = `http://localhost/API/admin_query_handler.php?query=${query}`;
    if (filter != null) {
      const queryParams = Object.entries(filter).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
      url += `&${queryParams}`;
    }
    return this.http.get<any[]>(url);
  }

  submitFormData(data: any) {
    const url = 'http://localhost/API/manage_data.php/';
    return this.http.post(url, data);
  }
}