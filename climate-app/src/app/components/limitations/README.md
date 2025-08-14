# Green Credit Component

This component displays and manages New Green Credit data within the ESG Climate reporting system for the "אשראי ירוק חדש" tab.

## Features

### 📊 Data Display
- Comprehensive table view with all new green credit records
- Real-time statistics showing totals for accounts, balance sheet risk, off-balance sheet risk, and total balance
- Support for Hebrew RTL layout with proper text alignment

### 🔍 Filtering & Search
- **General Search**: Search across account names, descriptions, clusters, and account numbers
- **Green Cluster Filter**: Filter by specific green clusters (Solar Energy, Green Building, Waste Management, etc.)
- **Branch Filter**: Filter by bank branch numbers
- **Clear Filters**: One-click filter reset functionality

### 📈 Sorting
- Sort by any column (date, branch, account, name, description, amounts, etc.)
- Visual sort indicators (↑↓) showing current sort direction
- Click column headers to sort ascending/descending

### 📋 Data Export
- Export filtered data to CSV format
- Includes Hebrew headers and proper encoding
- Maintains data integrity for external analysis

### 🎨 User Interface
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Loading States**: Shows spinner while data is loading
- **Error Handling**: Displays user-friendly error messages
- **No Data State**: Informative message when no data is available

### 🔄 Scrolling Features
- **Custom Scrollbars**: Styled scrollbars with green theme
- **Scroll Progress Indicator**: Fixed indicator showing scroll position
- **Scroll to Top Button**: Appears when scrolling down, smooth scroll to top
- **Sticky Table Headers**: Column headers remain visible when scrolling

### 📊 Statistics Cards
- **Total Accounts**: Count of all accounts in current filter
- **Total Balance Sheet Risk**: Sum of all balance sheet risk amounts
- **Total Off-Balance Sheet Risk**: Sum of all off-balance sheet risk amounts
- **Total Balance**: Sum of all total balance amounts

## Data Structure

The component works with the `NewGreenCredit` data structure:

```typescript
interface NewGreenCreditRow {
  dataCorrectnessDate: string;
  typeRow: number;
  bank: number;
  branch: number;
  account: number;
  accountName: string;
  branchClassificationCode: number;
  branchClassificatonDescription: string;
  originationDate: string;
  displayReason: string;
  climateColor: number;
  climateColorDescription: string;
  greenCluster: number | null;
  greenClusterDescription: string | null;
  creditBalanceSheetRisk: number;
  creditOffBalanceSheetRisk: number;
  totalBalanceSheet: number;
  loanSystemUpdateFlag: number | null;
}
```

## Green Clusters

The system supports various green clusters:
- **25**: אנרגיה מתחדשת - סולארית (Solar Energy)
- **26**: פיתוח טכנולוגיות אקלים (Climate Technology Development)
- **27**: ניהול פסולת ומיחזור (Waste Management & Recycling)
- **28**: בנייה ירוקה וחסכון באנרגיה (Green Building & Energy Saving)
- **29**: תחבורה בת קיימא (Sustainable Transportation)
- **30**: ניהול מים וחיסכון (Water Management & Conservation)
- **31**: חקלאות בת קיימא (Sustainable Agriculture)

## Climate Colors

- **1**: ירוק (Green) - Low climate risk
- **2**: צהוב (Yellow) - Medium climate risk  
- **3**: אדום (Red) - High climate risk

## Usage

The component is automatically loaded when navigating to the "אשראי ירוק חדש" (New Green Credit) tab in the application. It fetches data from the `ClimateDataService` and displays it in an interactive table format.

## Technical Implementation

- **Angular 20**: Uses standalone components with signals for reactive state management
- **TypeScript**: Fully typed with proper interfaces
- **CSS Grid & Flexbox**: Responsive layout design
- **RTL Support**: Full Hebrew right-to-left layout support
- **Accessibility**: Keyboard navigation and screen reader friendly

## Sample Data

The component includes 8 sample green credit accounts with diverse data:
- Multiple green clusters (Solar, Green Building, Waste Management, Water Management, Agriculture, Climate Tech, Transportation)
- Realistic financial amounts and Hebrew company names
- Different branches and climate color classifications
- Various origination dates and display reasons
