import { ChangeDetectionStrategy, Component, input, output, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface EditableFieldState {
  isEditing: boolean;
  isDirty: boolean;
  originalValue: number | string | null;
  currentValue: number | string | null;
}

@Component({
  selector: 'app-editable-field',
  template: `
    <div class="editable-field" [class.editing]="fieldState().isEditing">
      <!-- Display Mode -->
      <div *ngIf="!fieldState().isEditing" class="display-mode">
        <div class="value-container">
          <div class="current-value-row">
            <span class="current-value" [class.modified]="fieldState().isDirty">
              {{ displayValue() }}
            </span>
            <button class="edit-btn" (click)="startEdit()" title="ערוך ערך">✏️</button>
          </div>
          <div *ngIf="fieldState().isDirty" class="original-value-row">
            <span class="original-indicator">מקורי: {{ formatValue(fieldState().originalValue) }}</span>
          </div>
        </div>
      </div>
      
      <!-- Edit Mode -->
      <div *ngIf="fieldState().isEditing" class="edit-mode">
        <input 
          type="text" 
          class="edit-input"
          [value]="editValue()"
          (input)="onInput($event)"
          (keypress)="onKeypress($event)"
          (keydown)="onKeydown($event)"
          placeholder="הזן ערך חדש"
          #editInput>
        
        <div class="original-value-hint">
          <span class="info-icon">ℹ️</span>
          <span>ערך מקורי: {{ formatValue(fieldState().originalValue) }}</span>
        </div>
        
        <div class="edit-actions">
          <button class="action-btn save" (click)="saveEdit()" [disabled]="!hasValidInput()">✓</button>
          <button class="action-btn cancel" (click)="cancelEdit()">✕</button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./editable-field.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule]
})
export class EditableFieldComponent<T extends number | string | null> {
  // Inputs
  readonly value = input.required<T>();
  readonly fieldName = input.required<string>();
  readonly displayName = input<string>('');
  readonly fieldType = input<'number' | 'currency' | 'text'>('number');
  readonly placeholder = input<string>('הזן ערך');
  readonly disabled = input<boolean>(false);

  // Outputs
  readonly valueChange = output<T>();
  readonly editStart = output<string>();
  readonly editEnd = output<{ fieldName: string; oldValue: T; newValue: T }>();

  // Internal state
  private readonly internalValue = signal<T>(null as T);
  private readonly isEditing = signal(false);
  private readonly isDirty = signal(false);
  private readonly originalValue = signal<T>(null as T);
  private readonly tempEditValue = signal<string>('');

  // Computed properties
  readonly fieldState = computed((): EditableFieldState => ({
    isEditing: this.isEditing(),
    isDirty: this.isDirty(),
    originalValue: this.originalValue(),
    currentValue: this.internalValue()
  }));

  readonly displayValue = computed(() => {
    const val = this.internalValue();
    return this.formatValue(val);
  });

  readonly editValue = computed(() => {
    if (this.isEditing()) {
      return this.tempEditValue();
    }
    return this.formatValueForEdit(this.internalValue());
  });

  readonly hasValidInput = computed(() => {
    const val = this.tempEditValue().trim();
    if (!val) return false;
    
    if (this.fieldType() === 'text') return true;
    
    // For number/currency fields, check if it's a valid number
    const numVal = this.parseNumber(val);
    return !isNaN(numVal);
  });

  constructor() {
    // Sync initial value
    effect(() => {
      const newValue = this.value();
      this.internalValue.set(newValue);
      if (!this.isDirty()) {
        this.originalValue.set(newValue);
      }
    });
  }

  protected startEdit(): void {
    if (this.disabled()) return;
    
    this.isEditing.set(true);
    this.tempEditValue.set(this.formatValueForEdit(this.internalValue()));
    this.editStart.emit(this.fieldName());
    
    // Focus input after view update
    setTimeout(() => {
      const input = document.querySelector('.edit-input') as HTMLInputElement;
      if (input) {
        input.focus();
        input.select();
      }
    }, 0);
  }

  protected saveEdit(): void {
    if (!this.hasValidInput()) return;

    const oldValue = this.internalValue();
    const newValue = this.parseValue(this.tempEditValue().trim());
    
    this.internalValue.set(newValue);
    this.isEditing.set(false);
    this.isDirty.set(newValue !== this.originalValue());
    
    this.valueChange.emit(newValue);
    this.editEnd.emit({
      fieldName: this.fieldName(),
      oldValue,
      newValue
    });
  }

  protected cancelEdit(): void {
    this.isEditing.set(false);
    this.tempEditValue.set('');
  }

  protected onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.tempEditValue.set(target.value);
  }

  protected onKeypress(event: KeyboardEvent): void {
    if (this.fieldType() === 'text') return;

    // Allow numbers, decimal point, minus sign, and control keys
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '-'];
    const controlKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight'];
    
    if (!allowedKeys.includes(event.key) && !controlKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.saveEdit();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.cancelEdit();
    }
  }

  protected formatValue(value: string | number | null): string {
    if (value === null || value === undefined) return '';
    
    switch (this.fieldType()) {
      case 'currency':
        return this.formatCurrency(Number(value));
      case 'number':
        return this.formatNumber(Number(value));
      case 'text':
        return String(value);
      default:
        return String(value);
    }
  }

  private formatValueForEdit(value: T): string {
    if (value === null || value === undefined) return '';
    return String(value);
  }

  private parseValue(valueStr: string): T {
    if (this.fieldType() === 'text') {
      return valueStr as T;
    }
    
    const numValue = this.parseNumber(valueStr);
    return (isNaN(numValue) ? null : numValue) as T;
  }

  private parseNumber(valueStr: string): number {
    // Remove any non-numeric characters except decimal point and minus
    const cleanStr = valueStr.replace(/[^0-9.-]/g, '');
    return parseFloat(cleanStr);
  }

  private formatCurrency(value: number): string {
    if (isNaN(value)) return '';
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  private formatNumber(value: number): string {
    if (isNaN(value)) return '';
    return new Intl.NumberFormat('he-IL', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
  }
}
