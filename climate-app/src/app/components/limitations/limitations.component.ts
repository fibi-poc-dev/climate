import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';


// PrimeNG imports
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';;


@Component({
  selector: 'app-limitations',
  templateUrl: './limitations.component.html',
  styleUrl: './limitations.component.css',
  imports: [
    CommonModule,
    PanelModule,
    TableModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LimitationsComponent {
  // Inject the ClimateDataService
  protected readonly dataService = inject(DataService);


  // Limitations Report data
  protected readonly limitationsReportRows = computed(() =>
    this.dataService.limitationsData()?.limitationsReport.limitationsReportRows || []
  );








}
