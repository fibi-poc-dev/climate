import { ChangeDetectionStrategy, Component, inject, signal, computed, OnInit, OnDestroy, ElementRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClimateDataService } from '../../services/climate-data.service';
import { EsgMainReportRow, ClimateColor, CustomerRating } from '../../models/climate-response.model';

// Interface for editable fields
interface EditableField {
    originalValue: number | null;
    currentValue: number | null;
    isEditing: boolean;
    isDirty: boolean;
}

// PrimeNG imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressBarModule } from 'primeng/progressbar';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { FieldsetModule } from 'primeng/fieldset';

@Component({
    selector: 'app-esg-prime',
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        CardModule,
        TagModule,
        InputTextModule,
        ToolbarModule,
        TooltipModule,
        ProgressBarModule,
        DividerModule,
        PanelModule,
        FieldsetModule
    ],
    templateUrl: './esg-prime.component.html',
    styleUrl: './esg-prime.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EsgPrimeComponent implements OnInit, OnDestroy {
    private climateDataService = inject(ClimateDataService);
    private elementRef = inject(ElementRef);

    // Editable fields map
    private readonly editableFields = signal(new Map<string, EditableField>());

    // Signals for reactive state management
    protected readonly climateData = this.climateDataService.data;
    protected readonly isLoading = this.climateDataService.loading;
    protected readonly filterText = signal('');
    protected readonly selectedClimateColor = signal<number | null>(null);
    protected readonly selectedCustomerRating = signal<number | null>(null);
    protected readonly scrollY = signal(0);
    protected readonly selectedRow = signal<EsgMainReportRow | null>(null);

    // Scroll to top visibility
    protected readonly showScrollToTop = computed(() => this.scrollY() > 300);

    constructor() {
        // Effect to auto-select first row when data changes
        effect(() => {
            const data = this.filteredData();
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
    }    // Computed signals for filtered and processed data
    protected readonly esgMainReportData = computed(() => {
        const data = this.climateData();
        return data?.esg?.esgMainReport?.esgMainReportRows || [];
    });

    protected readonly filteredData = computed(() => {
        const data = this.esgMainReportData();
        const filter = this.filterText().toLowerCase();
        const colorFilter = this.selectedClimateColor();
        const ratingFilter = this.selectedCustomerRating();

        return data.filter((row: EsgMainReportRow) => {
            const matchesText = !filter ||
                (row.accountName?.toLowerCase().includes(filter) || false) ||
                (row.regualatedSectorDescription?.toLowerCase().includes(filter) || false) ||
                (row.branchClassificatonDescription?.toLowerCase().includes(filter) || false);

            const matchesColor = colorFilter === null || row.climateColor === colorFilter;
            const matchesRating = ratingFilter === null || row.customerRating === ratingFilter;

            return matchesText && matchesColor && matchesRating;
        });
    });

    // Statistics computed signals
    protected readonly totalRows = computed(() => this.filteredData().length);
    protected readonly totalCredit = computed(() =>
        this.filteredData().reduce((sum: number, row: EsgMainReportRow) => sum + (row.totalCreditRisk || 0), 0)
    );
    protected readonly avgRisk = computed(() => {
        const data = this.filteredData();
        if (data.length === 0) return 0;
        return data.reduce((sum: number, row: EsgMainReportRow) => sum + (row.rootRiskLevelWeight || 0), 0) / data.length;
    });

    protected readonly colorDistribution = computed(() => {
        const data = this.filteredData();
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

    // Methods
    ngOnInit(): void {
        this.setupScrollListener();
    }

    ngOnDestroy(): void {
        this.removeScrollListener();
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

    protected clearFilters(): void {
        this.filterText.set('');
        this.selectedClimateColor.set(null);
        this.selectedCustomerRating.set(null);
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
    protected getField(fieldKey: string): EditableField | undefined {
        return this.editableFields().get(fieldKey);
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

        if (fieldKey === 'totalSolo') {
            // Update the specific field
            currentSelection.totalSolo = newValue;
            console.log('Updated totalSolo:', newValue);
        }
    }

    protected getEditableValue(fieldKey: string, defaultValue: number | null | undefined): number | null {
        const field = this.getField(fieldKey);
        const safeDefaultValue = defaultValue ?? null;
        return field?.isEditing ? field.currentValue : (field?.isDirty ? field.currentValue : safeDefaultValue);
    }

    protected formatHebrewNumberSafe(value: number | null | undefined): string {
        if (value === null || value === undefined) return 'לא זמין';
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
        const data = this.filteredData();
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
                return 'לא ידוע';
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
        return rating !== null ? ratingMap[rating] || 'לא ידוע' : 'לא ידוע';
    }

    protected formatPercentage(value: number | null): string {
        if (value === null || value === undefined) return '0%';
        return `${value.toFixed(2)}%`;
    }

    protected formatDate(value: string | null | undefined): string {
        if (!value) return 'לא זמין';
        try {
            return new Date(value).toLocaleDateString('he-IL');
        } catch {
            return value;
        }
    }

    protected formatNumber(value: number | null | undefined): string {
        if (value === null || value === undefined) return '0';
        return new Intl.NumberFormat('he-IL').format(value);
    }

    protected formatCurrency(value: number | null | undefined): string {
        if (value === null || value === undefined) return '0';
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
}
