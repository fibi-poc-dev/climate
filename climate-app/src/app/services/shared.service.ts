import { Injectable, signal, computed } from '@angular/core';
import { Filter } from '../models/climate-request.model';

export interface EditableField {
    originalValue: number | null;
    currentValue: number | null;
    isEditing: boolean;
    isModified: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class SharedService {

    // ===== NUMBER FORMATTING UTILITIES =====

    /**
     * Formats a number for Hebrew display with proper RTL support
     * Converts numbers to Hebrew numerals with comma separators
     */
    formatHebrewNumber(value: number | null): string {
        if (value === null || value === undefined || isNaN(value)) {
            return '0';
        }

        // Convert to Hebrew numerals and add thousand separators
        const formatted = new Intl.NumberFormat('he-IL').format(value);
        return formatted;
    }

    /**
     * Safe version of Hebrew number formatting that handles undefined values
     */
    formatHebrewNumberSafe(value: number | null | undefined): string {
        if (value === null || value === undefined || isNaN(value)) {
            return '0';
        }
        return this.formatHebrewNumber(value);
    }

    /**
     * Formats a number with comma separators using English locale
     */
    formatNumberWithCommas(value: number | null): string {
        if (value === null || value === undefined || isNaN(value)) {
            return '';
        }
        return value.toLocaleString('en-US');
    }

    /**
     * Removes commas and non-numeric characters from a string, returning only digits
     */
    removeCommasFromNumber(value: string): number | null {
        if (!value || value.trim() === '') return null;
        const cleanedValue = value.replace(/[^\d]/g, '');
        if (cleanedValue === '') return null;
        const numericValue = parseInt(cleanedValue, 10);
        return isNaN(numericValue) ? null : numericValue;
    }

    /**
     * Validates if a string contains only numeric characters and commas
     */
    isValidNumberInput(value: string): boolean {
        return /^[\d,]*$/.test(value);
    }

    // ===== EDITABLE FIELD UTILITIES =====

    /**
     * Creates a new editable field with the given value
     */
    createEditableField(value: number | null): EditableField {
        return {
            originalValue: value,
            currentValue: value,
            isEditing: false,
            isModified: false
        };
    }

    /**
     * Updates an editable field's current value and calculates if it's modified
     */
    updateEditableField(field: EditableField, newValue: number | null): EditableField {
        return {
            ...field,
            currentValue: newValue,
            isModified: newValue !== field.originalValue
        };
    }

    /**
     * Starts editing mode for a field
     */
    startEditing(field: EditableField): EditableField {
        return {
            ...field,
            isEditing: true
        };
    }

    /**
     * Saves changes to a field (updates original value and exits editing mode)
     */
    saveField(field: EditableField): EditableField {
        return {
            originalValue: field.currentValue,
            currentValue: field.currentValue,
            isEditing: false,
            isModified: false
        };
    }

    /**
     * Cancels editing and reverts to original value
     */
    cancelEditing(field: EditableField): EditableField {
        return {
            ...field,
            currentValue: field.originalValue,
            isEditing: false,
            isModified: false
        };
    }

    // ===== INPUT VALIDATION UTILITIES =====

    /**
     * Validates keypress events to only allow numeric input
     * Allows navigation keys, editing shortcuts, and numeric digits
     */
    validateNumberKeypress(event: KeyboardEvent): boolean {
        // Allow: backspace, delete, tab, escape, enter
        if ([8, 9, 27, 13, 46].indexOf(event.keyCode) !== -1 ||
            // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
            (event.ctrlKey === true && [65, 67, 86, 88, 90].indexOf(event.keyCode) !== -1) ||
            // Allow home, end, left, right arrows
            (event.keyCode >= 35 && event.keyCode <= 39)) {
            return true;
        }

        // Ensure that it is a number and stop the keypress if not
        if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && (event.keyCode < 96 || event.keyCode > 105)) {
            return false;
        }

        return true;
    }

