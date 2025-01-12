import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { UrlService } from './url.service';
import { Response } from '../common/types/data-service/types';

@Injectable({
  providedIn: 'root',
})
export class MailService {
  url;

  constructor(private http: HttpClient, urlService: UrlService) {
    this.url = urlService.getUrl('mail');
  }

  async sendEmail(data: any): Promise<Response> {
    return await lastValueFrom(
      this.http.post<Response>(this.url, data, { withCredentials: true })
    );
  }
}
