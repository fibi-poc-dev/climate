import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PopoverModule } from 'primeng/popover';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

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
    InputTextModule
  ],
  templateUrl: './filter-field.html',
  styleUrl: './filter-field.css'
})
export class FilterField {
  // Inputs
  readonly fieldName = input.required<string>();
  readonly displayName = input.required<string>();
  readonly filterType = input<'text' | 'numeric'>('text');
  readonly value = input<string>('');
  readonly operator = input<string>('=');

  // Outputs
  readonly filterChange = output<FilterChangeEvent>();
  readonly filterClear = output<string>();

  // Internal state
  protected readonly tempValue = signal<string>('');
  protected readonly tempOperator = signal<string>('=');

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
  protected initializeTempValues(): void {
    // Initialize temp values with current values when popover opens
    this.tempValue.set(this.value());
    this.tempOperator.set(this.operator());
  }

  protected applyFilter(): void {
    const value = this.tempValue().trim();
    const operator = this.tempOperator();

    this.filterChange.emit({
      fieldName: this.fieldName(),
      value: value,
      operator: operator
    });
  }

  protected cancelFilter(): void {
    // Reset temp values to current values
    this.tempValue.set(this.value());
    this.tempOperator.set(this.operator());
  }

  protected clearFilter(): void {
    this.filterClear.emit(this.fieldName());
  }

  protected selectOperator(operator: string): void {
    this.tempOperator.set(operator);
  }

  protected onValueInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.tempValue.set(target.value);
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
