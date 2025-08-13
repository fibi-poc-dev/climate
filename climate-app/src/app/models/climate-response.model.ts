import { CarbonFootprint } from "./carbon-footprint.model";
import { Esg } from "./esg.model";
import { NewGreenCredit } from "./new-green-credit.model";


/******************************************************************************************************
 * Main Climate Response interface
 * Root interface for the entire climate reporting response
 ******************************************************************************************************/
export interface ClimateResponse {
  month: number;
  year: number;
  esg: Esg;
  carbonFootprint: CarbonFootprint;
  newGreenCredit: NewGreenCredit;
  projectConstructionFinancing: ProjectConstructionFinancing;
}





/**
 * Project Construction Financing Row interface
 */
export interface ProjectConstructionFinancingRow {
  dataCorrectnessDate: string;
  sourceData: number;
  bank: number;
  branch: number;
  account: number;
  accountName: string;
  branchClassificationCode: number;
  branchClassificatonDescription: string;
  creditReportDescription: string;
  currentCreditAuthority: number;
  handlingUnitCode: string;
  regualatedSectorDescription: string;
  creditBalanceSheetRisk: number;
  creditOffBalanceSheetRisk: number;
  totalCreditRisk: number;
  companyType: number;
  publicCompanyMarketValue: number;
  companyName: string;
  companyNumber: number;
  reportType: number;
  endDate: string;
  totalBalanceSheet: number;
  financialDebt: number;
  totalLeaseLiabilities: number;
  negativeEquity: number;
  cashAndCashEquivalents: number;
  revenueTurnover: number;
  capitalMarketFlag: number;
  totalProjectEquity: number;
  totalDebtAdditionalFinancier: number;
  totalBalanceSheetRiskDebt: number;
  ourFinancingShare: number;
  greenBuilding: number;
  projectStage: number;
  greenProject: number;
  greenCluster: number;
  remarks: string;
  officerName: string;
  statusRow: number;
}

/**
 * Project Construction Financing section interface
 */
export interface ProjectConstructionFinancing {
  projectConstructionFinancingRows: ProjectConstructionFinancingRow[];
}


































/**
 * Climate Color enum for better type safety
 */
export enum ClimateColor {
  GREEN = 1,
  YELLOW = 2,
  RED = 3
}

/**
 * Climate Color mapping helper
 */
export const ClimateColorMap = {
  [ClimateColor.GREEN]: 'green',
  [ClimateColor.YELLOW]: 'yellow',
  [ClimateColor.RED]: 'red'
} as const;

/**
 * Customer Rating enum for better type safety
 */
export enum CustomerRating {
  AAA = 1,
  AA = 2,
  A = 3,
  BBB = 4,
  BB = 5,
  B = 6,
  CCC = 7
}

/**
 * Customer Rating mapping helper
 */
export const CustomerRatingMap = {
  [CustomerRating.AAA]: 'AAA',
  [CustomerRating.AA]: 'AA',
  [CustomerRating.A]: 'A',
  [CustomerRating.BBB]: 'BBB',
  [CustomerRating.BB]: 'BB',
  [CustomerRating.B]: 'B',
  [CustomerRating.CCC]: 'CCC'
} as const;

/**
 * Type Row enum for different row types
 */
export enum TypeRow {
  TOTAL = 0,
  ACCOUNT = 1,
  LOAN = 2,
}

/**
 * Source Data enum for different data sources
 */
export enum SourceData {
  ORIGINAL = 1,
  COPY = 2,
  USER_ADDED = 3
}

/**
 * Helper function to get climate color string from number
 */
export function getClimateColorString(climateColor: number | null): string {
  if (climateColor === null) return 'unknown';
  return ClimateColorMap[climateColor as ClimateColor] || 'unknown';
}

/**
 * Helper function to get customer rating string from number
 */
export function getCustomerRatingString(customerRating: number | null): string {
  if (customerRating === null) return 'N/A';
  return CustomerRatingMap[customerRating as CustomerRating] || 'Unknown';
}


