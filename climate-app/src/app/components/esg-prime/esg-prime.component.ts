import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClimateDataService } from '../../services/climate-data.service';
import { EsgMainReportRow, ClimateColor, CustomerRating } from '../../models/climate-response.model';

// PrimeNG imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressBarModule } from 'primeng/progressbar';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-esg-prime',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    CardModule,
    TagModule,
    InputTextModule,
    ToolbarModule,
    TooltipModule,
    ProgressBarModule,
    DividerModule
  ],
  templateUrl: './esg-prime.component.html',
  styleUrl: './esg-prime.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EsgPrimeComponent {
  private climateDataService = inject(ClimateDataService);
  
  // Signals for reactive state management
  protected readonly climateData = this.climateDataService.data;
  protected readonly isLoading = this.climateDataService.loading;
  protected readonly filterText = signal('');
  protected readonly selectedClimateColor = signal<number | null>(null);
  protected readonly selectedCustomerRating = signal<number | null>(null);

  // Computed signals for filtered and processed data
  protected readonly esgMainReportData = computed(() => {
    const data = this.climateData();
    return data?.esg?.esgMainReport?.esgMainReportRows || [];
  });

  protected readonly filteredData = computed(() => {
    const data = this.esgMainReportData();
    const filter = this.filterText().toLowerCase();
    const colorFilter = this.selectedClimateColor();
    const ratingFilter = this.selectedCustomerRating();

    return data.filter((row: EsgMainReportRow) => {
      const matchesText = !filter || 
        (row.accountName?.toLowerCase().includes(filter) || false) ||
        (row.regualatedSectorDescription?.toLowerCase().includes(filter) || false) ||
        (row.branchClassificatonDescription?.toLowerCase().includes(filter) || false);
      
      const matchesColor = colorFilter === null || row.climateColor === colorFilter;
      const matchesRating = ratingFilter === null || row.customerRating === ratingFilter;
      
      return matchesText && matchesColor && matchesRating;
    });
  });

  // Statistics computed signals
  protected readonly totalRows = computed(() => this.filteredData().length);
  protected readonly totalCredit = computed(() => 
    this.filteredData().reduce((sum: number, row: EsgMainReportRow) => sum + (row.totalCreditRisk || 0), 0)
  );
  protected readonly avgRisk = computed(() => {
    const data = this.filteredData();
    if (data.length === 0) return 0;
    return data.reduce((sum: number, row: EsgMainReportRow) => sum + (row.rootRiskLevelWeight || 0), 0) / data.length;
  });

  protected readonly colorDistribution = computed(() => {
    const data = this.filteredData();
    const distribution = { green: 0, yellow: 0, red: 0 };
    
    data.forEach((row: EsgMainReportRow) => {
      switch (row.climateColor) {
        case ClimateColor.GREEN:
          distribution.green++;
          break;
        case ClimateColor.YELLOW:
          distribution.yellow++;
          break;
        case ClimateColor.RED:
          distribution.red++;
          break;
      }
    });
    
    return distribution;
  });

  // Methods
  protected clearFilters(): void {
    this.filterText.set('');
    this.selectedClimateColor.set(null);
    this.selectedCustomerRating.set(null);
  }

  protected exportData(): void {
    const data = this.filteredData();
    const csv = this.convertToCSV(data);
    this.downloadCSV(csv, 'esg-main-report.csv');
  }

  protected getClimateColorSeverity(climateColor: number | null): string {
    switch (climateColor) {
      case ClimateColor.GREEN:
        return 'success';
      case ClimateColor.YELLOW:
        return 'warning';
      case ClimateColor.RED:
        return 'danger';
      default:
        return 'secondary';
    }
  }

  protected getClimateColorLabel(climateColor: number | null): string {
    switch (climateColor) {
      case ClimateColor.GREEN:
        return 'ירוק';
      case ClimateColor.YELLOW:
        return 'צהוב';
      case ClimateColor.RED:
        return 'אדום';
      default:
        return 'לא ידוע';
    }
  }

  protected getCustomerRatingLabel(rating: number | null): string {
    const ratingMap: { [key: number]: string } = {
      [CustomerRating.AAA]: 'AAA',
      [CustomerRating.AA]: 'AA',
      [CustomerRating.A]: 'A',
      [CustomerRating.BBB]: 'BBB',
      [CustomerRating.BB]: 'BB',
      [CustomerRating.B]: 'B',
      [CustomerRating.CCC]: 'CCC'
    };
    return rating !== null ? ratingMap[rating] || 'לא ידוע' : 'לא ידוע';
  }

  protected formatCurrency(value: number | null): string {
    if (value === null || value === undefined) return '0';
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  protected formatPercentage(value: number | null): string {
    if (value === null || value === undefined) return '0%';
    return `${value.toFixed(2)}%`;
  }

  private convertToCSV(data: EsgMainReportRow[]): string {
    if (data.length === 0) return '';

    const headers = [
      'תאריך נכונות נתונים',
      'שם חשבון',
      'דירוג לקוח',
      'סמך אשראי נוכחי',
      'תיאור מגזר מוסדר',
      'תיאור סיווג ענף',
      'צבע אקלים',
      'סיכון אשראי כולל'
    ];

    const csvData = data.map(row => [
      row.dataCorrectnessDate,
      row.accountName || '',
      this.getCustomerRatingLabel(row.customerRating),
      this.formatCurrency(row.currentCreditAuthority),
      row.regualatedSectorDescription || '',
      row.branchClassificatonDescription || '',
      this.getClimateColorLabel(row.climateColor),
      this.formatCurrency(row.totalCreditRisk)
    ]);

    return [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  }

  private downloadCSV(csv: string, filename: string): void {
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
