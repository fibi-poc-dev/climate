import { Injectable, signal, computed, inject } from '@angular/core';
import { Observable, BehaviorSubject, EMPTY } from 'rxjs';
import { tap, catchError, shareReplay } from 'rxjs/operators';
import { ClimateResponse } from '../models/climate-response.model';
import { HttpService } from './http.service';
import { ClimateRequest } from '../models/climate-request.model';
import { RequestSection } from '../models/climate-request.model';
import { StatusRow } from '../models/enums';
import { CarbonFootprintRow } from '../models/carbon-footprint.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private readonly httpService = inject(HttpService);

  // Signals for reactive state management
  private readonly _data = signal<ClimateResponse | null>(null);
  private readonly _request = signal<ClimateRequest | null>(null);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // Public readonly signals
  readonly data = this._data.asReadonly();
  readonly request = this._request.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  // Computed signals for easy access to specific data sections
  readonly esgData = computed(() => this.data()?.esg);
  readonly esgMainReport = computed(() => this.data()?.esg.esgMainReport);
  readonly heatMapData = computed(() => this.data()?.esg.heatMap);
  readonly blackCreditData = computed(() => this.data()?.esg.blackCredit);
  readonly greenCreditData = computed(() => this.data()?.esg.greenCredit);
  readonly icaapData = computed(() => this.data()?.esg.icaap);
  readonly highCreditRiskData = computed(() => this.data()?.esg.highCreditRisk);
  readonly newGreenCreditData = computed(() => this.data()?.newGreenCredit);
  readonly limitationsData = computed(() => this.data()?.limitations);
  readonly carbonFootprintData = computed(() => this.data()?.carbonFootprint);
  readonly riskData = computed(() => this.data()?.residualRiskQuestionnaire);


  // Cache the HTTP call to avoid multiple requests
  private climateResponse$: Observable<ClimateResponse> | null = null;

  /**
   * Loads climate data if not already loaded
   * Returns the cached observable if already exists
   */
  loadClimateData(): Observable<ClimateResponse> {
    if (this.climateResponse$) {
      return this.climateResponse$;
    }

    this._loading.set(true);
    this._error.set(null);

    this.climateResponse$ = this.httpService.getClimateData(this.request()).pipe(
      tap(data => {
        this._data.set(data);
        this._loading.set(false);
      }),
      catchError(error => {
        this._error.set(error.message || 'Failed to load climate data');
        this._loading.set(false);
        return EMPTY;
      }),
      shareReplay(1) // Cache the result for all subscribers
    );

    return this.climateResponse$;
  }

  /**
   * Forces a refresh of the climate data
   * Clears the cache and makes a new HTTP request
   */
  refreshClimateData(): Observable<ClimateResponse> {
    this.climateResponse$ = null;
    this._data.set(null);
    return this.loadClimateData();
  }

  /**
   * Gets the current data synchronously
   * Returns null if data hasn't been loaded yet
   */
  getCurrentData(): ClimateResponse | null {
    return this._data();
  }

  /**
   * Updates the current data with new climate response
   */
  updateData(data: ClimateResponse): void {
    this._data.set(data);
  }

  /**
   * Checks if data is currently available
   */
  hasData(): boolean {
    return this._data() !== null;
  }

  /**
   * Clears all cached data and resets the service state
   */
  clearData(): void {
    this.climateResponse$ = null;
    this._data.set(null);
    this._loading.set(false);
    this._error.set(null);
  }

  /**
   * Initializes the climate request with default values
   */
  public initClimateRequest() {
    const req: ClimateRequest = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1, // Months are 0-indexed in JS
      esgRequest: {
        page: 1,
        filter: []
      },
      carbonFootprintRequest: {
        page: 1,
        filter: []
      },
      withoutProjects: {
        page: 1,
        filter: []
      },
      projectInfrastructureFinancing: {
        page: 1,
        filter: []
      },
      projectConstructionFinancing: {
        page: 1,
        filter: []
      }
    };

    this._request.set(req);
  }

  /**
   * Updates the ESG request section with new filters
   */
  public updateEsgRequest(esgRequest: RequestSection): void {
    const currentRequest = this._request();
    if (currentRequest) {
      const updatedRequest: ClimateRequest = {
        ...currentRequest,
        esgRequest: esgRequest
      };
      this._request.set(updatedRequest);
    }
  }

  /**
   * Updates the ESG request section with new filters
   */
  public updateProjectConstructionFinancing(projectConstructionFinancing: RequestSection): void {
    const currentRequest = this._request();
    if (currentRequest) {
      const updatedRequest: ClimateRequest = {
        ...currentRequest,
        projectConstructionFinancing: projectConstructionFinancing
      };
      this._request.set(updatedRequest);
    }
  }


  /**
   * Updates the month and year in the climate request
   */
  public updateClimateRequestDate(year: number, month: number): void {
    const currentRequest = this._request();
    if (currentRequest) {
      const updatedRequest: ClimateRequest = {
        ...currentRequest,
        year: year,
        month: month
      };
      this._request.set(updatedRequest);
    }
  }

  // =================================================================================
  // GENERIC FILTERING METHODS FOR CHANGED ROWS
  // =================================================================================

  /**
   * Generic helper function to filter rows based on statusRow
   * Returns only rows with Updated, New, or Deleted status
   */
  private filterChangedRows<T extends { statusRow: number }>(rows: T[]): T[] {
    return rows.filter(row =>
      row.statusRow === StatusRow.Updated ||
      row.statusRow === StatusRow.New ||
      row.statusRow === StatusRow.Deleted
    );
  }

  /**
   * Computed signal that returns only changed carbon footprint main report rows
   */
  readonly changedCarbonFootprintMainReportRows = computed(() => {
    const rows = this.carbonFootprintData()?.carbonFootprintMainReport.carbonFootprintMainReportRows || [];
    return this.filterChangedRows(rows);
  });

  /**
   * Computed signal that returns only changed project construction financing rows
   */
  readonly changedProjectConstructionFinancingRows = computed(() => {
    const rows = this.carbonFootprintData()?.projectConstructionFinancing.projectConstructionFinancingRows || [];
    return this.filterChangedRows(rows);
  });

  /**
   * Computed signal that returns only changed project infrastructure financing rows
   */
  readonly changedProjectInfrastructureFinancingRows = computed(() => {
    const rows = this.carbonFootprintData()?.projectInfrastructureFinancing.projectInfrastructureFinancingRows || [];
    return this.filterChangedRows(rows);
  });

  /**
   * Computed signal that returns only changed without projects rows
   */
  readonly changedWithoutProjectsRows = computed(() => {
    const rows = this.carbonFootprintData()?.withoutProjects.withoutProjectsRows || [];
    return this.filterChangedRows(rows);
  });

  /**
   * Computed signal that returns the total count of all changed rows across all carbon footprint sections
   */
  readonly changedRowsCount = computed(() => {
    return (
      this.changedCarbonFootprintMainReportRows().length +
      this.changedProjectConstructionFinancingRows().length +
      this.changedProjectInfrastructureFinancingRows().length +
      this.changedWithoutProjectsRows().length
    );
  });

  /**
   * Returns a filtered ClimateResponse containing only changed rows
   * This method creates a new ClimateResponse object with only the changed data
   */
  getChangedDataOnly(): ClimateResponse | null {
    const currentData = this.getCurrentData();
    if (!currentData) return null;

    // Create a deep copy of the data with filtered rows
    const filteredData: ClimateResponse = {
      ...currentData,
      carbonFootprint: {
        ...currentData.carbonFootprint,
        carbonFootprintMainReport: {
          ...currentData.carbonFootprint.carbonFootprintMainReport,
          carbonFootprintMainReportRows: this.changedCarbonFootprintMainReportRows()
        },
        projectConstructionFinancing: {
          ...currentData.carbonFootprint.projectConstructionFinancing,
          projectConstructionFinancingRows: this.changedProjectConstructionFinancingRows()
        },
        projectInfrastructureFinancing: {
          ...currentData.carbonFootprint.projectInfrastructureFinancing,
          projectInfrastructureFinancingRows: this.changedProjectInfrastructureFinancingRows()
        },
        withoutProjects: {
          ...currentData.carbonFootprint.withoutProjects,
          withoutProjectsRows: this.changedWithoutProjectsRows()
        }
      }
    };

    return filteredData;
  }

  /**
   * Generic method to get changed rows from any array of objects with statusRow property
   * This can be used for future arrays in other sections (ESG, etc.)
   * 
   * Example usage for ESG data:
   * 
   * // For ESG Main Report rows (if they have statusRow property):
   * readonly changedEsgMainReportRows = computed(() => {
   *   const rows = this.esgMainReport()?.someRowsArray || [];
   *   return this.getChangedRowsFromArray(rows);
   * });
   * 
   * // For any other section with rows:
   * readonly changedSomeOtherSectionRows = computed(() => {
   *   const rows = this.someOtherData()?.rowsArray || [];
   *   return this.getChangedRowsFromArray(rows);
   * });
   */
  getChangedRowsFromArray<T extends { statusRow: number }>(rows: T[]): T[] {
    return this.filterChangedRows(rows);
  }


}
