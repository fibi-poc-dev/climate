import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClimateDataService } from '../../services/climate-data.service';
import { StatusRow, SourceData } from '../../models/enums';


// PrimeNG imports
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';



@Component({
  selector: 'app-carbon-footprint',
  templateUrl: './carbon-footprint.component.html',
  styleUrl: './carbon-footprint.component.css',
  imports: [
    CommonModule,
    FormsModule,
    PanelModule,
    TableModule,
    InputNumberModule,
    ButtonModule,
    TooltipModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarbonFootprintComponent {
  // Inject the ClimateDataService
  protected readonly dataService = inject(ClimateDataService);

  // Simple trigger to force re-evaluation when rows are deleted
  private readonly statusRowChange = signal(StatusRow.Unchanged);

  // Project Construction Financing data - filtered to exclude deleted and original rows
  protected readonly projectConstructionFinancingRows = computed(() => {
    this.statusRowChange(); // Subscribe to trigger for reactivity
    const allRows = this.dataService.carbonFootprintData()?.projectConstructionFinancing.projectConstructionFinancingRows || [];
    return allRows.filter(row =>
      row.statusRow !== StatusRow.Deleted &&
      row.sourceData !== SourceData.Original
    );
  });

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

  // Delete row method for project construction financing
  protected deleteProjectConstructionRow(row: any): void {
    // Set the statusRow to Deleted (2)
    row.statusRow = StatusRow.Deleted;

    // Trigger filter re-evaluation
    this.statusRowChange.update(val => StatusRow.Deleted);
  }






}
