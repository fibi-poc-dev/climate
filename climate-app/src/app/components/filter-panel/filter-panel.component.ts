import { ChangeDetectionStrategy, Component, input, output, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Filter } from '../../models/climate-request.model';

// PrimeNG imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';

// Interface for filter field definition
export interface FilterFieldDefinition {
    fieldName: string;
    displayName: string;
    filterType: 'text' | 'numeric';
    defaultOperator: string;
}

// Interface for filter state
export interface FilterState {
    value: string;
    operator: string;
}

// Interface for filter change event
export interface FilterChangeEvent {
    fieldName: string;
    value: string;
    operator: string;
}

// Interface for filter clear event
export interface FilterClearEvent {
    fieldName: string;
}

@Component({
    selector: 'app-filter-panel',
    imports: [
        CommonModule,
        FormsModule,
        CardModule,
        ButtonModule,
        ToolbarModule
    ],
    templateUrl: './filter-panel.component.html',
    styleUrl: './filter-panel.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterPanelComponent {
    // Inputs
    readonly filterFields = input<FilterFieldDefinition[]>([]);
    readonly showToolbar = input<boolean>(true);
    readonly showActiveFilters = input<boolean>(true);
    readonly showClearButton = input<boolean>(true);
    readonly showExportButton = input<boolean>(false);
    readonly showDataFetchButton = input<boolean>(false);
    readonly toolbarStartContent = input<string>('');
    readonly customActions = input<any[]>([]);
    
    // Outputs
    readonly filtersChange = output<Filter[]>();
    readonly filterChange = output<FilterChangeEvent>();
    readonly filterClear = output<FilterClearEvent>();
    readonly clearAllFilters = output<void>();
    readonly exportData = output<void>();
    readonly fetchData = output<void>();
    readonly customAction = output<{ action: string, data?: any }>();

    // Internal state
    protected readonly filterStates = signal<Map<string, FilterState>>(new Map());

    // Computed signals
    protected readonly activeFilters = computed(() => {
        const filters: Filter[] = [];
        const filterStates = this.filterStates();

        // Iterate through all filter states and create Filter objects
        filterStates.forEach((state, fieldName) => {
            if (state.value.trim()) {
                filters.push({
                    filterFieldName: fieldName,
                    filterFieldValue: state.value.trim(),
                    filterType: state.operator,
                    displayName: this.getFilterDisplayName(fieldName)
                });
            }
        });

        return filters;
    });

    constructor() {
        // Effect to emit filter changes
        effect(() => {
            const filters = this.activeFilters();
            this.filtersChange.emit(filters);
        });
    }

    // Public methods for parent components to use
    updateFilterValue(fieldName: string, value: string): void {
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
        
        // Emit individual filter change
        this.filterChange.emit({
            fieldName,
            value: value.trim(),
            operator: this.getFilterOperator(fieldName)
        });
    }

    updateFilterOperator(fieldName: string, operator: string): void {
        const currentStates = this.filterStates();
        const newStates = new Map(currentStates);
        const existing = newStates.get(fieldName);

        if (existing) {
            newStates.set(fieldName, { ...existing, operator });
            this.filterStates.set(newStates);
            
            // Emit individual filter change
            this.filterChange.emit({
                fieldName,
                value: existing.value,
                operator
            });
        }
    }

    clearFilters(): void {
        this.filterStates.set(new Map());
        this.clearAllFilters.emit();
    }

    removeFilter(fieldName: string): void {
        this.filterStates.update(states => {
            const updatedStates = new Map(states);
            updatedStates.delete(fieldName);
            return updatedStates;
        });

        this.filterClear.emit({ fieldName });
    }

    // Helper methods
    getFilterValue(fieldName: string): string {
        return this.filterStates().get(fieldName)?.value || '';
    }

    getFilterOperator(fieldName: string): string {
        return this.filterStates().get(fieldName)?.operator || this.getDefaultOperator(fieldName);
    }

    getDefaultOperator(fieldName: string): string {
        const fieldDef = this.filterFields().find(f => f.fieldName === fieldName);
        return fieldDef?.defaultOperator || '=';
    }

    getAvailableOperators(fieldName: string): string[] {
        const fieldDef = this.filterFields().find(f => f.fieldName === fieldName);
        if (!fieldDef) return ['='];

        return this.getAvailableOperatorsForType(fieldDef.filterType);
    }

    getAvailableOperatorsForType(filterType: 'text' | 'numeric'): string[] {
        switch (filterType) {
            case 'text':
                return ['='];
            case 'numeric':
                return ['=', '>', '<', '>=', '<='];
            default:
                return ['='];
        }
    }

    getFilterFieldDefinition(fieldName: string): FilterFieldDefinition | undefined {
        return this.filterFields().find(f => f.fieldName === fieldName);
    }

    getFilterDisplayName(fieldName: string): string {
        const field = this.filterFields().find(f => f.fieldName === fieldName);
        return field?.displayName || fieldName;
    }

    getOperatorSymbol(operator: string): string {
        switch (operator) {
            case '=': return '=';
            case '>': return '>';
            case '<': return '<';
            case '>=': return '>=';
            case '<=': return '<=';
            default: return operator;
        }
    }

    isNumericFilter(fieldName: string): boolean {
        const fieldDef = this.getFilterFieldDefinition(fieldName);
        return fieldDef?.filterType === 'numeric';
    }

    isTextFilter(fieldName: string): boolean {
        const fieldDef = this.getFilterFieldDefinition(fieldName);
        return fieldDef?.filterType === 'text';
    }

    // Event handlers
    protected onExportClick(): void {
        this.exportData.emit();
    }

    protected onFetchDataClick(): void {
        this.fetchData.emit();
    }

    protected onClearFiltersClick(): void {
        this.clearFilters();
    }

    protected onCustomActionClick(action: string, data?: any): void {
        this.customAction.emit({ action, data });
    }

    // Method to set filters from parent (useful for initialization or external updates)
    setFilters(filters: { [fieldName: string]: { value: string, operator?: string } }): void {
        const newStates = new Map<string, FilterState>();
        
        Object.entries(filters).forEach(([fieldName, filterData]) => {
            if (filterData.value.trim()) {
                newStates.set(fieldName, {
                    value: filterData.value.trim(),
                    operator: filterData.operator || this.getDefaultOperator(fieldName)
                });
            }
        });

        this.filterStates.set(newStates);
    }

    // Method to get current filter states (useful for parent components)
    getCurrentFilters(): { [fieldName: string]: FilterState } {
        const result: { [fieldName: string]: FilterState } = {};
        this.filterStates().forEach((state, fieldName) => {
            result[fieldName] = { ...state };
        });
        return result;
    }

    // Method to check if any filters are active
    hasActiveFilters(): boolean {
        return this.activeFilters().length > 0;
    }
}
