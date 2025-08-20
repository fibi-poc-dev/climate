import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { StatusRow, SourceData } from '../../models/enums';
import { CarbonFootprintRow } from '../../models/carbon-footprint.model';
import { FilterField, FilterChangeEvent } from '../../form-controls/filter-field/filter-field';


// PrimeNG imports
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';




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
    TooltipModule,
    CardModule,
    ToolbarModule,
    FilterField
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarbonFootprintComponent {
  // Inject the ClimateDataService
  protected readonly dataService = inject(DataService);


  protected readonly projectConstructionFinancingFilters = computed(() => {
    return this.dataService.request()?.projectConstructionFinancing.filter || [];
  });





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
  protected deleteProjectConstructionRow(row: CarbonFootprintRow): void {
    // Set the statusRow to Deleted (2)
    row.statusRow = StatusRow.Deleted;

    // Trigger filter re-evaluation
    this.statusRowChange.update(val => StatusRow.Deleted);
  }

  protected onValueChanged(row: CarbonFootprintRow): void {
    if (row.statusRow !== StatusRow.Deleted && row.statusRow !== StatusRow.New) {
      row.statusRow = StatusRow.Updated;

      // Trigger filter re-evaluation
      this.statusRowChange.update(val => StatusRow.Updated);
    }
  }

  climateDataCalcAndSave(): void {
    // Implement the calculation and saving logic here
  }

}
