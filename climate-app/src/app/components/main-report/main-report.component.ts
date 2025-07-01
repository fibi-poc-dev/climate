import { ChangeDetectionStrategy, Component, signal, computed, inject, OnInit } from '@angular/core';
import { EsgMainReportRow, getClimateColorString, getCustomerRatingString } from '../../models/climate-response.model';
import { ClimateDataService } from '../../services/climate-data.service';

@Component({
  selector: 'app-main-report',
  templateUrl: './main-report.component.html',
  styleUrl: './main-report.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainReportComponent implements OnInit {
  private readonly climateDataService = inject(ClimateDataService);
  
  // Use the shared service signals
  protected readonly isLoading = this.climateDataService.loading;
  protected readonly error = this.climateDataService.error;
  
  // Computed signals for ESG main report data
  protected readonly reports = computed(() => 
    this.climateDataService.esgMainReport()?.esgMainReportRows || []
  );
  
  protected readonly totalReports = computed(() => this.reports().length);
  protected readonly hasReports = computed(() => this.reports().length > 0);

  // Helper functions for template
  protected getClimateColorString = getClimateColorString;
  protected getCustomerRatingString = getCustomerRatingString;

  ngOnInit(): void {
    this.loadReports();
  }

  private loadReports(): void {
    // Use the shared service to load data
    this.climateDataService.loadClimateData().subscribe({
      error: (error) => {
        console.error('Error loading climate data:', error);
      }
    });
  }
}
