import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPanelComponent, FilterFieldDefinition, FilterChangeEvent, FilterClearEvent } from '../filter-panel/filter-panel.component';
import { Filter } from '../../models/climate-request.model';

// PrimeNG imports
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

// Example data interface
interface SampleData {
    id: number;
    name: string;
    amount: number;
    status: string;
    category: string;
}

@Component({
    selector: 'app-filter-panel-example',
    imports: [
        CommonModule,
        FilterPanelComponent,
        TableModule,
        CardModule,
        TagModule
    ],
    template: `
        <div class="filter-panel-example-container" dir="rtl">
            <h2>דוגמה לשימוש ברכיב פנל מסננים</h2>
            
            <!-- Filter Panel Usage -->
            <app-filter-panel
                [filterFields]="filterFields"
                [showToolbar]="true"
                [showActiveFilters]="true"
                [showClearButton]="true"
                [showExportButton]="true"
                [showDataFetchButton]="false"
                [customActions]="customActions"
                (filtersChange)="onFiltersChange($event)"
                (filterChange)="onFilterChange($event)"
                (filterClear)="onFilterClear($event)"
                (clearAllFilters)="onClearAllFilters()"
                (exportData)="onExportData()"
                (customAction)="onCustomAction($event)">
                
                <!-- Custom toolbar content -->
                <div slot="toolbar-start">
                    <span style="font-weight: bold; color: #18285f;">דוגמה - רכיב מסננים גנרי</span>
                </div>

                <!-- Example table with filtered data -->
                <p-card header="נתונים מסוננים">
                    <p-table [value]="filteredData()" [paginator]="true" [rows]="5" 
                             styleClass="p-datatable-striped p-datatable-sm">
                        <ng-template pTemplate="header">
                            <tr>
                                <th>מזהה</th>
                                <th>שם</th>
                                <th>סכום</th>
                                <th>סטטוס</th>
                                <th>קטגוריה</th>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="body" let-item>
                            <tr>
                                <td>{{ item.id }}</td>
                                <td>{{ item.name }}</td>
                                <td>{{ formatCurrency(item.amount) }}</td>
                                <td>
                                    <p-tag [severity]="getStatusSeverity(item.status)" 
                                           [value]="item.status"></p-tag>
                                </td>
                                <td>{{ item.category }}</td>
                            </tr>
                        </ng-template>
                    </p-table>
                </p-card>
                
                <!-- Filter Statistics -->
                <p-card header="סטטיסטיקות מסננים" *ngIf="activeFilters().length > 0">
                    <div class="stats-container">
                        <div class="stat-item">
                            <strong>מסננים פעילים:</strong> {{ activeFilters().length }}
                        </div>
                        <div class="stat-item">
                            <strong>נתונים מסוננים:</strong> {{ filteredData().length }} מתוך {{ sampleData.length }}
                        </div>
                        <div class="stat-item">
                            <strong>סכום כולל מסונן:</strong> {{ formatCurrency(totalFilteredAmount()) }}
                        </div>
                    </div>
                </p-card>
                
            </app-filter-panel>
        </div>
    `,
    styles: [`
        .filter-panel-example-container {
            padding: 1rem;
            font-family: Arial, sans-serif;
        }
        
        .stats-container {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .stat-item {
            padding: 0.5rem;
            background-color: #f8f9fa;
            border-radius: 4px;
            border-left: 4px solid #18285f;
        }
    `]
})
export class FilterPanelExampleComponent {
    // Sample data
    readonly sampleData: SampleData[] = [
        { id: 1, name: 'לקוח א', amount: 150000, status: 'פעיל', category: 'בנקאות' },
        { id: 2, name: 'לקוח ב', amount: 250000, status: 'השהוי', category: 'ביטוח' },
        { id: 3, name: 'לקוח ג', amount: 100000, status: 'פעיל', category: 'בנקאות' },
        { id: 4, name: 'לקוח ד', amount: 300000, status: 'לא פעיל', category: 'השקעות' },
        { id: 5, name: 'לקוח ה', amount: 180000, status: 'פעיל', category: 'ביטוח' },
        { id: 6, name: 'לקוח ו', amount: 220000, status: 'השהוי', category: 'בנקאות' },
        { id: 7, name: 'לקוח ז', amount: 350000, status: 'פעיל', category: 'השקעות' },
        { id: 8, name: 'לקוח ח', amount: 120000, status: 'לא פעיל', category: 'ביטוח' }
    ];

