import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClimateDataService } from '../../services/climate-data.service';


// PrimeNG imports
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';



@Component({
  selector: 'app-carbon-footprint',
  templateUrl: './carbon-footprint.component.html',
  styleUrl: './carbon-footprint.component.css',
  imports: [
    CommonModule,
    FormsModule,
    PanelModule,
    TableModule,
    InputNumberModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarbonFootprintComponent {
  // Inject the ClimateDataService
  protected readonly dataService = inject(ClimateDataService);
  

  // Project Construction Financing data
  protected readonly projectConstructionFinancingRows = computed(() =>
    this.dataService.carbonFootprintData()?.projectConstructionFinancing.projectConstructionFinancingRows || []
  );

  // Project Infrastructure Financing data
  protected readonly projectInfrastructureFinancingRows = computed(() =>
    this.dataService.carbonFootprintData()?.projectInfrastructureFinancing.projectInfrastructureFinancingRows || []
  );

  // Without Projects data
  protected readonly withoutProjectsRows = computed(() =>
    this.dataService.carbonFootprintData()?.withoutProjects.withoutProjectsRows || []
  );

  // Carbon Footprint Main Report data
  protected readonly carbonFootprintMainReportRows = computed(() =>
    this.dataService.carbonFootprintData()?.carbonFootprintMainReport.carbonFootprintMainReportRows || []
  );






}
