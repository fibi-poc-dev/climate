import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { EsgMainReport } from '../../models/esg-main-report.model';

@Component({
  selector: 'app-main-report',
  templateUrl: './main-report.component.html',
  styleUrl: './main-report.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainReportComponent {
  protected readonly reports = signal<EsgMainReport[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly selectedReport = signal<EsgMainReport | null>(null);

  // Computed values
  protected readonly totalReports = computed(() => this.reports().length);
  protected readonly hasReports = computed(() => this.reports().length > 0);

  constructor() {
    this.loadMockData();
  }

  protected selectReport(report: EsgMainReport): void {
    this.selectedReport.set(report);
  }

  protected clearSelection(): void {
    this.selectedReport.set(null);
  }

  private loadMockData(): void {
    // Mock data for demonstration
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
      }
    ];

    this.reports.set(mockReports);
  }
}
