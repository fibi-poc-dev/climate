import { Component, inject } from '@angular/core';
import { SharedService, EditableField } from '../../services/shared.service';

/**
 * Example Component demonstrating how to use the SharedService
 * This shows various utilities and patterns for common UI operations
 */
@Component({
    selector: 'app-shared-service-example',
    template: `
    <div class="example-container">
      <h2>Shared Service Usage Examples</h2>
      
      <!-- Number Formatting Examples -->
      <section class="formatting-examples">
        <h3>Number Formatting</h3>
        <div class="example-row">
          <label>Hebrew Number Format:</label>
          <span>{{ sharedService.formatHebrewNumber(1234567) }}</span>
        </div>
        <div class="example-row">
          <label>Comma Format:</label>
          <span>{{ sharedService.formatNumberWithCommas(1234567) }}</span>
        </div>
        <div class="example-row">
          <label>Percentage Format:</label>
          <span>{{ sharedService.formatPercentage(75.567, 1) }}</span>
        </div>
      </section>

      <!-- Editable Field Example -->
      <section class="editable-examples">
        <h3>Editable Field Management</h3>
        <div class="example-row">
          <label>Sample Value:</label>
          @if (!sampleField.isEditing) {
            <span>
              {{ sharedService.formatHebrewNumber(sampleField.currentValue) }}
              <button (click)="startEditing()">✏️</button>
            </span>
          }
          @if (sampleField.isEditing) {
            <div class="edit-mode">
              <input 
                type="text" 
                #editInput
                [value]="getFormattedValue()"
                (input)="onInput($event, editInput)"
                (keypress)="onKeypress($event)"
                class="edit-input">
              <button (click)="saveEdit()">✓</button>
              <button (click)="cancelEdit()">✗</button>
            </div>
          }
        </div>
      </section>

      <!-- Utility Examples -->
      <section class="utility-examples">
        <h3>Utility Functions</h3>
        <div class="example-row">
          <label>Unique ID:</label>
          <span>{{ uniqueId }}</span>
        </div>
        <div class="example-row">
          <label>Is Valid Number (123):</label>
          <span>{{ sharedService.isValidNumber(123) }}</span>
        </div>
        <div class="example-row">
          <label>Is Valid Number ('abc'):</label>
          <span>{{ sharedService.isValidNumber('abc') }}</span>
        </div>
      </section>
    </div>
  `,
    styles: [`
    .example-container {
      max-width: 800px;
      margin: 20px auto;
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    
    section {
      margin-bottom: 30px;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    
    h3 {
      margin-top: 0;
      color: #333;
    }
    
    .example-row {
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    label {
      font-weight: bold;
      min-width: 180px;
    }
    
    .edit-mode {
      display: flex;
      gap: 5px;
      align-items: center;
    }
    
    .edit-input {
      padding: 4px 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      min-width: 120px;
    }
    
    button {
      padding: 4px 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background: #f5f5f5;
      cursor: pointer;
    }
    
    button:hover {
      background: #e5e5e5;
    }
  `]
})
export class SharedServiceExampleComponent {
    protected readonly sharedService = inject(SharedService);

    // Example editable field
    sampleField: EditableField = this.sharedService.createEditableField(1234567);

    // Example unique ID
    uniqueId: string = this.sharedService.generateUniqueId('example');

    startEditing(): void {
        this.sampleField = this.sharedService.startEditing(this.sampleField);
    }

    saveEdit(): void {
        this.sampleField = this.sharedService.saveField(this.sampleField);
    }

    cancelEdit(): void {
        this.sampleField = this.sharedService.cancelEditing(this.sampleField);
    }

    getFormattedValue(): string {
        return this.sharedService.formatNumberWithCommas(this.sampleField.currentValue);
    }

    onInput(event: Event, inputElement: HTMLInputElement): void {
        const originalCursor = inputElement.selectionStart || 0;
        const result = this.sharedService.processNumberInput(inputElement, originalCursor);

        // Update the field with the numeric value
        this.sampleField = this.sharedService.updateEditableField(this.sampleField, result.numericValue);

        // Update the input display and cursor position
        inputElement.value = result.formattedValue;
        setTimeout(() => {
            inputElement.setSelectionRange(result.newCursorPosition, result.newCursorPosition);
        }, 0);
    }

    onKeypress(event: KeyboardEvent): void {
        if (!this.sharedService.validateNumberKeypress(event)) {
            event.preventDefault();
        }
    }
}
