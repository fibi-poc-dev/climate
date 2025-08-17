import { ChangeDetectionStrategy, Component, inject, signal, computed, OnInit, OnDestroy, ElementRef, effect, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClimateDataService } from '../../services/climate-data.service';
import { SharedService } from '../../services/shared.service';
import { ClimateColor, CustomerRating } from '../../models/climate-response.model';
import { ClimateRequest, RequestSection, Filter } from '../../models/climate-request.model';
import { EditableFieldComponent } from '../../form-controls/editable-field.component';
import { FilterField, FilterChangeEvent } from '../../form-controls/filter-field/filter-field';
import { FilterPanelComponent, FilterFieldDefinition, FilterState, FilterChangeEvent as FilterPanelChangeEvent } from '../filter-panel/filter-panel.component';

// Interface for editable fields
interface EditableField {
    originalValue: number | null;
    currentValue: number | null;
    isEditing: boolean;
    isDirty: boolean;
}

// Interface for inline filter (edit-field like filter)
interface InlineFilterState {
    fieldName: string;
    isActive: boolean;
    value: string;
    operator: string;
    displayName: string;
}

// Define all editable numeric fields
interface EditableFieldDefinition {
    key: string;
    label: string;
    formatType: 'number' | 'currency' | 'percentage';
    getValue: (row: EsgMainReportRow) => number | null | undefined;
}

const EDITABLE_FIELDS: EditableFieldDefinition[] = [
    { key: 'creditRedCluster', label: 'קלאסטר אשראי אדום', formatType: 'number', getValue: (row) => row.creditRedCluster },
    { key: 'rootPhysicalRisk', label: 'סיכון פיזי שורשי', formatType: 'number', getValue: (row) => row.rootPhysicalRisk },
    { key: 'rootTransferRisk', label: 'סיכון מעבר שורשי', formatType: 'number', getValue: (row) => row.rootTransferRisk },
    { key: 'rootPhysicalRiskScale', label: 'משקל סיכון פיזי שורשי', formatType: 'number', getValue: (row) => row.rootPhysicalRiskScale },
    { key: 'rootTransferRiskScale', label: 'משקל סיכון מעבר שורשי', formatType: 'number', getValue: (row) => row.rootTransferRiskScale },
    { key: 'rootRiskLevelWeight', label: 'שקלול רמת הסיכון השורשי', formatType: 'number', getValue: (row) => row.rootRiskLevelWeight },
    { key: 'residualRisk', label: 'סיכון שיורי', formatType: 'number', getValue: (row) => row.residualRisk },
    { key: 'qualityManagement', label: 'איכות ניהול', formatType: 'number', getValue: (row) => row.qualityManagement },
    { key: 'blackCluster', label: 'קלאסטר שחור', formatType: 'number', getValue: (row) => row.blackCluster },
    { key: 'greenCluster', label: 'קלאסטר ירוק', formatType: 'number', getValue: (row) => row.greenCluster },
    { key: 'totalCollateral', label: 'סך בטחונות', formatType: 'currency', getValue: (row) => row.totalCollateral },
    { key: 'totalSolo', label: 'סך סולו', formatType: 'currency', getValue: (row) => row.totalSolo },
    { key: 'creditBalanceSheetRisk', label: 'סיכון אשראי מאזני', formatType: 'currency', getValue: (row) => row.creditBalanceSheetRisk },
    { key: 'creditOffBalanceSheetRisk', label: 'סיכון אשראי חוץ מאזני', formatType: 'currency', getValue: (row) => row.creditOffBalanceSheetRisk },
    { key: 'totalCreditRisk', label: 'סה"כ סיכון אשראי', formatType: 'currency', getValue: (row) => row.totalCreditRisk }
];

// Define filter field configurations
const FILTER_FIELDS: FilterFieldDefinition[] = [
    {
        fieldName: 'bank',
        displayName: 'בנק',
        filterType: 'text',
        defaultOperator: '='
    },
    {
        fieldName: 'branch',
        displayName: 'סניף',
        filterType: 'text',
        defaultOperator: '='
    },
    {
        fieldName: 'account',
        displayName: 'חשבון',
        filterType: 'text',
        defaultOperator: '='
    },
    {
        fieldName: 'accountName',
        displayName: 'שם לקוח',
        filterType: 'text',
        defaultOperator: '='
    },
    {
        fieldName: 'customerRating',
        displayName: 'דירוג לקוח',
        filterType: 'numeric',
        defaultOperator: '='
    },
    {
        fieldName: 'currentCreditAuthority',
        displayName: 'סמכות אשראי נוכחי',
        filterType: 'numeric',
        defaultOperator: '='
    },
    {
        fieldName: 'totalSolo',
        displayName: 'סך סולו',
        filterType: 'numeric',
        defaultOperator: '='
    },
    {
        fieldName: 'totalCreditRisk',
        displayName: 'סך סיכון אשראי',
        filterType: 'numeric',
        defaultOperator: '='
    }
    // Adding new filters is now easy - just specify fieldName, displayName, and filterType
    // The availableOperators will be automatically determined based on filterType
];

