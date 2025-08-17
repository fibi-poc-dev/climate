# Filter Panel Migration Guide

This guide explains how to migrate from component-specific filter implementations to the generic `FilterPanelComponent`.

## Summary of Changes

The filter panel functionality has been extracted from the ESG component into a reusable `FilterPanelComponent` that provides:

1. **Centralized Filter Management**: All filter-related state and logic in one place
2. **Consistent UI**: Standardized toolbar, active filters display, and filter chips
3. **Reusable Across Components**: Can be used in Carbon Footprint, Green Credit, and other components
4. **Event-Driven Architecture**: Clean separation between filter management and business logic

## Files Created

### Core Filter Panel Component
- `src/app/components/filter-panel/filter-panel.component.ts` - Main component logic
- `src/app/components/filter-panel/filter-panel.component.html` - Template with toolbar and active filters
- `src/app/components/filter-panel/filter-panel.component.css` - FIBI-compliant styling
- `src/app/components/filter-panel/README.md` - Detailed documentation

### Example Implementation
- `src/app/components/filter-panel-example/filter-panel-example.component.ts` - Example usage

## Files Modified

### ESG Component
- `src/app/components/esg/esg.component.ts` - Updated to use FilterPanelComponent
- `src/app/components/esg/esg.component.html` - Template restructured to use filter panel

## Migration Steps for Other Components

### 1. Import the FilterPanelComponent

```typescript
import { FilterPanelComponent, FilterFieldDefinition } from '../filter-panel/filter-panel.component';

@Component({
    imports: [
        // ... other imports
        FilterPanelComponent
    ],
    // ...
})
```

### 2. Define Filter Fields

```typescript
export class YourComponent {
    protected readonly filterFields: FilterFieldDefinition[] = [
        {
            fieldName: 'customerName',
            displayName: 'שם לקוח',
            filterType: 'text',
            defaultOperator: '='
        },
        {
            fieldName: 'amount',
            displayName: 'סכום',
            filterType: 'numeric',
            defaultOperator: '='
        }
    ];
}
```

### 3. Replace Filter Management Code

**Before (Component-specific):**
```typescript
// Multiple filter-related signals and methods
protected readonly accountNameFilter = signal('');
protected readonly amountFilter = signal('');
protected readonly filterOperator = signal('=');

protected clearFilters(): void {
    this.accountNameFilter.set('');
    this.amountFilter.set('');
}

protected updateFilter(field: string, value: string): void {
    // Component-specific filter logic
}
```

**After (Filter Panel):**
```typescript
// Single event handler
protected onFiltersChange(filters: Filter[]): void {
    // Apply filters to your data
    this.applyFilters(filters);
}

protected onClearAllFilters(): void {
    // Handle filter clearing
    this.resetData();
}
```

### 4. Update Template

**Before:**
```html
<!-- Custom toolbar -->
<p-toolbar>
    <div class="p-toolbar-group-start">
        <!-- Date picker -->
    </div>
    <div class="p-toolbar-group-end">
        <p-button label="נקה מסננים" (onClick)="clearFilters()"></p-button>
        <p-button label="יצא לאקסל" (onClick)="exportData()"></p-button>
    </div>
</p-toolbar>

<!-- Active filters display -->
<div class="active-filters" *ngIf="hasFilters()">
    <!-- Custom filter chips -->
</div>
```

**After:**
```html
<app-filter-panel
    [filterFields]="filterFields"
    [showToolbar]="true"
    [showActiveFilters]="true"
    [showClearButton]="true"
    [showExportButton]="true"
    (filtersChange)="onFiltersChange($event)"
    (clearAllFilters)="onClearAllFilters()"
    (exportData)="onExportData()">
    
    <!-- Custom toolbar content -->
    <div slot="toolbar-start">
        <!-- Your date picker or other controls -->
    </div>

    <!-- Your main content (tables, charts, etc.) -->
    <your-content></your-content>
</app-filter-panel>
```

### 5. Handle Filter Logic

```typescript
private applyFilters(filters: Filter[]): void {
    let filteredData = [...this.originalData];

    filters.forEach(filter => {
        const { filterFieldName: field, filterFieldValue: value, filterType: operator } = filter;
        
        filteredData = filteredData.filter(item => {
            const itemValue = (item as any)[field];
            
            if (this.isNumericField(field)) {
                return this.applyNumericFilter(itemValue, value, operator);
            } else {
                return this.applyTextFilter(itemValue, value);
            }
        });
    });

    this.filteredData.set(filteredData);
}
```

## Benefits of Migration

### For Developers
1. **Reduced Code Duplication**: Filter logic written once, used everywhere
2. **Consistent Behavior**: Same filter experience across all components
3. **Easier Maintenance**: Updates to filter logic automatically apply to all components
4. **Better Testing**: Filter logic can be tested independently

### For Users
1. **Consistent UI**: Same filter interface across all screens
2. **Familiar Experience**: Learn once, use everywhere
3. **Better Performance**: Optimized filter operations
4. **Enhanced Features**: Advanced filtering capabilities available everywhere

## Best Practices

1. **Filter Field Naming**: Use meaningful, consistent field names across components
2. **Display Names**: Provide clear Hebrew display names for all filters
3. **Operator Selection**: Choose appropriate default operators for each field type
4. **Event Handling**: Keep filter event handlers lightweight and focused
5. **State Management**: Use signals for reactive filter state management

## Common Patterns

### Text Filtering
```typescript
{
    fieldName: 'customerName',
    displayName: 'שם לקוח',
    filterType: 'text',
    defaultOperator: '='
}
```

### Numeric Filtering with Operators
```typescript
{
    fieldName: 'creditAmount',
    displayName: 'סכום אשראי',
    filterType: 'numeric',
    defaultOperator: '>='
}
```

### Custom Toolbar Actions
```typescript
readonly customActions = [
    {
        id: 'advanced-search',
        label: 'חיפוש מתקדם',
        icon: 'pi pi-search-plus',
        severity: 'info'
    }
];
```

## Testing the Implementation

1. **Run the application**: `ng serve`
2. **Navigate to the ESG component** to see the migrated implementation
3. **Test filtering functionality**: Add filters, clear filters, export data
4. **Check the example component** for reference implementation

## Next Steps

1. **Migrate Carbon Footprint Component**: Apply the same pattern
2. **Migrate Green Credit Component**: Use FilterPanelComponent
3. **Update Main Report Component**: Replace custom filters
4. **Add Advanced Features**: Date range filters, multi-select filters, etc.
5. **Create Component Tests**: Add unit tests for filter functionality

This migration provides a solid foundation for consistent filtering across the entire Climate App while reducing code duplication and improving maintainability.
