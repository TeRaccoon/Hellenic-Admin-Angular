import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Config } from '../common/types/config/types';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config: Config | null = null;
  reCAPTCHASiteKey = '';

  constructor(private http: HttpClient) { }

  async loadConfig() {
    this.config = await lastValueFrom(this.http.get<Config>(environment.configUrl));
    this.reCAPTCHASiteKey = await lastValueFrom<string>(this.http.post<string>(`${this.config.host}${this.config.apiExtension}admin_query_handler.php`, {
      body: {
        action: 'setting',
        key: 'recaptcha'
      }
    }));
  }

  getConfig() {
    return this.config;
  }
}
