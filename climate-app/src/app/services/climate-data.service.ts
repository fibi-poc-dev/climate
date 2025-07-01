import { Injectable, signal, computed, inject } from '@angular/core';
import { Observable, BehaviorSubject, EMPTY } from 'rxjs';
import { tap, catchError, shareReplay } from 'rxjs/operators';
import { ClimateResponse } from '../models/climate-response.model';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class ClimateDataService {
  private readonly httpService = inject(HttpService);
  
  // Signals for reactive state management
  private readonly _data = signal<ClimateResponse | null>(null);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  
  // Public readonly signals
  readonly data = this._data.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  
  // Computed signals for easy access to specific data sections
  readonly esgData = computed(() => this.data()?.esg);
  readonly esgMainReport = computed(() => this.data()?.esg.esgMainReport);
  readonly heatMapData = computed(() => this.data()?.esg.heatMap);
  readonly blackCreditData = computed(() => this.data()?.esg.blackCredit);
  readonly greenCreditData = computed(() => this.data()?.esg.greenCredit);
  readonly icaapData = computed(() => this.data()?.esg.icaap);
  
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
    
    this.climateResponse$ = this.httpService.getClimateResponse().pipe(
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
}
