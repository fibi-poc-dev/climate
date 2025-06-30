import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { EsgMainReport } from '../models/esg-main-report.model';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/esg-reports'; // Future API endpoint

  /**
   * Gets all ESG main reports
   * Currently returns mock data, will be replaced with actual HTTP call
   */
  getEsgReports(): Observable<EsgMainReport[]> {
    // Mock data - replace with actual HTTP call when backend is ready
    const mockReports: EsgMainReport[] = [
      {
        bank: 1001,
        branch: 2001,
        account: 123456789,
        accountName: 'Green Energy Corp',
        customerRating: 'AAA',
        climateCount: 85,
        branchClassification: 1,
        branchClassificationDescription: 'Sustainable Banking',
        climateColor: 'green'
      },
      {
        bank: 1002,
        branch: 2002,
        account: 987654321,
        accountName: 'Industrial Manufacturing Ltd',
        customerRating: 'BBB',
        climateCount: 45,
        branchClassification: 2,
        branchClassificationDescription: 'Traditional Banking',
        climateColor: 'yellow'
      },
      {
        bank: 1003,
        branch: 2003,
        account: 555666777,
        accountName: 'Renewable Resources Inc',
        customerRating: 'AA',
        climateCount: 72,
        branchClassification: 1,
        branchClassificationDescription: 'Sustainable Banking',
        climateColor: 'green'
      },
      {
        bank: 1004,
        branch: 2004,
        account: 888999000,
        accountName: 'Heavy Industries Co',
        customerRating: 'B',
        climateCount: 28,
        branchClassification: 3,
        branchClassificationDescription: 'High Risk Banking',
        climateColor: 'red'
      }
    ];

    // Simulate network delay
    return of(mockReports).pipe(delay(500));
    
    // Future implementation:
    // return this.http.get<EsgMainReport[]>(this.apiUrl);
  }

  /**
   * Gets a specific ESG report by account number
   * Currently returns mock data, will be replaced with actual HTTP call
   */
  getEsgReportByAccount(accountNumber: number): Observable<EsgMainReport | null> {
    return new Observable(observer => {
      this.getEsgReports().subscribe(reports => {
        const report = reports.find(r => r.account === accountNumber);
        observer.next(report || null);
        observer.complete();
      });
    });

    // Future implementation:
    // return this.http.get<EsgMainReport>(`${this.apiUrl}/${accountNumber}`);
  }
}
