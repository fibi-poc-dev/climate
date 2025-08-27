import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { StatusRow, SourceData } from '../../models/enums';
import { CarbonFootprintRow } from '../../models/carbon-footprint.model';
import { FilterField, FilterChangeEvent } from '../../form-controls/filter-field/filter-field';
import { SharedService } from '../../services/shared.service';
import { HttpService } from '../../services/http.service';


// PrimeNG imports
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ChipModule } from 'primeng/chip';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';




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
    ChipModule,
    InputTextModule,
    TextareaModule,
    FilterField
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarbonFootprintComponent {
  // Inject the ClimateDataService
  protected readonly dataService = inject(DataService);
  protected readonly sharedService = inject(SharedService);
  protected readonly httpService = inject(HttpService);

  // Loading state for save operation
  protected readonly isSaving = signal(false);

  // Computed signal for changed rows count across all sections
  protected readonly changedRowsCount = computed(() => this.dataService.changedRowsCount());
  


  protected readonly projectConstructionFinancingFilters = computed(() => {
    return this.dataService.request()?.projectConstructionFinancing.filter || [];
  });

  public removeProjectConstructionFinancingFilter(filterFieldName: string) {
    const requestSection = this.dataService.request()?.projectConstructionFinancing;
    if (requestSection && requestSection.filter) {
      requestSection.filter = requestSection.filter.filter(x => x.filterFieldName !== filterFieldName);
      this.dataService.updateProjectConstructionFinancing(requestSection);
    }
  }





  // Simple trigger to force re-evaluation when status row is changed
  private readonly statusRowChange = signal(0);

  // Project Construction Financing data - filtered to exclude deleted and original rows
  protected readonly projectConstructionFinancingRows = computed(() => {
    this.statusRowChange(); // Subscribe to trigger for reactivity
    const allRows = this.dataService.carbonFootprintData()?.projectConstructionFinancing.projectConstructionFinancingRows || [];
    return allRows.filter(row =>
      row.statusRow !== StatusRow.Deleted &&
      row.sourceData !== SourceData.Original
    );
  });

  // Project Construction Financing data - filtered to exclude deleted and original rows
  protected readonly projectConstructionFinancingRowsChanged = computed(() => {
    this.statusRowChange(); // Subscribe to trigger for reactivity
    const allRows = this.dataService.carbonFootprintData()?.projectConstructionFinancing.projectConstructionFinancingRows || [];
    return allRows.filter(row =>
      row.statusRow == StatusRow.Deleted ||
      row.statusRow == StatusRow.Updated ||
      row.statusRow == StatusRow.New
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
    this.statusRowChange.update(val => val + 1);
  }

  protected onValueChanged(row: CarbonFootprintRow): void {
    if (row.statusRow !== StatusRow.Deleted && row.statusRow !== StatusRow.New) {
      row.statusRow = StatusRow.Updated;

      // Trigger filter re-evaluation
      this.statusRowChange.update(val => val + 1);
    }
  }

  // Save method that calls the climateDataCalcAndSave service
  protected saveClimateData(): void {
    if (this.isSaving()) return; // Prevent multiple simultaneous saves

    this.isSaving.set(true);

    // Use the data service method to get only changed rows
    const filteredData = this.dataService.getChangedDataOnly();
    const changedRowsCount = this.dataService.changedRowsCount();

    // Log the number of changed rows being sent
    console.log(`Sending ${changedRowsCount} changed rows to server`);

    this.httpService.climateDataCalcAndSave(filteredData).subscribe({
      next: (response) => {
        // Update the data service with the saved response
        this.dataService.updateData(response);
        this.isSaving.set(false);
        console.log('Climate data saved successfully', response);
      },
      error: (error) => {
        this.isSaving.set(false);
        console.error('Error saving climate data:', error);
        // TODO: Add proper error handling/notification
      }
    });
  }



}
