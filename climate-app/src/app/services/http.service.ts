import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { ClimateResponse, EsgMainReportRow, getClimateColorString, getCustomerRatingString } from '../models/climate-response.model';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/climate-reports'; // Future API endpoint

  /**
   * Gets the complete climate response data
   * Currently returns mock data, will be replaced with actual HTTP call
   */
  getClimateResponse(): Observable<ClimateResponse> {
    // Mock data based on the actual response.json structure
    const mockClimateResponse: ClimateResponse = {
      esg: {
        esgMainReport: {
          esgMainReportRows: [
            {
              dataCorrectnessDate: "2025-06-15T00:00:00",
              sourceData: 1,
              typeRow: 1,
              bank: 31,
              branch: 1,
              account: 343535,
              accountName: "Green Energy Corp",
              customerRating: 2,
              currentCreditAuthority: null,
              handlingUnitCode: "AGAF-121",
              regualatedSectorCode: null,
              regualatedSectorDescription: null,
              branchClassificationCode: 241,
              branchClassificatonDescription: "Sustainable Energy Production",
              subClassification: null,
              creditReportDescription: "Clean Energy Services",
              creditRedCluster: null,
              rootPhysicalRisk: 4121,
              rootTransferRisk: 12,
              rootPhysicalRiskScale: 121,
              rootTransferRiskScale: 222,
              rootRiskLevelWeight: 456,
              residualRisk: 2,
              residualRiskDate: "2026-02-03T00:00:00",
              qualityManagement: null,
              blackCluster: null,
              greenCluster: 26,
              climateColor: 1,
              totalCollateral: 564646,
              totalSolo: 4646,
              creditBalanceSheetRisk: 46465456456,
              creditOffBalanceSheetRisk: 456465465,
              totalCreditRisk: 46921921921,
              statusRow: 0
            },
            {
              dataCorrectnessDate: "2025-06-15T00:00:00",
              sourceData: 1,
              typeRow: 1,
              bank: 31,
              branch: 2,
              account: 222225,
              accountName: "Industrial Manufacturing Ltd",
              customerRating: 5,
              currentCreditAuthority: null,
              handlingUnitCode: "AGAF-121",
              regualatedSectorCode: null,
              regualatedSectorDescription: null,
              branchClassificationCode: 841,
              branchClassificatonDescription: "Traditional Manufacturing",
              subClassification: null,
              creditReportDescription: "Industrial Services",
              creditRedCluster: 13,
              rootPhysicalRisk: 4,
              rootTransferRisk: 5,
              rootPhysicalRiskScale: 5,
              rootTransferRiskScale: 5,
              rootRiskLevelWeight: 3,
              residualRisk: 3,
              residualRiskDate: "2026-02-03T00:00:00",
              qualityManagement: null,
              blackCluster: 31,
              greenCluster: null,
              climateColor: 2,
              totalCollateral: 435,
              totalSolo: 34543,
              creditBalanceSheetRisk: 4546345645,
              creditOffBalanceSheetRisk: 3453,
              totalCreditRisk: 4546349098,
              statusRow: 0
            },
            {
              dataCorrectnessDate: "2025-06-15T00:00:00",
              sourceData: 1,
              typeRow: 1,
              bank: 31,
              branch: 7,
              account: 645643,
              accountName: "Heavy Industries Co",
              customerRating: 5,
              currentCreditAuthority: null,
              handlingUnitCode: "AGAF-121",
              regualatedSectorCode: null,
              regualatedSectorDescription: null,
              branchClassificationCode: 252,
              branchClassificatonDescription: "High Risk Industries",
              subClassification: null,
              creditReportDescription: "Heavy Manufacturing",
              creditRedCluster: 18,
              rootPhysicalRisk: 5,
              rootTransferRisk: 5,
              rootPhysicalRiskScale: 5,
              rootTransferRiskScale: 5,
              rootRiskLevelWeight: 5,
              residualRisk: 5,
              residualRiskDate: "2026-02-03T00:00:00",
              qualityManagement: null,
              blackCluster: 31,
              greenCluster: null,
              climateColor: 3,
              totalCollateral: 435,
              totalSolo: 435,
              creditBalanceSheetRisk: 456456456,
              creditOffBalanceSheetRisk: 435,
              totalCreditRisk: 456456891,
              statusRow: 0
            }
          ],
          totalCommercialCredit: [
            {
              dataCorrectnessDate: "2025-06-15T00:00:00",
              sourceData: 1,
              typeRow: 0,
              bank: null,
              branch: null,
              account: null,
              accountName: null,
              customerRating: null,
              currentCreditAuthority: null,
              handlingUnitCode: null,
              regualatedSectorCode: null,
              regualatedSectorDescription: null,
              branchClassificationCode: null,
              branchClassificatonDescription: null,
              subClassification: null,
              creditReportDescription: null,
              creditRedCluster: null,
              rootPhysicalRisk: null,
              rootTransferRisk: null,
              rootPhysicalRiskScale: null,
              rootTransferRiskScale: null,
              rootRiskLevelWeight: null,
              residualRisk: null,
              residualRiskDate: null,
              qualityManagement: null,
              blackCluster: null,
              greenCluster: null,
              climateColor: null,
              totalCollateral: null,
              totalSolo: null,
              creditBalanceSheetRisk: 3000,
              creditOffBalanceSheetRisk: 4000,
              totalCreditRisk: 7000,
              statusRow: 0
            }
          ],
          totalPublicCredit: [
            {
              dataCorrectnessDate: "2025-06-15T00:00:00",
              sourceData: 1,
              typeRow: 0,
              bank: null,
              branch: null,
              account: null,
              accountName: null,
              customerRating: null,
              currentCreditAuthority: null,
              handlingUnitCode: null,
              regualatedSectorCode: null,
              regualatedSectorDescription: null,
              branchClassificationCode: null,
              branchClassificatonDescription: null,
              subClassification: null,
              creditReportDescription: null,
              creditRedCluster: null,
              rootPhysicalRisk: null,
              rootTransferRisk: null,
              rootPhysicalRiskScale: null,
              rootTransferRiskScale: null,
              rootRiskLevelWeight: null,
              residualRisk: null,
              residualRiskDate: null,
              qualityManagement: null,
              blackCluster: null,
              greenCluster: null,
              climateColor: null,
              totalCollateral: null,
              totalSolo: null,
              creditBalanceSheetRisk: 1000,
              creditOffBalanceSheetRisk: 2000,
              totalCreditRisk: 3000,
              statusRow: 0
            }
          ]
        },
        heatMap: {
          heatMapRows: [
            {
              dataCorrectnessDate: "2025-06-15T00:00:00",
              redCluster: 18,
              redClusterDescription: "Agriculture and Food - Agriculture",
              rootPhysicalRisk: 2,
              rootTransferRisk: 55,
              rootRiskLevelWeight: 2,
              residualRiskAverage: 2,
              qualityManagement: null,
              creditBalanceSheetRisk: null,
              creditOffBalanceSheetRisk: 2,
              totalCreditRisk: 2,
              totalCreditRiskRate: 2
            }
          ],
          totalHeatMap: {
            dataCorrectnessDate: null,
            redCluster: null,
            redClusterDescription: null,
            rootPhysicalRisk: null,
            rootTransferRisk: null,
            rootRiskLevelWeight: null,
            residualRiskAverage: null,
            qualityManagement: null,
            creditBalanceSheetRisk: null,
            creditOffBalanceSheetRisk: null,
            totalCreditRisk: null,
            totalCreditRiskRate: 446
          }
        },
        blackCredit: {
          blackCreditRows: [
            {
              dataCorrectnessDate: "2025-06-15T00:00:00",
              blackCluster: 31,
              blackClusterDescription: "Coal and Gas Power Generation",
              creditBalanceSheetRisk: 5,
              creditOffBalanceSheetRisk: 5,
              totalCreditRisk: 555
            }
          ],
          totalRiskWeightedAssetsPercentage: {
            dataCorrectnessDate: null,
            blackCluster: null,
            blackClusterDescription: null,
            creditBalanceSheetRisk: 12123,
            creditOffBalanceSheetRisk: 133213,
            totalCreditRisk: 1231
          },
          totalCommericialRiskWeightedAssetsPercentage: {
            dataCorrectnessDate: null,
            blackCluster: null,
            blackClusterDescription: null,
            creditBalanceSheetRisk: 786786,
            creditOffBalanceSheetRisk: 67867,
            totalCreditRisk: 1213
          },
          totalBlackCredit: {
            dataCorrectnessDate: null,
            blackCluster: null,
            blackClusterDescription: null,
            creditBalanceSheetRisk: 798914,
            creditOffBalanceSheetRisk: 201085,
            totalCreditRisk: 2999
          }
        },
        greenCredit: {
          greenCreditRows: [
            {
              dataCorrectnessDate: "2025-06-15T00:00:00",
              greenCluster: 26,
              greenClusterDescription: "Climate Technology Development",
              creditBalanceSheetRisk: 5829,
              creditOffBalanceSheetRisk: 465465,
              totalCreditRisk: null
            }
          ],
          totalGreenCredit: {
            dataCorrectnessDate: "2025-06-15T00:00:00",
            greenCluster: null,
            greenClusterDescription: null,
            creditBalanceSheetRisk: 798914,
            creditOffBalanceSheetRisk: 201085,
            totalCreditRisk: 2999
          }
        },
        icaap: {
          icaapRows: [
            {
              dataCorrectnessDate: "2025-06-15T00:00:00",
              minRiskRate: 0,
              maxRiskRate: 3,
              rootCreditBalanceSheetRisk: 64787,
              rootCreditOffBalanceSheetRisk: 89898,
              rootTotalCreditRiskRate: 465764,
              residualCreditBalanceSheetRisk: 546456,
              residualCreditOffBalanceSheetRisk: 456456,
              residualTotalCreditRiskRate: 45645
            }
          ]
        }
      }
    };

    // Simulate network delay
    return of(mockClimateResponse).pipe(delay(500));
    
    // Future implementation:
    // return this.http.get<ClimateResponse>(this.apiUrl);
  }

  /**
   * Gets all ESG main report rows from the climate response
   * Returns the main report data in a simplified format for the list view
   */
  getEsgReports(): Observable<EsgMainReportRow[]> {
    return this.getClimateResponse().pipe(
      map(response => response.esg.esgMainReport.esgMainReportRows)
    );
  }

  /**
   * Gets a specific ESG report by account number
   * Returns a single report row or null if not found
   */
  getEsgReportByAccount(accountNumber: number): Observable<EsgMainReportRow | null> {
    return this.getEsgReports().pipe(
      map(reports => reports.find(r => r.account === accountNumber) || null)
    );
  }
}
