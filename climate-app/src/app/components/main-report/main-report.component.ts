import { ChangeDetectionStrategy, Component, signal, computed, inject, OnInit } from '@angular/core';
import { EsgMainReportRow, getClimateColorString, getCustomerRatingString, SourceData } from '../../models/climate-response.model';
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
  protected readonly reports = computed(() => {
    const allReports = this.climateDataService.esgMainReport()?.esgMainReportRows || [];
    // Filter to show only rows with SourceData = COPY or USER_ADDED
    return allReports.filter(report =>
      report.sourceData === SourceData.COPY || report.sourceData === SourceData.USER_ADDED
    );
  });

  protected readonly totalReports = computed(() => this.reports().length);
  protected readonly hasReports = computed(() => this.reports().length > 0);

  // Auto-select first row when data loads
  protected readonly autoSelectFirst = computed(() => {
    const reportsData = this.reports();
    if (reportsData.length > 0 && this.selectedRowIndex() === null) {
      // Use setTimeout to avoid circular dependency
      setTimeout(() => this.selectedRowIndex.set(0), 0);
    }
    return reportsData;
  });

  // Heat Map data
  protected readonly heatMapRows = computed(() =>
    this.climateDataService.heatMapData()?.heatMapRows || []
  );

  protected readonly totalHeatMap = computed(() =>
    this.climateDataService.heatMapData()?.totalHeatMap
  );

  protected readonly hasHeatMapData = computed(() => this.heatMapRows().length > 0);

  // Green Credit data
  protected readonly greenCreditRows = computed(() =>
    this.climateDataService.greenCreditData()?.greenCreditRows || []
  );

  protected readonly totalGreenCredit = computed(() =>
    this.climateDataService.greenCreditData()?.totalGreenCredit
  );

  protected readonly hasGreenCreditData = computed(() => this.greenCreditRows().length > 0);

  // Collapsible section state
  private readonly heatMapExpanded = signal(false); // Minimized by default
  protected readonly isHeatMapExpanded = computed(() => this.heatMapExpanded());

  private readonly greenCreditExpanded = signal(false); // Minimized by default
  protected readonly isGreenCreditExpanded = computed(() => this.greenCreditExpanded());

  private readonly detailsExpanded = signal(false); // Minimized by default
  protected readonly isDetailsExpanded = computed(() => this.detailsExpanded());

  // Selected row state for master-details
  private readonly selectedRowIndex = signal<number | null>(null);
  protected readonly selectedReport = computed(() => {
    const index = this.selectedRowIndex();
    const reportsData = this.reports();
    return index !== null && reportsData[index] ? reportsData[index] : null;
  });
  protected readonly hasSelectedReport = computed(() => this.selectedReport() !== null);

  // Toggle method for collapsible sections
  protected toggleHeatMapSection(): void {
    this.heatMapExpanded.update(current => !current);
  }

  protected toggleGreenCreditSection(): void {
    this.greenCreditExpanded.update(current => !current);
  }

  protected toggleDetailsSection(): void {
    this.detailsExpanded.update(current => !current);
  }

  // Row selection methods for master-details
  protected selectRow(index: number): void {
    this.selectedRowIndex.set(index);
  }

  protected isRowSelected(index: number): boolean {
    return this.selectedRowIndex() === index;
  }

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

  // Hebrew date formatting
  protected formatDate(dateValue: string | null): string {
    if (!dateValue) return 'לא זמין';
    try {
      const date = new Date(dateValue);
      return new Intl.DateTimeFormat('he-IL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(date);
    } catch {
      return 'תאריך לא תקין';
    }
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
