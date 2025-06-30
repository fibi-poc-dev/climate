import { ChangeDetectionStrategy, Component, signal, computed, inject, OnInit } from '@angular/core';
import { EsgMainReportRow, getClimateColorString, getCustomerRatingString } from '../../models/climate-response.model';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-main-report',
  templateUrl: './main-report.component.html',
  styleUrl: './main-report.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainReportComponent implements OnInit {
  private readonly httpService = inject(HttpService);
  
  protected readonly reports = signal<EsgMainReportRow[]>([]);
  protected readonly isLoading = signal(false);

  // Computed values
  protected readonly totalReports = computed(() => this.reports().length);
  protected readonly hasReports = computed(() => this.reports().length > 0);

  // Helper functions for template
  protected getClimateColorString = getClimateColorString;
  protected getCustomerRatingString = getCustomerRatingString;

  ngOnInit(): void {
    this.loadReports();
  }

  private loadReports(): void {
    this.isLoading.set(true);
    
    this.httpService.getEsgReports().subscribe({
      next: (reports) => {
        this.reports.set(reports);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading ESG reports:', error);
        this.isLoading.set(false);
        // Could set an error signal here for user feedback
      }
    });
  }
}
