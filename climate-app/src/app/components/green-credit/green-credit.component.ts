import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';


// PrimeNG imports
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';;


@Component({
  selector: 'app-green-credit',
  templateUrl: './green-credit.component.html',
  styleUrl: './green-credit.component.css',
  imports: [
    CommonModule,
    PanelModule,
    TableModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GreenCreditComponent {
  // Inject the ClimateDataService
  protected readonly dataService = inject(DataService);


  // New Green Credit Report data
  protected readonly newGreenCreditReportRows = computed(() =>
    this.dataService.newGreenCreditData()?.newGreenCreditReport.newGreenCreditReportRows || []
  );








}