    // Filter field definitions
    readonly filterFields: FilterFieldDefinition[] = [
        {
            fieldName: 'name',
            displayName: 'שם לקוח',
            filterType: 'text',
            defaultOperator: '='
        },
        {
            fieldName: 'amount',
            displayName: 'סכום',
            filterType: 'numeric',
            defaultOperator: '='
        },
        {
            fieldName: 'status',
            displayName: 'סטטוס',
            filterType: 'text',
            defaultOperator: '='
        },
        {
            fieldName: 'category',
            displayName: 'קטגוריה',
            filterType: 'text',
            defaultOperator: '='
        }
    ];

    // Custom actions
    readonly customActions = [
        {
            id: 'refresh',
            label: 'רענן נתונים',
            icon: 'pi pi-refresh',
            severity: 'info'
        },
        {
            id: 'print',
            label: 'הדפס',
            icon: 'pi pi-print',
            severity: 'secondary'
        }
    ];

    // Signals
    readonly activeFilters = signal<Filter[]>([]);
    readonly filteredData = signal<SampleData[]>(this.sampleData);
    readonly totalFilteredAmount = signal<number>(
        this.sampleData.reduce((sum, item) => sum + item.amount, 0)
    );

    // Event handlers
    onFiltersChange(filters: Filter[]): void {
        this.activeFilters.set(filters);
        this.applyFilters(filters);
        console.log('Filters changed:', filters);
    }

    onFilterChange(event: FilterChangeEvent): void {
        console.log('Individual filter changed:', event);
    }

    onFilterClear(event: FilterClearEvent): void {
        console.log('Filter cleared:', event.fieldName);
    }

    onClearAllFilters(): void {
        this.activeFilters.set([]);
        this.filteredData.set(this.sampleData);
        this.updateTotalAmount();
        console.log('All filters cleared');
    }

    onExportData(): void {
        const csv = this.convertToCSV(this.filteredData());
        this.downloadCSV(csv, 'filtered-data.csv');
        console.log('Exporting data...');
    }

    onCustomAction(event: { action: string, data?: any }): void {
        switch(event.action) {
            case 'refresh':
                console.log('Refreshing data...');
                // Simulate data refresh
                break;
            case 'print':
                console.log('Printing data...');
                window.print();
                break;
        }
    }

    // Helper methods
    private applyFilters(filters: Filter[]): void {
        let filtered = [...this.sampleData];

        filters.forEach(filter => {
            const { filterFieldName: field, filterFieldValue: value, filterType: operator } = filter;
            
            filtered = filtered.filter(item => {
                const itemValue = (item as any)[field];
                
                if (field === 'amount') {
                    const numValue = parseFloat(value);
                    const itemNum = itemValue;
                    
                    switch(operator) {
                        case '>': return itemNum > numValue;
                        case '<': return itemNum < numValue;
                        case '>=': return itemNum >= numValue;
                        case '<=': return itemNum <= numValue;
                        case '=': 
                        default: return itemNum === numValue;
                    }
                } else {
                    // Text filtering
                    return itemValue?.toString().toLowerCase().includes(value.toLowerCase());
                }
            });
        });

        this.filteredData.set(filtered);
        this.updateTotalAmount();
    }

    private updateTotalAmount(): void {
        const total = this.filteredData().reduce((sum, item) => sum + item.amount, 0);
        this.totalFilteredAmount.set(total);
    }

    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('he-IL', {
            style: 'currency',
            currency: 'ILS',
            minimumFractionDigits: 0
        }).format(amount);
    }

    getStatusSeverity(status: string): string {
        switch(status) {
            case 'פעיל': return 'success';
            case 'השהוי': return 'warning';
            case 'לא פעיל': return 'danger';
            default: return 'secondary';
        }
    }

    private convertToCSV(data: SampleData[]): string {
        const headers = ['מזהה', 'שם', 'סכום', 'סטטוס', 'קטגוריה'];
        const csvData = data.map(row => [
            row.id,
            row.name,
            row.amount,
            row.status,
            row.category
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
}
