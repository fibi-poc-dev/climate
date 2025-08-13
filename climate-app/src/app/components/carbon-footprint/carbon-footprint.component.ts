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
  protected readonly dataService = inject(ClimateDataService);

  protected readonly hasData = computed(() =>
    this.dataService.hasData()
  );

  protected retryDataLoad(): void {
    this.dataService.refreshClimateData().subscribe({
      next: () => {
        console.log('Data refreshed successfully');
      },
      error: (error) => {
        console.error('Failed to refresh data:', error);
      }
    });
  }

  // Project Construction Financing data
  protected readonly projectConstructionFinancingRows = computed(() =>
      this.dataService.carbonFootprintData()?.projectConstructionFinancing.projectConstructionFinancingRows || []
  );

  




}
