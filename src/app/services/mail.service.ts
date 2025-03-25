import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { UrlService } from './url.service';
import { Response } from '../common/types/data-service/types';
import { SelectedDate } from '../common/types/statistics/types';

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

  getSupplierInvoiceEmail(dateRange: SelectedDate) {
    let email = `
    <html>
    <head>
        <title>Forgotten Password</title>
        <meta charset="UTF-8">
        <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 30%;
            min-width: 450px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #007bff;
            text-align: center;
            margin-bottom: 20px;
        }
        p {
            margin: 10px 0;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #555;
        }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Balance Sheet</h1>
            <p>Please see attached below the relevant balance sheet for the period ${dateRange.startDate?.toString()} to ${dateRange.endDate?.toString()}</p>
            <p>Thank you for choosing our service!</p>
            <div class="footer">
                <p>Best regards,</p>
                <p>Hellenic Grocery</p>
            </div>
        </div>
    </body>
    </html>`;

    return email;
  }
}
