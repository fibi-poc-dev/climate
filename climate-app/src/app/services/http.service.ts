import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ClimateResponse } from '../models/climate-response.model';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/climate-reports'; // Future API endpoint

  /**
   * Gets the complete climate response data
   * Reads data from assets/response.json file
   */
  getClimateResponse(): Observable<ClimateResponse> {
    // Load data from assets/response.json
    return this.http.get<ClimateResponse>('/assets/response.json').pipe(
      delay(500) // Simulate network delay
    );
    
    // Future implementation for actual API:
    // return this.http.get<ClimateResponse>(this.apiUrl);
  }
}
