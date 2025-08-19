import { Component, input, output, signal, computed, viewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PopoverModule } from 'primeng/popover';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { Popover } from 'primeng/popover';
import { RequestSection } from '../../models/climate-request.model';

export interface FilterChangeEvent {
  fieldName: string;
  value: string;
  operator: string;
}

@Component({
  selector: 'app-filter-field',
  imports: [
    CommonModule,
    FormsModule,
    PopoverModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule
  ],
  templateUrl: './filter-field.html',
  styleUrl: './filter-field.css'
})
export class FilterField {
  // Template references
  protected readonly popover = viewChild.required<Popover>('popover');

  // Inputs
  readonly fieldName = input.required<string>();
  readonly displayName = input.required<string>();
  readonly filterType = input<'text' | 'numeric'>('text');
  readonly value = input<string>('');
  readonly operator = input<string>('=');
  readonly requestSection = input.required<RequestSection | undefined>();

  // Internal state
  protected readonly tempValue = signal<string>('');
  protected readonly tempNumericValue = signal<number | null>(null);
  protected readonly tempOperator = signal<string>('=');

  constructor() {
    // Initialize temp values when value or operator inputs change
    effect(() => {
      this.tempValue.set(this.value());
      this.tempOperator.set(this.operator());

      // For numeric types, also set the numeric value
      if (this.filterType() === 'numeric') {
        const numValue = this.value() ? parseFloat(this.value()) : null;
        this.tempNumericValue.set(isNaN(numValue!) ? null : numValue);
      }
    });
  }

  // Computed properties
  protected readonly hasActiveFilter = computed(() => {
    return this.value().trim() !== '';
  });

  protected readonly availableOperators = computed(() => {
    if (this.filterType() === 'text') {
      return ['='];
    } else {
      // For numeric fields
      return ['=', '>', '<', '>=', '<='];
    }
  });

  protected readonly shouldShowOperators = computed(() => {
    return this.filterType() === 'numeric' && this.availableOperators().length > 1;
  });

  protected readonly filterIconClass = computed(() => {
    return this.hasActiveFilter() ? 'filter-icon filter-active' : 'filter-icon';
  });

  // Methods
  protected applyFilter(): void {
    const value = this.tempValue().trim();
    const operator = this.tempOperator();

    const section = this.requestSection();
    if (section && Array.isArray(section.filter)) {
      // If the filter already exists, update its value
      const existingFilter = section.filter.find(f => f.filterFieldName === this.fieldName());
      if (existingFilter) {
        existingFilter.filterFieldValue = value;
        existingFilter.filterType = operator;
      }
      else {
        // If the filter doesn't exist, add a new one
        section.filter.push({
          filterFieldName: this.fieldName(),
          filterFieldValue: value,
          filterType: operator,
          displayName: this.displayName()
        });
      }
    }
  }

  protected cancelFilter(): void {
    // Reset temp values to current values
    this.tempValue.set(this.value());
    this.tempOperator.set(this.operator());
  }

  protected clearFilter(): void {
    const section = this.requestSection();
    if (section && Array.isArray(section.filter)) {
      section.filter = section.filter.filter(f => f.filterFieldName !== this.fieldName());
    }
  }

  protected selectOperator(operator: string): void {
    this.tempOperator.set(operator);
  }

  protected onTextInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.tempValue.set(target.value);
  }

  protected onNumericInput(value: number | null): void {
    this.tempNumericValue.set(value);
    this.tempValue.set(value?.toString() || '');
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.applyFilter();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.cancelFilter();
    }
  }

  protected hasValidInput(): boolean {
    const value = this.tempValue().trim();
    if (!value) return false;

    if (this.filterType() === 'text') return true;

    // For numeric fields, check if it's a valid number
    const numValue = parseFloat(value.replace(/[^0-9.-]/g, ''));
    return !isNaN(numValue);
  }
}
