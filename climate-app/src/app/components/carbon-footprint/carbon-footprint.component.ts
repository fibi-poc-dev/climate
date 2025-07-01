import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ClimateDataService } from '../../services/climate-data.service';
import { CommonModule } from '@angular/common';
import { HeatMapRow } from '../../models/climate-response.model';

@Component({
  selector: 'app-carbon-footprint',
  templateUrl: './carbon-footprint.component.html',
  styleUrl: './carbon-footprint.component.css',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarbonFootprintComponent {
  protected readonly climateDataService = inject(ClimateDataService);
  
  // Computed signals for easy access to specific data sections
  protected readonly heatMapData = this.climateDataService.heatMapData;
  protected readonly blackCreditData = this.climateDataService.blackCreditData;
  protected readonly greenCreditData = this.climateDataService.greenCreditData;
  
  protected readonly hasData = computed(() => 
    this.climateDataService.hasData()
  );

  // Helper methods for template calculations
  protected getOverallRiskScore(): string {
    const data = this.climateDataService.data();
    if (!data?.esg.heatMap.heatMapRows.length) return 'N/A';
    
    const totalRisk = data.esg.heatMap.heatMapRows.reduce((sum, row) => 
      sum + (row.rootPhysicalRisk || 0) + (row.rootTransferRisk || 0), 0
    );
    const avgRisk = totalRisk / (data.esg.heatMap.heatMapRows.length * 2);
    
    if (avgRisk > 50) return 'High';
    if (avgRisk > 25) return 'Medium';
    return 'Low';
  }

  protected getTotalExposure(): number {
    const data = this.climateDataService.data();
    if (!data) return 0;
    
    const blackTotal = data.esg.blackCredit?.totalBlackCredit?.totalCreditRisk || 0;
    const greenTotal = data.esg.greenCredit?.totalGreenCredit?.totalCreditRisk || 0;
    
    return blackTotal + greenTotal;
  }

  protected getGreenBlackRatio(): number {
    const data = this.climateDataService.data();
    if (!data) return 0;
    
    const blackTotal = data.esg.blackCredit?.totalBlackCredit?.totalCreditRisk || 0;
    const greenTotal = data.esg.greenCredit?.totalGreenCredit?.totalCreditRisk || 0;
    const total = blackTotal + greenTotal;
    
    return total > 0 ? Math.round((greenTotal / total) * 100) : 0;
  }

  protected getHeatMapCardClass(row: HeatMapRow): string {
    const riskLevel = this.calculateRiskLevel(row.rootPhysicalRisk, row.rootTransferRisk);
    return riskLevel.toLowerCase() + '-risk';
  }

  protected getRiskLevelClass(physicalRisk: number | null, transferRisk: number | null): string {
    const riskLevel = this.calculateRiskLevel(physicalRisk, transferRisk);
    return riskLevel.toLowerCase();
  }

  protected getRiskLevel(physicalRisk: number | null, transferRisk: number | null): string {
    return this.calculateRiskLevel(physicalRisk, transferRisk);
  }

  private calculateRiskLevel(physicalRisk: number | null, transferRisk: number | null): string {
    const physical = physicalRisk || 0;
    const transfer = transferRisk || 0;
    const avgRisk = (physical + transfer) / 2;
    
    if (avgRisk > 35) return 'High';
    if (avgRisk > 15) return 'Medium';
    return 'Low';
  }

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
}
