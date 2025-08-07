import { ChangeDetectionStrategy, Component, input, output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

// Filter event interface
export interface FilterChangeEvent {
  fieldName: string;
  value: string;
  operator: string;
}

// Filter type enum
export type FilterType = 'text' | 'numeric';

// Filter operator type
export type FilterOperator = '=' | 'gt' | 'lt' | 'gte' | 'lte';

@Component({
  selector: 'app-filter-field',
  imports: [CommonModule, FormsModule, InputTextModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [ngClass]="containerClass()">
      @if (filterType() === 'numeric') {
        <!-- Numeric Filter with Button Operators -->
        <div class="operator-buttons" 
             [class.visible]="currentValue() || false">
          @for (op of availableOperators(); track op) {
            <button type="button" 
                    class="operator-btn"
                    [class.active]="currentOperator() === op"
                    (click)="onOperatorChange(op)"
                    [title]="getOperatorTooltip(op)">
              {{ getOperatorSymbol(op) }}
            </button>
          }
        </div>
        <input type="text" 
               pInputText
               [placeholder]="placeholder()"
               [value]="currentValue()"
               (input)="onValueChange($any($event.target).value)"
               class="filter-input filter-amount">
      } @else {
        <!-- Text Filter -->
        <input type="text" 
               pInputText
               [placeholder]="placeholder()"
               [value]="currentValue()"
               (input)="onValueChange($any($event.target).value)"
               class="filter-input">
      }
    </div>
  `,
  styleUrl: './filter-field.component.css'
})
export class FilterFieldComponent {
  // Input properties
  fieldName = input.required<string>();
  filterType = input<FilterType>('text');
  placeholder = input<string>('');
  value = input<string>('');
  operator = input<FilterOperator>('=');

  // Output events
  filterChange = output<FilterChangeEvent>();

  // Internal state
  private readonly _currentValue = signal('');
  private readonly _currentOperator = signal<FilterOperator>('=');

  // Computed properties
  protected readonly currentValue = computed(() => this.value() || this._currentValue());
  protected readonly currentOperator = computed(() => this.operator() || this._currentOperator());

  protected readonly containerClass = computed(() => 
    this.filterType() === 'numeric' ? 'filter-controls-buttons' : 'filter-controls-text'
  );

  protected readonly availableOperators = computed((): FilterOperator[] => {
    if (this.filterType() === 'numeric') {
      return ['=', 'gt', 'lt', 'gte', 'lte'];
    }
    return ['='];
  });

  // Event handlers
  protected onValueChange(value: string): void {
    this._currentValue.set(value);
    this.emitFilterChange(value, this.currentOperator());
  }

  protected onOperatorChange(operator: FilterOperator): void {
    this._currentOperator.set(operator);
    this.emitFilterChange(this.currentValue(), operator);
  }

  private emitFilterChange(value: string, operator: FilterOperator): void {
    this.filterChange.emit({
      fieldName: this.fieldName(),
      value,
      operator
    });
  }

  // Helper methods
  protected getOperatorSymbol(operator: FilterOperator): string {
    const symbols: Record<FilterOperator, string> = {
      '=': '=',
      'gt': '>',
      'lt': '<',
      'gte': '>=',
      'lte': '<='
    };
    return symbols[operator] || '=';
  }

  protected getOperatorTooltip(operator: FilterOperator): string {
    const tooltips: Record<FilterOperator, string> = {
      '=': 'שווה ל',
      'gt': 'גדול מ',
      'lt': 'קטן מ',
      'gte': 'גדול או שווה ל',
      'lte': 'קטן או שווה ל'
    };
    return tooltips[operator] || 'שווה ל';
  }
}
