# Filter Panel Component

A generic, reusable filter panel component for Angular applications that provides a consistent interface for filtering data across different components.

## Features

- **Generic Filter Management**: Supports both text and numeric filters with customizable operators
- **Active Filters Display**: Shows currently active filters as removable chips
- **Toolbar Integration**: Configurable toolbar with standard actions (clear, export, fetch data)
- **Custom Actions**: Support for custom toolbar actions
- **Content Projection**: Flexible content areas for custom filter controls
- **Signal-based**: Uses Angular signals for reactive state management
- **FIBI UI Compliant**: Follows FIBI design guidelines and color scheme

## Usage

### Basic Usage

```typescript
// In your component
import { FilterPanelComponent, FilterFieldDefinition } from './filter-panel/filter-panel.component';

@Component({
  imports: [FilterPanelComponent, ...otherImports],
  // ...
})
export class YourComponent {
  // Define your filter fields
  protected readonly filterFields: FilterFieldDefinition[] = [
    {
      fieldName: 'accountName',
      displayName: 'שם לקוח',
      filterType: 'text',
      defaultOperator: '='
    },
    {
      fieldName: 'totalCredit',
      displayName: 'סך אשראי',
      filterType: 'numeric',
      defaultOperator: '='
    }
  ];

  // Handle filter changes
  onFiltersChange(filters: Filter[]): void {
    // Process the active filters
    console.log('Active filters:', filters);
  }

  onClearAllFilters(): void {
    // Handle clear all filters
  }

  onExportData(): void {
    // Handle data export
  }
}
```

```html
<!-- In your template -->
<app-filter-panel
  [filterFields]="filterFields"
  [showToolbar]="true"
  [showActiveFilters]="true"
  [showClearButton]="true"
  [showExportButton]="true"
  [showDataFetchButton]="true"
  (filtersChange)="onFiltersChange($event)"
  (clearAllFilters)="onClearAllFilters()"
  (exportData)="onExportData()">
  
  <!-- Custom toolbar content -->
  <div slot="toolbar-start">
    <p-datepicker [(ngModel)]="selectedDate"></p-datepicker>
  </div>

  <!-- Your filter controls go here -->
  <div class="your-filter-content">
    <!-- Add your filter fields, tables, etc. -->
  </div>
</app-filter-panel>
```

### Advanced Usage with Custom Actions

```typescript
export class YourComponent {
  customActions = [
    {
      id: 'refresh',
      label: 'רענן',
      icon: 'pi pi-refresh',
      severity: 'info',
      data: { action: 'refresh' }
    },
    {
      id: 'save',
      label: 'שמור',
      icon: 'pi pi-save',
      severity: 'success'
    }
  ];

  onCustomAction(event: { action: string, data?: any }): void {
    switch(event.action) {
      case 'refresh':
        this.refreshData();
        break;
      case 'save':
        this.saveFilters();
        break;
    }
  }
}
```

```html
<app-filter-panel
  [filterFields]="filterFields"
  [customActions]="customActions"
  (customAction)="onCustomAction($event)">
  <!-- content -->
</app-filter-panel>
```

## API

### Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `filterFields` | `FilterFieldDefinition[]` | `[]` | Array of filter field definitions |
| `showToolbar` | `boolean` | `true` | Whether to show the toolbar |
| `showActiveFilters` | `boolean` | `true` | Whether to show active filters panel |
| `showClearButton` | `boolean` | `true` | Whether to show clear filters button |
| `showExportButton` | `boolean` | `false` | Whether to show export button |
| `showDataFetchButton` | `boolean` | `false` | Whether to show data fetch button |
| `customActions` | `any[]` | `[]` | Array of custom action configurations |

### Outputs

| Event | Type | Description |
|-------|------|-------------|
| `filtersChange` | `Filter[]` | Emitted when filters change |
| `filterChange` | `FilterChangeEvent` | Emitted when a single filter changes |
| `filterClear` | `FilterClearEvent` | Emitted when a filter is cleared |
| `clearAllFilters` | `void` | Emitted when all filters are cleared |
| `exportData` | `void` | Emitted when export button is clicked |
| `fetchData` | `void` | Emitted when fetch data button is clicked |
| `customAction` | `{action: string, data?: any}` | Emitted when custom action is triggered |

### Public Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `updateFilterValue` | `fieldName: string, value: string` | Update a filter's value |
| `updateFilterOperator` | `fieldName: string, operator: string` | Update a filter's operator |
| `clearFilters` | none | Clear all filters |
| `removeFilter` | `fieldName: string` | Remove a specific filter |
| `setFilters` | `filters: {[fieldName: string]: {value: string, operator?: string}}` | Set multiple filters at once |
| `getCurrentFilters` | none | Get current filter states |
| `hasActiveFilters` | none | Check if any filters are active |

## Interfaces

### FilterFieldDefinition
```typescript
interface FilterFieldDefinition {
    fieldName: string;        // Unique field identifier
    displayName: string;      // Human-readable name
    filterType: 'text' | 'numeric'; // Type of filter
    defaultOperator: string;  // Default operator (=, >, <, etc.)
}
```

### FilterState
```typescript
interface FilterState {
    value: string;
    operator: string;
}
```

### FilterChangeEvent
```typescript
interface FilterChangeEvent {
    fieldName: string;
    value: string;
    operator: string;
}
```

## Content Projection Slots

- `toolbar-start`: Content for the start of the toolbar
- `toolbar-end`: Content for the end of the toolbar  
- Default slot: Main filter content area

## Styling

The component follows FIBI UI guidelines with:
- Blue color scheme: `rgba(24, 40, 95, 1)`
- Yellow accent: `rgba(255, 193, 14, 1)`
- Arial font family
- Responsive design for mobile devices

## Migration from ESG Component

To migrate from the existing ESG component:

1. Replace the filter-related properties and methods with the FilterPanelComponent
2. Move filter field definitions to the new format
3. Update event handlers to use the new output events
4. Move the toolbar and active filters HTML to the FilterPanelComponent
5. Update CSS to use the component's styling classes

## Best Practices

1. Define filter fields as constants or readonly properties
2. Use computed signals for derived filter states
3. Handle filter changes reactively with effects
4. Provide meaningful display names in Hebrew
5. Use appropriate filter types (text vs numeric)
6. Implement proper error handling for filter operations
