import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ClimateResponse } from '../models/climate-response.model';
import { ClimateRequest } from '../models/climate-request.model';

const httpOptions = {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
};


@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/Climate/';


  getClimateData(climateRequest: ClimateRequest | null): Observable<ClimateResponse> {
    //Load data from assets/response.json
    return this.http.get<ClimateResponse>('/assets/response.json').pipe(
      delay(500) // Simulate network delay
    );


    // TODO: real implementation
    // let params = {
    //   "ClimateDataRequest": climateRequest
    // }
    // return this.http.post<ClimateResponse>(this.apiUrl + 'climateData', JSON.stringify(params), httpOptions);
  }




}
