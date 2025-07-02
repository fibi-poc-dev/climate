import { ChangeDetectionStrategy, Component, signal, computed, inject, OnInit } from '@angular/core';
import { EsgMainReportRow, getClimateColorString, getCustomerRatingString } from '../../models/climate-response.model';
import { ClimateDataService } from '../../services/climate-data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-report',
  templateUrl: './main-report.component.html',
  styleUrl: './main-report.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
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

  // Heat Map data
  protected readonly heatMapRows = computed(() => 
    this.climateDataService.heatMapData()?.heatMapRows || []
  );
  
  protected readonly totalHeatMap = computed(() => 
    this.climateDataService.heatMapData()?.totalHeatMap
  );
  
  protected readonly hasHeatMapData = computed(() => this.heatMapRows().length > 0);

  // Helper functions for template
  protected getClimateColorString = getClimateColorString;
  protected getCustomerRatingString = getCustomerRatingString;
  
  // RTL support
  protected isRtl = true; // Set to true for Hebrew RTL layout
  
  // Hebrew number formatting
  protected formatHebrewNumber(value: number | null): string {
    if (value === null || value === undefined) return 'לא זמין';
    return new Intl.NumberFormat('he-IL').format(value);
  }
  
  // Hebrew rating translation
  protected getHebrewRating(rating: number | null): string {
    if (!rating) return 'לא מדורג';
    const ratings = {
      1: 'מעולה',
      2: 'טוב',
      3: 'בינוני', 
      4: 'מתחת לבינוני',
      5: 'גרוע'
    };
    return ratings[rating as keyof typeof ratings] || 'לא מוגדר';
  }
  
  // Hebrew climate status translation
  protected getHebrewClimateStatus(climateColor: number | null): string {
    if (!climateColor) return 'לא מוגדר';
    const statuses = {
      1: 'ירוק', // Green
      2: 'צהוב', // Yellow  
      3: 'אדום'  // Red
    };
    return statuses[climateColor as keyof typeof statuses] || 'לא מוגדר';
  }

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
