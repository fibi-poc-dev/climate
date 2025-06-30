import { ChangeDetectionStrategy, Component, signal, computed, inject, OnInit } from '@angular/core';
import { EsgMainReport } from '../../models/esg-main-report.model';
import { EsgReportService } from '../../services/esg-report.service';

@Component({
  selector: 'app-main-report',
  templateUrl: './main-report.component.html',
  styleUrl: './main-report.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainReportComponent implements OnInit {
  private readonly esgReportService = inject(EsgReportService);
  
  protected readonly reports = signal<EsgMainReport[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly selectedReport = signal<EsgMainReport | null>(null);

  // Computed values
  protected readonly totalReports = computed(() => this.reports().length);
  protected readonly hasReports = computed(() => this.reports().length > 0);

  ngOnInit(): void {
    this.loadReports();
  }

  protected selectReport(report: EsgMainReport): void {
    this.selectedReport.set(report);
  }

  protected clearSelection(): void {
    this.selectedReport.set(null);
  }

  private loadReports(): void {
    this.isLoading.set(true);
    
    this.esgReportService.getEsgReports().subscribe({
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