    /**
     * Processes number input with real-time formatting and cursor position management
     */
    processNumberInput(
        inputElement: HTMLInputElement,
        originalCursorPosition: number
    ): { formattedValue: string; newCursorPosition: number; numericValue: number | null } {
        const inputValue = inputElement.value;

        // Remove all commas and non-numeric characters except digits
        const cleanedValue = inputValue.replace(/[^\d]/g, '');

        // Convert to number or null if empty
        const numericValue = cleanedValue === '' ? null : parseInt(cleanedValue, 10);

        // Format the cleaned value with commas
        let formattedValue = '';
        if (numericValue !== null && !isNaN(numericValue)) {
            formattedValue = numericValue.toLocaleString('en-US');
        }

        // Calculate new cursor position
        const originalCommaCount = (inputValue.substring(0, originalCursorPosition).match(/,/g) || []).length;
        const newCommaCount = (formattedValue.substring(0, originalCursorPosition).match(/,/g) || []).length;
        const cursorOffset = newCommaCount - originalCommaCount;
        let newCursorPosition = Math.max(0, originalCursorPosition + cursorOffset);

        // Ensure cursor doesn't go beyond the formatted value length
        newCursorPosition = Math.min(newCursorPosition, formattedValue.length);

        return {
            formattedValue,
            newCursorPosition,
            numericValue
        };
    }

    // ===== GENERAL UTILITIES =====

    /**
     * Debounces a function call
     */
    debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
        let timeout: number;
        return (...args: Parameters<T>) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    /**
     * Deep clones an object
     */
    deepClone<T>(obj: T): T {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        if (obj instanceof Date) {
            return new Date(obj.getTime()) as any;
        }

        if (obj instanceof Array) {
            return obj.map(item => this.deepClone(item)) as any;
        }

        if (typeof obj === 'object') {
            const clonedObj = {} as any;
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    clonedObj[key] = this.deepClone(obj[key]);
                }
            }
            return clonedObj;
        }

        return obj;
    }

    /**
     * Generates a unique ID for form fields or other elements
     */
    generateUniqueId(prefix: string = 'id'): string {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Validates if a value is a valid number (including 0)
     */
    isValidNumber(value: any): boolean {
        return typeof value === 'number' && !isNaN(value) && isFinite(value);
    }

    /**
     * Safely converts a value to a number
     */
    toNumber(value: any): number | null {
        if (value === null || value === undefined || value === '') {
            return null;
        }

        if (typeof value === 'number') {
            return isNaN(value) ? null : value;
        }

        if (typeof value === 'string') {
            const cleaned = value.replace(/[^\d.-]/g, '');
            const num = parseFloat(cleaned);
            return isNaN(num) ? null : num;
        }

        return null;
    }

    /**
     * Formats a percentage value with proper display
     */
    formatPercentage(value: number | null, decimals: number = 2): string {
        if (value === null || value === undefined || isNaN(value)) {
            return '0%';
        }
        return `${value.toFixed(decimals)}%`;
    }

    /**
     * Calculates percentage between two values
     */
    calculatePercentage(value: number, total: number): number {
        if (total === 0) return 0;
        return (value / total) * 100;
    }

    // ===== FILTER STATE MANAGEMENT =====

    /**
     * Central filter state management using signals
     * This allows both parent and child components to share filter state
     */
    private readonly clearedFilters = signal<Set<string>>(new Set());
    private readonly clearedFromChild = signal<Set<string>>(new Set());

    /**
     * Get the set of fields that should have their filters cleared
     */
    readonly getClearedFilters = computed(() => this.clearedFilters());

    /**
     * Get the set of fields that were cleared from child components
     */
    readonly getClearedFromChild = computed(() => this.clearedFromChild());

    /**
     * Clear a specific filter field - called by parent component
     */
    clearFilterForField(fieldName: string): void {
        this.clearedFilters.update(cleared => {
            const newSet = new Set(cleared);
            newSet.add(fieldName);
            return newSet;
        });
    }

    /**
     * Clear a filter from child component - called by editable field
     */
    clearFilterFromChild(fieldName: string): void {
        this.clearedFromChild.update(cleared => {
            const newSet = new Set(cleared);
            newSet.add(fieldName);
            return newSet;
        });
    }

    /**
     * Acknowledge that a filter has been cleared - called by child component
     */
    acknowledgeFilterCleared(fieldName: string): void {
        this.clearedFilters.update(cleared => {
            const newSet = new Set(cleared);
            newSet.delete(fieldName);
            return newSet;
        });
    }

    /**
     * Acknowledge that a filter cleared from child has been processed - called by parent
     */
    acknowledgeChildFilterCleared(fieldName: string): void {
        this.clearedFromChild.update(cleared => {
            const newSet = new Set(cleared);
            newSet.delete(fieldName);
            return newSet;
        });
    }

    /**
     * Check if a specific field should clear its filter
     */
    shouldClearFilter(fieldName: string): boolean {
        return this.clearedFilters().has(fieldName);
    }

    /**
     * Check if a specific field was cleared from child
     */
    wasFilterClearedFromChild(fieldName: string): boolean {
        return this.clearedFromChild().has(fieldName);
    }
}