// PrimeNG imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressBarModule } from 'primeng/progressbar';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { FieldsetModule } from 'primeng/fieldset';
import { DatePickerModule } from 'primeng/datepicker';
import { AccordionModule } from 'primeng/accordion';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { EsgMainReportRow } from '../../models/esg.model';


@Component({
    selector: 'app-esg-prime',
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        CardModule,
        TagModule,
        ToolbarModule,
        TooltipModule,
        ProgressBarModule,
        DividerModule,
        PanelModule,
        FieldsetModule,
        EditableFieldComponent,
        FilterField,
        FilterPanelComponent,
        DatePickerModule,
        AccordionModule,
        ScrollPanelModule
    ],
    templateUrl: './esg.component.html',
    styleUrl: './esg.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EsgComponent implements OnInit, OnDestroy {
    private climateDataService = inject(ClimateDataService);
    private sharedService = inject(SharedService);
    private elementRef = inject(ElementRef);

    // Access to filter panel component
    @ViewChild(FilterPanelComponent) filterPanel!: FilterPanelComponent;

    // Editable fields map
    private readonly editableFields = signal(new Map<string, EditableField>());

    // Signals for reactive state management
    protected readonly climateData = this.climateDataService.data;
    protected readonly isLoading = this.climateDataService.loading;
    protected readonly scrollY = signal(0);
    protected readonly selectedRow = signal<EsgMainReportRow | null>(null);

    // Date picker signals
    protected readonly selectedDate = signal<Date>(new Date());
    protected readonly selectedMonth = computed(() => this.selectedDate().getMonth() + 1);
    protected readonly selectedYear = computed(() => this.selectedDate().getFullYear());

    // Filter panel configuration
    protected readonly filterFields: FilterFieldDefinition[] = FILTER_FIELDS;

    // Generic filter states - one signal for all filters
    protected readonly filterStates = signal<Map<string, FilterState>>(new Map());

    // Inline filter states for edit-field like filters
    protected readonly inlineFilterStates = signal<Map<string, InlineFilterState>>(new Map());

    // Helper computed signals for easy access to specific filters
    protected readonly accountNameFilter = computed(() =>
        this.filterStates().get('accountName')?.value || ''
    );

    protected readonly currentCreditAuthorityFilter = computed(() =>
        this.filterStates().get('currentCreditAuthority')?.value || ''
    );

    protected readonly currentCreditAuthorityFilterType = computed(() =>
        this.filterStates().get('currentCreditAuthority')?.operator || '='
    );

    // Convert filter type for display in select element
    protected readonly currentCreditAuthorityFilterTypeDisplay = computed(() => {
        const actualType = this.currentCreditAuthorityFilterType();
        switch (actualType) {
            case '>': return 'gt';
            case '<': return 'lt';
            case '>=': return 'gte';
            case '<=': return 'lte';
            default: return '=';
        }
    });

    // ESG Request filter array computed signal - now works with filter panel
    protected readonly esgRequestFilters = computed(() => {
        const filters: Filter[] = [];
        const filterStates = this.filterStates();

        // Iterate through all filter states and create Filter objects
        filterStates.forEach((state, fieldName) => {
            if (state.value.trim()) {
                filters.push({
                    filterFieldName: fieldName,
                    filterFieldValue: state.value.trim(),
                    filterType: state.operator
                });
            }
        });

        return filters;
    });

    // ESG Request section computed signal
    protected readonly esgRequest = computed((): RequestSection => ({
        page: 1,
        filter: this.esgRequestFilters()
    }));

    // Complete Climate Request computed signal
    protected readonly climateRequest = computed((): ClimateRequest => ({
        month: this.selectedMonth(),
        year: this.selectedYear(),
        esgRequest: this.esgRequest(),
        carbonFootprintRequest: { page: 1, filter: [] },
        withoutProjects: { page: 1, filter: [] },
        projectInfrastructureFinancing: { page: 1, filter: [] },
        projectConstructionFinancing: { page: 1, filter: [] }
    }));

    // Scroll to top visibility
    protected readonly showScrollToTop = computed(() => this.scrollY() > 300);

    constructor() {
        // Effect to auto-select first row when data changes
        effect(() => {
            const data = this.esgMainReportData();
            const currentSelection = this.selectedRow();
            const isLoading = this.isLoading();

            // Auto-select first row if:
            // 1. Data is not loading
            // 2. There's data available
            // 3. No row is currently selected OR the currently selected row is not in the filtered data
            if (!isLoading && data.length > 0 && (!currentSelection || !data.includes(currentSelection))) {
                // Use setTimeout to ensure the selection happens after the view updates
                setTimeout(() => {
                    this.selectedRow.set(data[0]);
                }, 0);
            } else if (data.length === 0 && !isLoading) {
                // Clear selection if no data and not loading
                this.selectedRow.set(null);
            }
        });

        // Effect to log filter changes for debugging
        effect(() => {
            const request = this.climateRequest();
            if (request.esgRequest.filter.length > 0) {
                console.log('ESG Request Filters updated:', request.esgRequest.filter);
            }
        });

        // Effect to listen for child filter clearing events
        effect(() => {
            const clearedFromChild = this.sharedService.getClearedFromChild();
            clearedFromChild.forEach(fieldName => {
                // Remove the filter from parent's filter states
                this.filterStates.update(states => {
                    const newStates = new Map(states);
                    newStates.delete(fieldName);
                    return newStates;
                });

                // Acknowledge the clearing
                this.sharedService.acknowledgeChildFilterCleared(fieldName);
            });
        });
    }    // Computed signals for filtered and processed data
    protected readonly esgMainReportData = computed(() => {
        const data = this.climateData();
        return data?.esg?.esgMainReport?.esgMainReportRows || [];
    });

    // Statistics computed signals
    protected readonly totalRows = computed(() => this.esgMainReportData().length);
    protected readonly totalCredit = computed(() =>
        this.esgMainReportData().reduce((sum: number, row: EsgMainReportRow) => sum + (row.totalCreditRisk || 0), 0)
    );
    protected readonly avgRisk = computed(() => {
        const data = this.esgMainReportData();
        if (data.length === 0) return 0;
        return data.reduce((sum: number, row: EsgMainReportRow) => sum + (row.rootRiskLevelWeight || 0), 0) / data.length;
    });

    protected readonly colorDistribution = computed(() => {
        const data = this.esgMainReportData();
        const distribution = { green: 0, yellow: 0, red: 0 };

        data.forEach((row: EsgMainReportRow) => {
            switch (row.climateColor) {
                case ClimateColor.GREEN:
                    distribution.green++;
                    break;
                case ClimateColor.YELLOW:
                    distribution.yellow++;
                    break;
                case ClimateColor.RED:
                    distribution.red++;
                    break;
            }
        });

        return distribution;
    });


    // Heat Map data
    protected readonly heatMapRows = computed(() =>
        this.climateDataService.heatMapData()?.heatMapRows || []
    );
    protected readonly totalHeatMap = computed(() =>
        this.climateDataService.heatMapData()?.totalHeatMap
    );


    // Green Credit data
    protected readonly greenCreditRows = computed(() =>
        this.climateDataService.greenCreditData()?.greenCreditRows || []
    );
    protected readonly totalGreenCredit = computed(() =>
        this.climateDataService.greenCreditData()?.totalGreenCredit
    );

    // Black Credit data
    protected readonly blackCreditRows = computed(() =>
        this.climateDataService.blackCreditData()?.blackCreditRows || []
    );
    protected readonly totalBlackCredit = computed(() =>
        this.climateDataService.blackCreditData()?.totalBlackCredit
    );
    protected readonly totalCommericialRiskWeightedAssetsPercentage = computed(() =>
        this.climateDataService.blackCreditData()?.totalCommericialRiskWeightedAssetsPercentage
    );
    protected readonly totalRiskWeightedAssetsPercentage = computed(() =>
        this.climateDataService.blackCreditData()?.totalRiskWeightedAssetsPercentage
    );

    // ICAAP data
    protected readonly icaapRows = computed(() =>
        this.climateDataService.icaapData()?.icaapRows || []
    );

    // ICAAP data
    protected readonly highCreditRiskRows = computed(() =>
        this.climateDataService.highCreditRiskData()?.highCreditRiskRows || []
    );















    // Methods
    ngOnInit(): void {
        this.setupScrollListener();
        this.initializeInlineFilters();
    }

    ngOnDestroy(): void {
        this.removeScrollListener();
    }

    // Date picker event handler
    onDateChange(date: Date): void {
        if (date) {
            this.selectedDate.set(date);
        }
    }

    private setupScrollListener(): void {
        const container = this.elementRef.nativeElement.querySelector('.esg-prime-container');
        if (container) {
            container.addEventListener('scroll', this.onScroll.bind(this));
        }
    }

    private removeScrollListener(): void {
        const container = this.elementRef.nativeElement.querySelector('.esg-prime-container');
        if (container) {
            container.removeEventListener('scroll', this.onScroll.bind(this));
        }
    }

    private onScroll(event: Event): void {
        const target = event.target as HTMLElement;
        this.scrollY.set(target.scrollTop);
    }

    protected scrollToTop(): void {
        const container = this.elementRef.nativeElement.querySelector('.esg-prime-container');
        if (container) {
            container.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }

    // Filter panel event handlers
    protected onFilterPanelFiltersChange(filters: Filter[]): void {
        // Update local filter states to match the filter panel
        const newStates = new Map<string, FilterState>();
        
        filters.forEach(filter => {
            newStates.set(filter.filterFieldName, {
                value: filter.filterFieldValue,
                operator: filter.filterType
            });
        });
        
        this.filterStates.set(newStates);
        console.log('Filter panel filters updated:', filters);
    }

    protected onFilterPanelClearAll(): void {
        // Clear local filter states
        this.filterStates.set(new Map());
        // Clear any additional filter states if needed
        this.inlineFilterStates.set(new Map());
        console.log('All filters cleared');
    }

    protected onFilterPanelExportData(): void {
        this.exportData();
    }

    protected onFilterPanelFetchData(): void {
        this.sendFiltersToServer();
    }

    protected onFilterPanelFilterChange(event: FilterPanelChangeEvent): void {
        // Handle individual filter changes
        this.filterStates.update(states => {
            const newStates = new Map(states);
            if (event.value.trim()) {
                newStates.set(event.fieldName, {
                    value: event.value,
                    operator: event.operator
                });
            } else {
                newStates.delete(event.fieldName);
            }
            return newStates;
        });
        console.log('Individual filter changed:', event);
    }

    protected clearFilters(): void {
        // This method is now handled by the filter panel
        // Keep for backward compatibility or direct calls
        this.filterStates.set(new Map());
    }

    // Generic filter management methods
    protected updateFilterValue(fieldName: string, value: string): void {
        const currentStates = this.filterStates();
        const newStates = new Map(currentStates);

        if (value.trim()) {
            const existing = newStates.get(fieldName);
            const operator = existing?.operator || this.getDefaultOperator(fieldName);
            newStates.set(fieldName, { value: value.trim(), operator });
        } else {
            newStates.delete(fieldName);
        }

        this.filterStates.set(newStates);
        console.log(`Filter ${fieldName} updated:`, this.climateRequest());
    }

    protected updateFilterOperator(fieldName: string, operator: string): void {
        const currentStates = this.filterStates();
        const newStates = new Map(currentStates);
        const existing = newStates.get(fieldName);

        if (existing) {
            newStates.set(fieldName, { ...existing, operator });
            this.filterStates.set(newStates);
            console.log(`Filter operator ${fieldName} updated:`, this.climateRequest());
        }
    }

    protected getDefaultOperator(fieldName: string): string {
        const fieldDef = FILTER_FIELDS.find(f => f.fieldName === fieldName);
        return fieldDef?.defaultOperator || '=';
    }

    protected getAvailableOperators(fieldName: string): string[] {
        const fieldDef = FILTER_FIELDS.find(f => f.fieldName === fieldName);
        if (!fieldDef) return ['='];

        // Use the generic helper method
        return this.getAvailableOperatorsForType(fieldDef.filterType);
    }

    protected getFilterFieldDefinition(fieldName: string): FilterFieldDefinition | undefined {
        return FILTER_FIELDS.find(f => f.fieldName === fieldName);
    }

    // Helper method to get available operators for any filter type
    protected getAvailableOperatorsForType(filterType: 'text' | 'numeric'): string[] {
        switch (filterType) {
            case 'text':
                return ['='];
            case 'numeric':
                return ['=', '>', '<', '>=', '<='];
            default:
                return ['='];
        }
    }

    // Helper method to create a filter field definition easily
    protected createFilterField(fieldName: string, displayName: string, filterType: 'text' | 'numeric'): FilterFieldDefinition {
        return {
            fieldName,
            displayName,
            filterType,
            defaultOperator: '='
        };
    }

    // Specific methods that use the generic approach
    protected onAccountNameFilterChange(value: string): void {
        this.updateFilterValue('accountName', value);
    }

    protected onCurrentCreditAuthorityFilterChange(value: string): void {
        this.updateFilterValue('currentCreditAuthority', value);
    }

    // Helper method to convert display operator values to actual operators
    protected convertDisplayOperatorToActual(displayValue: string): string {
        switch (displayValue) {
            case 'gt':
                return '>';
            case 'lt':
                return '<';
            case 'gte':
                return '>=';
            case 'lte':
                return '<=';
            default:
                return '=';
        }
    }

    // Generic method to handle operator changes for any numeric filter
    protected onFilterOperatorChange(fieldName: string, displayValue: string): void {
        const actualValue = this.convertDisplayOperatorToActual(displayValue);
        this.updateFilterOperator(fieldName, actualValue);
    }

    protected onCurrentCreditAuthorityFilterTypeChange(value: string): void {
        this.onFilterOperatorChange('currentCreditAuthority', value);
    }

    protected onCustomerRatingFilterTypeChange(value: string): void {
        this.onFilterOperatorChange('customerRating', value);
    }

    protected onTotalSoloFilterTypeChange(value: string): void {
        this.onFilterOperatorChange('totalSolo', value);
    }

    // Filter change handler for FilterFieldComponent - now syncs with filter panel
    protected onFilterFieldChange(event: FilterChangeEvent): void {
        // Update both local state and filter panel
        this.filterStates.update(states => {
            const newStates = new Map(states);
            if (event.value.trim()) {
                newStates.set(event.fieldName, {
                    value: event.value,
                    operator: event.operator
                });
            } else {
                newStates.delete(event.fieldName);
            }
            return newStates;
        });

        // Also update the filter panel if it exists
        if (this.filterPanel) {
            this.filterPanel.updateFilterValue(event.fieldName, event.value);
            if (event.operator !== '=') {
                this.filterPanel.updateFilterOperator(event.fieldName, event.operator);
            }
        }
    }

    // Filter clear handler for FilterField component - now syncs with filter panel
    protected onFilterFieldClear(fieldName: string): void {
        this.removeFilter(fieldName);
        
        // Also clear from filter panel if it exists
        if (this.filterPanel) {
            this.filterPanel.removeFilter(fieldName);
        }
    }

    // Helper methods for FilterField components
    protected getFilterFieldValue(fieldName: string): string {
        return this.filterStates().get(fieldName)?.value || '';
    }

    protected getFilterFieldOperator(fieldName: string): string {
        return this.filterStates().get(fieldName)?.operator || '=';
    }

    protected sendFiltersToServer(): void {
        const request = this.climateRequest();
        console.log('Sending filters to server:', request);
        // Here you would typically call a service method to send the request to the server
        // this.climateDataService.sendFilterRequest(request);
    }

    // Helper methods for template
    protected getFilterValue(fieldName: string): string {
        return this.filterStates().get(fieldName)?.value || '';
    }

    protected getFilterOperator(fieldName: string): string {
        return this.filterStates().get(fieldName)?.operator || this.getDefaultOperator(fieldName);
    }

    protected getFilterOperatorDisplay(fieldName: string): string {
        const operator = this.getFilterOperator(fieldName);
        switch (operator) {
            case '>': return 'gt';
            case '<': return 'lt';
            case '>=': return 'gte';
            case '<=': return 'lte';
            default: return '=';
        }
    }

    protected getFilterOperatorForComponent(fieldName: string): string {
        const operatorDisplay = this.getFilterOperatorDisplay(fieldName);
        // Return the operator display value
        return operatorDisplay;
    }

    // Inline filter methods
    private initializeInlineFilters(): void {
        const inlineFilters = new Map<string, InlineFilterState>();

        // Initialize totalCreditRisk inline filter
        inlineFilters.set('totalCreditRisk', {
            fieldName: 'totalCreditRisk',
            isActive: false,
            value: '',
            operator: '=',
            displayName: 'סך סיכון אשראי'
        });

        this.inlineFilterStates.set(inlineFilters);
    }

    protected getInlineFilter(fieldName: string): InlineFilterState | undefined {
        return this.inlineFilterStates().get(fieldName);
    }

    protected startInlineFilter(fieldName: string): void {
        const currentFilters = new Map(this.inlineFilterStates());
        const filter = currentFilters.get(fieldName);
        if (filter) {
            filter.isActive = true;
            currentFilters.set(fieldName, filter);
            this.inlineFilterStates.set(currentFilters);
        }
    }

    protected cancelInlineFilter(fieldName: string): void {
        const currentFilters = new Map(this.inlineFilterStates());
        const filter = currentFilters.get(fieldName);
        if (filter) {
            filter.isActive = false;
            filter.value = '';
            currentFilters.set(fieldName, filter);
            this.inlineFilterStates.set(currentFilters);
        }
    }

    protected saveInlineFilter(fieldName: string): void {
        const filter = this.inlineFilterStates().get(fieldName);
        if (filter && filter.value.trim()) {
            // Add to the main filter states
            const currentFilters = new Map(this.filterStates());
            currentFilters.set(fieldName, {
                value: filter.value,
                operator: filter.operator
            });
            this.filterStates.set(currentFilters);

            // Deactivate inline filter
            this.cancelInlineFilter(fieldName);
        }
    }

    protected onInlineFilterInput(event: Event, fieldName: string): void {
        const input = event.target as HTMLInputElement;
        const currentFilters = new Map(this.inlineFilterStates());
        const filter = currentFilters.get(fieldName);
        if (filter) {
            filter.value = input.value;
            currentFilters.set(fieldName, filter);
            this.inlineFilterStates.set(currentFilters);
        }
    }

    protected onInlineFilterOperatorChange(fieldName: string, operator: string): void {
        const currentFilters = new Map(this.inlineFilterStates());
        const filter = currentFilters.get(fieldName);
        if (filter) {
            filter.operator = operator;
            currentFilters.set(fieldName, filter);
            this.inlineFilterStates.set(currentFilters);
        }
    }

    protected isNumericFilter(fieldName: string): boolean {
        const fieldDef = this.getFilterFieldDefinition(fieldName);
        return fieldDef?.filterType === 'numeric';
    }

    protected isTextFilter(fieldName: string): boolean {
        const fieldDef = this.getFilterFieldDefinition(fieldName);
        return fieldDef?.filterType === 'text';
    }

    protected getFilterPlaceholder(fieldName: string): string {
        const fieldDef = this.getFilterFieldDefinition(fieldName);
        if (!fieldDef) return '';

        switch (fieldDef.filterType) {
            case 'numeric':
                return 'סכום...';
            case 'text':
                return `סנן לפי ${fieldDef.displayName}...`;
            default:
                return '';
        }
    }

    // Generic filter change handler that can handle both value and operator changes
    protected onGenericFilterChange(fieldName: string, value: string, changeType: 'value' | 'operator' = 'value'): void {
        if (changeType === 'value') {
            this.updateFilterValue(fieldName, value);
        } else {
            // Handle operator conversion for numeric fields
            let actualOperator = value;
            if (this.isNumericFilter(fieldName)) {
                switch (value) {
                    case 'gt': actualOperator = '>'; break;
                    case 'lt': actualOperator = '<'; break;
                    case 'gte': actualOperator = '>='; break;
                    case 'lte': actualOperator = '<='; break;
                    default: actualOperator = '=';
                }
            }
            this.updateFilterOperator(fieldName, actualOperator);
        }
    }

    // Get all configured filter fields
    protected getFilterFieldDefinitions(): FilterFieldDefinition[] {
        return FILTER_FIELDS;
    }

    // Get the column index for a filter field (useful for dynamic template generation)
    protected getFilterColumnIndex(fieldName: string): number {
        const columnMap: { [key: string]: number } = {
            'accountName': 3,        // 4th column (0-indexed)
            'currentCreditAuthority': 5  // 6th column (0-indexed)
        };
        return columnMap[fieldName] ?? -1;
    }

    protected selectRow(row: EsgMainReportRow): void {
        this.selectedRow.set(row);
    }

    protected onRowSelect(event: any): void {
        if (event && event.data) {
            this.selectRow(event.data);
        }
    }

    protected clearSelection(): void {
        this.selectedRow.set(null);
    }

    // Editable field methods
    protected getFieldDefinition(fieldKey: string): EditableFieldDefinition | undefined {
        return EDITABLE_FIELDS.find(field => field.key === fieldKey);
    }

    protected formatValueByType(value: number | null | undefined, formatType: 'number' | 'currency' | 'percentage'): string {
        switch (formatType) {
            case 'currency':
                return this.formatCurrency(value);
            case 'percentage':
                return this.formatPercentage(value ?? null);
            case 'number':
            default:
                return this.formatNumber(value);
        }
    }

    protected getField(fieldKey: string): EditableField | null {
        return this.editableFields().get(fieldKey) ?? null;
    }

    // Generic field value change handler for the new component
    protected onFieldValueChange(fieldName: keyof EsgMainReportRow, value: number | string | null): void {
        const currentSelection = this.selectedRow();
        if (!currentSelection) return;

        // Update the specific field dynamically (same pattern as updateFieldValue)
        (currentSelection as any)[fieldName] = value;
    }

    // Generic field filter change handler
    protected onFieldFilterChange(filter: Filter | null): void {
        const currentStates = this.filterStates();
        const newStates = new Map(currentStates);

        if (filter) {
            // Add or update the filter state
            newStates.set(filter.filterFieldName, {
                value: filter.filterFieldValue,
                operator: filter.filterType
            });

            this.filterStates.set(newStates);
        }
        // Note: Filter removal is handled by the shared service effect when child components clear their filters
    }

    protected startEdit(fieldKey: string, originalValue: number | null | undefined): void {
        const currentFields = this.editableFields();
        const safeOriginalValue = originalValue ?? null;
        currentFields.set(fieldKey, {
            originalValue: safeOriginalValue,
            currentValue: safeOriginalValue,
            isEditing: true,
            isDirty: false
        });
        this.editableFields.set(new Map(currentFields));
    }

    protected saveEdit(fieldKey: string): void {
        const currentFields = this.editableFields();
        const field = currentFields.get(fieldKey);
        if (field) {
            field.isEditing = false;
            field.isDirty = field.currentValue !== field.originalValue;

            // Update the actual data model if needed
            this.updateFieldValue(fieldKey, field.currentValue);

            this.editableFields.set(new Map(currentFields));
        }
    }

    protected cancelEdit(fieldKey: string): void {
        const currentFields = this.editableFields();
        const field = currentFields.get(fieldKey);
        if (field) {
            field.currentValue = field.originalValue;
            field.isEditing = false;
            field.isDirty = false;
            this.editableFields.set(new Map(currentFields));
        }
    }

    protected updateFieldValue(fieldKey: string, newValue: number | null): void {
        const currentSelection = this.selectedRow();
        if (!currentSelection) return;

        // Update the specific field dynamically
        const fieldDef = this.getFieldDefinition(fieldKey);
        if (fieldDef) {
            // In a real application, you would update the backend and refresh the data
            // For now, we'll just update the local object
            (currentSelection as any)[fieldKey] = newValue;
            console.log(`Updated ${fieldKey}:`, newValue);
        }
    }

    protected isFieldEditable(fieldKey: string): boolean {
        return EDITABLE_FIELDS.some(field => field.key === fieldKey);
    }

    protected getEditableFields(): EditableFieldDefinition[] {
        return EDITABLE_FIELDS;
    }

    protected getEditableValue(fieldKey: string, defaultValue: number | null | undefined): number | null {
        const field = this.getField(fieldKey);
        const safeDefaultValue = defaultValue ?? null;
        return field?.isEditing ? field.currentValue : (field?.isDirty ? field.currentValue : safeDefaultValue);
    }

    protected formatHebrewNumberSafe(value: number | null | undefined): string {
        if (value === null || value === undefined) return '';
        return new Intl.NumberFormat('he-IL').format(value);
    }

    protected getFormattedFieldValue(fieldKey: string): string {
        const field = this.getField(fieldKey);
        if (!field?.isEditing) {
            return '';
        }

        // If current value is null or undefined, return empty string
        if (field.currentValue === null || field.currentValue === undefined) {
            return '';
        }

        // Format the number with commas
        return this.formatNumberWithCommas(field.currentValue);
    }

    protected formatNumberWithCommas(value: number | null): string {
        if (value === null || value === undefined) return '';
        return value.toLocaleString('en-US');
    }

    protected onNumberInput(event: Event, fieldKey: string): void {
        const input = event.target as HTMLInputElement;
        const cursorPosition = input.selectionStart || 0;
        const inputValue = input.value;

        // Remove all commas and non-numeric characters except digits
        const cleanedValue = inputValue.replace(/[^\d]/g, '');

        // Convert to number or null if empty
        const numericValue = cleanedValue === '' ? null : parseInt(cleanedValue, 10);

        // Update the field value
        const currentFields = this.editableFields();
        const field = currentFields.get(fieldKey);
        if (field) {
            field.currentValue = numericValue;
            this.editableFields.set(new Map(currentFields));
        }

        // Format the cleaned value with commas
        let formattedValue = '';
        if (numericValue !== null && !isNaN(numericValue)) {
            formattedValue = numericValue.toLocaleString('en-US');
        }

        // Calculate new cursor position
        const originalCommaCount = (inputValue.substring(0, cursorPosition).match(/,/g) || []).length;
        const newCommaCount = (formattedValue.substring(0, cursorPosition).match(/,/g) || []).length;
        const cursorOffset = newCommaCount - originalCommaCount;
        let newCursorPosition = Math.max(0, cursorPosition + cursorOffset);

        // Ensure cursor doesn't go beyond the formatted value length
        newCursorPosition = Math.min(newCursorPosition, formattedValue.length);

        // Set the formatted value and restore cursor position
        input.value = formattedValue;

        // Use setTimeout to ensure the cursor position is set after the value update
        setTimeout(() => {
            input.setSelectionRange(newCursorPosition, newCursorPosition);
        }, 0);
    }

    protected onNumberKeypress(event: KeyboardEvent): void {
        // Allow: backspace, delete, tab, escape, enter
        if ([8, 9, 27, 13, 46].indexOf(event.keyCode) !== -1 ||
            // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
            (event.ctrlKey === true && [65, 67, 86, 88, 90].indexOf(event.keyCode) !== -1) ||
            // Allow home, end, left, right arrows
            (event.keyCode >= 35 && event.keyCode <= 39)) {
            return;
        }

        // Ensure that it is a number and stop the keypress if not
        if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && (event.keyCode < 96 || event.keyCode > 105)) {
            event.preventDefault();
        }
    } protected exportData(): void {
        const data = this.esgMainReportData();
        const csv = this.convertToCSV(data);
        this.downloadCSV(csv, 'esg-main-report.csv');
    }

    protected getClimateColorSeverity(climateColor: number | null | undefined): string {
        switch (climateColor) {
            case ClimateColor.GREEN:
                return 'success';
            case ClimateColor.YELLOW:
                return 'warning';
            case ClimateColor.RED:
                return 'danger';
            default:
                return 'secondary';
        }
    }

    protected getClimateColorLabel(climateColor: number | null | undefined): string {
        switch (climateColor) {
            case ClimateColor.GREEN:
                return 'ירוק';
            case ClimateColor.YELLOW:
                return 'צהוב';
            case ClimateColor.RED:
                return 'אדום';
            default:
                return '';
        }
    }

    protected getCustomerRatingLabel(rating: number | null): string {
        const ratingMap: { [key: number]: string } = {
            [CustomerRating.AAA]: 'AAA',
            [CustomerRating.AA]: 'AA',
            [CustomerRating.A]: 'A',
            [CustomerRating.BBB]: 'BBB',
            [CustomerRating.BB]: 'BB',
            [CustomerRating.B]: 'B',
            [CustomerRating.CCC]: 'CCC'
        };
        return rating !== null ? ratingMap[rating] || '' : '';
    }

    protected formatPercentage(value: number | null): string {
        if (value === null || value === undefined) return '';
        return `${value.toFixed(2)}%`;
    }

    protected formatDate(value: string | null | undefined): string {
        if (!value) return '';
        try {
            return new Date(value).toLocaleDateString('he-IL');
        } catch {
            return value;
        }
    }

    protected formatNumber(value: number | null | undefined): string {
        if (value === null || value === undefined) return '';
        return new Intl.NumberFormat('he-IL').format(value);
    }

    protected formatCurrency(value: number | null | undefined): string {
        if (value === null || value === undefined) return '';
        return new Intl.NumberFormat('he-IL', {
            style: 'currency',
            currency: 'ILS',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    }

    private convertToCSV(data: EsgMainReportRow[]): string {
        if (data.length === 0) return '';

        const headers = [
            'תאריך נכונות נתונים',
            'שם חשבון',
            'דירוג לקוח',
            'סמך אשראי נוכחי',
            'תיאור מגזר מוסדר',
            'תיאור סיווג ענף',
            'צבע אקלים',
            'סיכון אשראי כולל'
        ];

        const csvData = data.map(row => [
            row.dataCorrectnessDate,
            row.accountName || '',
            this.getCustomerRatingLabel(row.customerRating),
            this.formatCurrency(row.currentCreditAuthority),
            row.regualatedSectorDescription || '',
            row.branchClassificatonDescription || '',
            this.getClimateColorLabel(row.climateColor),
            this.formatCurrency(row.totalCreditRisk)
        ]);

        return [headers, ...csvData]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');
    }

    private downloadCSV(csv: string, filename: string): void {
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    protected getFilterDisplayName(fieldName: string): string {
        const field = FILTER_FIELDS.find((f: FilterFieldDefinition) => f.fieldName === fieldName);
        return field?.displayName || fieldName;
    }

    protected getOperatorSymbol(filterType: string): string {
        switch (filterType) {
            case '=': return '=';
            case '>': return '>';
            case '<': return '<';
            case '>=': return '>=';
            case '<=': return '<=';
            default: return filterType;
        }
    }

    protected removeFilter(fieldName: string): void {
        this.filterStates.update(states => {
            const updatedStates = new Map(states);
            updatedStates.delete(fieldName);
            return updatedStates;
        });

        // Use shared service to signal that this field's filter should be cleared
        this.sharedService.clearFilterForField(fieldName);
    }
}
