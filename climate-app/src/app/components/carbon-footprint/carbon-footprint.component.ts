import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ClimateDataService } from '../../services/climate-data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carbon-footprint',
  template: `
    <div class="carbon-footprint-container">
      <header class="section-header">
        <h1>Carbon Footprint Report</h1>
        <p>Climate data analysis and carbon emission tracking</p>
      </header>

      @if (climateDataService.loading()) {
        <div class="loading-state">
          <p>Loading carbon footprint data...</p>
        </div>
      } @else if (climateDataService.error()) {
        <div class="error-state">
          <p>Error loading data: {{ climateDataService.error() }}</p>
        </div>
      } @else if (hasData()) {
        <div class="data-sections">
          <!-- Heat Map Data -->
          @if (heatMapData()) {
            <section class="data-section">
              <h2>Heat Map Analysis</h2>
              <div class="heat-map-grid">
                @for (row of heatMapData()!.heatMapRows; track row.redCluster) {
                  <div class="heat-map-item">
                    <h3>{{ row.redClusterDescription }}</h3>
                    <div class="risk-metrics">
                      <div class="metric">
                        <span class="label">Physical Risk:</span>
                        <span class="value">{{ row.rootPhysicalRisk }}</span>
                      </div>
                      <div class="metric">
                        <span class="label">Transfer Risk:</span>
                        <span class="value">{{ row.rootTransferRisk }}</span>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </section>
          }

          <!-- Black Credit Data -->
          @if (blackCreditData()) {
            <section class="data-section">
              <h2>Black Credit Analysis</h2>
              <div class="black-credit-summary">
                <div class="summary-card">
                  <h3>Total Black Credit Risk</h3>
                  <p class="total-value">{{ blackCreditData()!.totalBlackCredit.totalCreditRisk | number }}</p>
                </div>
              </div>
            </section>
          }

          <!-- Green Credit Data -->
          @if (greenCreditData()) {
            <section class="data-section">
              <h2>Green Credit Analysis</h2>
              <div class="green-credit-summary">
                <div class="summary-card">
                  <h3>Total Green Credit Risk</h3>
                  <p class="total-value">{{ greenCreditData()!.totalGreenCredit.totalCreditRisk | number }}</p>
                </div>
              </div>
            </section>
          }
        </div>
      } @else {
        <div class="empty-state">
          <p>No carbon footprint data available</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .carbon-footprint-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .section-header {
      margin-bottom: 2rem;
      border-bottom: 2px solid #e0e0e0;
      padding-bottom: 1rem;

      h1 {
        color: #333;
        margin: 0 0 0.5rem 0;
        font-size: 2rem;
      }

      p {
        color: #666;
        margin: 0;
      }
    }

    .data-sections {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .data-section {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      h2 {
        color: #333;
        margin: 0 0 1rem 0;
        font-size: 1.5rem;
        border-bottom: 1px solid #e0e0e0;
        padding-bottom: 0.5rem;
      }
    }

    .heat-map-grid {
      display: grid;
      gap: 1rem;
    }

    .heat-map-item {
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 1rem;

      h3 {
        margin: 0 0 0.5rem 0;
        color: #555;
        font-size: 1.1rem;
      }

      .risk-metrics {
        display: flex;
        gap: 1rem;
      }

      .metric {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;

        .label {
          font-size: 0.875rem;
          color: #666;
        }

        .value {
          font-weight: 600;
          color: #333;
        }
      }
    }

    .summary-card {
      background: #f8f9fa;
      border-radius: 4px;
      padding: 1rem;
      text-align: center;

      h3 {
        margin: 0 0 0.5rem 0;
        color: #555;
      }

      .total-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: #333;
        margin: 0;
      }
    }

    .loading-state,
    .error-state,
    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #666;
      font-size: 1.1rem;
    }

    .error-state {
      color: #d32f2f;
      background-color: #ffebee;
      border: 1px solid #ffcdd2;
      border-radius: 4px;
    }
  `],
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
}
