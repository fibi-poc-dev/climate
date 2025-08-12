import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ClimateDataService } from '../../services/climate-data.service';
import { CommonModule } from '@angular/common';


// PrimeNG imports
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';


@Component({
  selector: 'app-carbon-footprint',
  templateUrl: './carbon-footprint.component.html',
  styleUrl: './carbon-footprint.component.css',
  imports: [
    CommonModule,
    PanelModule,
    TableModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarbonFootprintComponent {
  protected readonly climateDataService = inject(ClimateDataService);

  protected readonly hasData = computed(() =>
    this.climateDataService.hasData()
  );

  protected retryDataLoad(): void {
    this.climateDataService.refreshClimateData().subscribe({
      next: () => {
        console.log('Data refreshed successfully');
      },
      error: (error) => {
        console.error('Failed to refresh data:', error);
      }
    });
  }


  // Green Credit data
  protected readonly greenCreditRows = computed(() =>
    this.climateDataService.greenCreditData()?.greenCreditRows || []
  );
  protected readonly totalGreenCredit = computed(() =>
    this.climateDataService.greenCreditData()?.totalGreenCredit
  );




}
