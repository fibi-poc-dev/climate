import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ClimateDataService } from '../../services/climate-data.service';
import { CommonModule } from '@angular/common';


// PrimeNG imports
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';;


@Component({
  selector: 'app-risk',
  templateUrl: './risk.component.html',
  styleUrl: './risk.component.css',
  imports: [
    CommonModule,
    PanelModule,
    TableModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RiskComponent {
  // Inject the ClimateDataService
  protected readonly dataService = inject(ClimateDataService);
  

  // Residual Risk Population data
  protected readonly residualRiskPopulationRows = computed(() =>
    this.dataService.riskData()?.residualRiskPopulation.residualRiskPopulationRows || []
  );

  






}
