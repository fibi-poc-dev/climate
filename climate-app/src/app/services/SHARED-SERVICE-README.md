# Shared Service Documentation

The `SharedService` is a comprehensive utility service for the Climate App that provides common functionality for number formatting, form field management, input validation, and general utilities.

## Features

### 🔢 Number Formatting
- Hebrew number formatting with RTL support
- Comma-separated number formatting
- Percentage formatting
- Safe number conversion and validation

### ✏️ Editable Field Management
- Complete lifecycle management for editable form fields
- Tracks original values, current values, and modification state
- Handles editing mode transitions

### ⌨️ Input Validation
- Real-time number input formatting with cursor position preservation
- Keypress validation for numeric-only inputs
- Input processing utilities

### 🛠️ General Utilities
- Debouncing functions
- Deep object cloning
- Unique ID generation
- Type validation helpers

## Quick Start

### 1. Import the Service

```typescript
import { Component, inject } from '@angular/core';
import { SharedService, EditableField } from '../services/shared.service';

@Component({
  // ... component config
})
export class MyComponent {
  private readonly sharedService = inject(SharedService);
}
```

### 2. Number Formatting Examples

```typescript
// Hebrew number formatting
const hebrewNumber = this.sharedService.formatHebrewNumber(1234567);
// Result: "1,234,567" (in Hebrew numerals with RTL support)

// Comma formatting
const formattedNumber = this.sharedService.formatNumberWithCommas(1234567);
// Result: "1,234,567"

// Percentage formatting
const percentage = this.sharedService.formatPercentage(75.567, 1);
// Result: "75.6%"

// Safe number conversion
const number = this.sharedService.toNumber("1,234.56");
// Result: 1234.56
```

### 3. Editable Field Management

```typescript
// Create an editable field
field: EditableField = this.sharedService.createEditableField(1000);

// Start editing
startEdit(): void {
  this.field = this.sharedService.startEditing(this.field);
}

// Update value
updateValue(newValue: number): void {
  this.field = this.sharedService.updateEditableField(this.field, newValue);
}

// Save changes
save(): void {
  this.field = this.sharedService.saveField(this.field);
}

// Cancel editing
cancel(): void {
  this.field = this.sharedService.cancelEditing(this.field);
}
```

### 4. Input Validation and Formatting

```typescript
// In your template
<input 
  type="text" 
  #numberInput
  [value]="getFormattedValue()"
  (input)="onNumberInput($event, numberInput)"
  (keypress)="onKeypress($event)">

// In your component
onNumberInput(event: Event, inputElement: HTMLInputElement): void {
  const originalCursor = inputElement.selectionStart || 0;
  const result = this.sharedService.processNumberInput(inputElement, originalCursor);
  
  // Update your data model
  this.updateFieldValue(result.numericValue);
  
  // Update display and cursor
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
```

## API Reference

### Number Formatting Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `formatHebrewNumber(value)` | `number \| null` | `string` | Formats number with Hebrew numerals and RTL support |
| `formatHebrewNumberSafe(value)` | `number \| null \| undefined` | `string` | Safe version that handles undefined values |
| `formatNumberWithCommas(value)` | `number \| null` | `string` | Formats number with comma separators |
| `formatPercentage(value, decimals?)` | `number \| null, number` | `string` | Formats as percentage with specified decimal places |
| `removeCommasFromNumber(value)` | `string` | `number \| null` | Extracts numeric value from formatted string |

### Editable Field Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `createEditableField(value)` | `number \| null` | `EditableField` | Creates new editable field |
| `updateEditableField(field, value)` | `EditableField, number \| null` | `EditableField` | Updates field value and modified state |
| `startEditing(field)` | `EditableField` | `EditableField` | Enters editing mode |
| `saveField(field)` | `EditableField` | `EditableField` | Saves changes and exits editing |
| `cancelEditing(field)` | `EditableField` | `EditableField` | Reverts changes and exits editing |

### Input Validation Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `validateNumberKeypress(event)` | `KeyboardEvent` | `boolean` | Validates if keypress should be allowed |
| `processNumberInput(element, cursor)` | `HTMLInputElement, number` | `ProcessResult` | Processes input with formatting and cursor management |
| `isValidNumberInput(value)` | `string` | `boolean` | Checks if string contains valid numeric input |

### Utility Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `debounce(func, wait)` | `Function, number` | `Function` | Creates debounced version of function |
| `deepClone(obj)` | `T` | `T` | Deep clones an object |
| `generateUniqueId(prefix?)` | `string` | `string` | Generates unique identifier |
| `isValidNumber(value)` | `any` | `boolean` | Validates if value is a valid number |
| `toNumber(value)` | `any` | `number \| null` | Safely converts value to number |
| `calculatePercentage(value, total)` | `number, number` | `number` | Calculates percentage |

## EditableField Interface

```typescript
interface EditableField {
  originalValue: number | null;    // The original value before editing
  currentValue: number | null;     // Current value during editing
  isEditing: boolean;              // Whether field is in edit mode
  isModified: boolean;             // Whether current value differs from original
}
```

## Integration with Existing Components

The shared service is designed to integrate seamlessly with existing components. You can gradually migrate existing formatting and validation logic to use the shared service methods.

### Example Migration

**Before:**
```typescript
// In component
protected formatHebrewNumber(value: number | null): string {
  if (value === null || value === undefined) return 'לא זמין';
  return new Intl.NumberFormat('he-IL').format(value);
}
```

**After:**
```typescript
// In component constructor
private readonly sharedService = inject(SharedService);

// Use shared service method
protected formatHebrewNumber(value: number | null): string {
  return this.sharedService.formatHebrewNumber(value);
}
```

## Best Practices

1. **Inject Once**: Use Angular's `inject()` function to get the service instance
2. **Immutable Updates**: The service returns new objects rather than mutating existing ones
3. **Error Handling**: Methods handle null/undefined values gracefully
4. **Performance**: Use debouncing for expensive operations
5. **Consistency**: Use the same formatting methods across all components

## Example Component

See `shared-service-example.component.ts` for a complete working example demonstrating all features of the shared service.
